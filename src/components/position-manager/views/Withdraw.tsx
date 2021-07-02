import { ethers } from 'ethers'
import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import Tooltip from '@material-ui/core/Tooltip'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'

import { useEMPProvider, usePosition, usePriceFeed, useTotals, useWeb3Provider } from '../../../hooks'
import { fromWei, getLiquidationPrice, isPricefeedInvertedFromTokenSymbol, toWeiSafe } from '../../../utils'
import { INFINITY, LIQUIDATION_PRICE_WARNING_THRESHOLD, YES } from '../../../constants'

import { FormButton, FormTitle, Loader, TransactionResultArea } from '../../common'

export const Withdraw: React.FC = () => {
    // internal state
    const [collateral, setCollateral] = useState<string>('0')
    const [hash, setHash] = useState<string | undefined>(undefined)
    const [error, setError] = useState<Error | undefined>(undefined)
    const [isCancelling, setIsCancelling] = useState(false)
    const [isWithdrawing, setIsWithdrawing] = useState(false)
    const [isExecutingWithdraw, setIsExecutingWithdraw] = useState(false)

    // read data
    const { address: userAddress } = useWeb3Provider()
    const { collateralState, syntheticState, empState, instance: empInstance } = useEMPProvider()
    const positionState = usePosition(userAddress)
    const totalsState = useTotals()
    const { latestPrice } = usePriceFeed(syntheticState)

    if (collateralState && syntheticState && empState && positionState && totalsState && latestPrice) {
        // position
        const {
            syntheticTokens: positionTokens,
            collateral: positionCollateral,
            withdrawalAmount,
            withdrawalPassTime,
            pendingWithdraw,
        } = positionState
        const positionTokensAsNumber = Number(positionTokens)
        const positionCollateralAsNumber = Number(positionCollateral)
        const withdrawAmountAsNumber = Number(withdrawalAmount)
        const withdrawalPassTimeAsNumber = Number(withdrawalPassTime)

        // tokens
        const { decimals: tokenDecimals, symbol: tokenSymbol } = syntheticState
        const {
            instance: collateralInstance,
            decimals: collateralDecimals,
            symbol: collateralSymbol,
            balance: collateralBalance,
            allowance: collateralAllowance,
        } = collateralState

        const collateralBalanceAsNumber = Number(collateralBalance)
        const collateralAllowanceAsNumber = Number(collateralAllowance)

        // expiring multi party
        const { minSponsorTokens, collateralRequirement, priceIdentifier, isExpired, currentTime, withdrawalLiveness } = empState
        const minSponsorTokensFromWei = parseFloat(
            fromWei(minSponsorTokens, collateralDecimals), // TODO: This should be using the decimals of the token...
        )
        const priceIdentifierUtf8 = ethers.utils.toUtf8String(priceIdentifier)

        // totals
        const { gcr } = totalsState
        const gcrAsNumber = Number(gcr)

        // computed general
        const collateralRequirementFromWei = parseFloat(fromWei(collateralRequirement))

        // input data
        const collateralToWithdraw = Number(collateral) || 0

        // price related
        const prettyLatestPrice = Number(latestPrice).toFixed(4)

        const resultantCollateral = positionCollateralAsNumber - collateralToWithdraw
        const resultantCR = positionTokensAsNumber > 0 ? resultantCollateral / positionTokensAsNumber : 0
        const isResultantCRBelowGCR = resultantCR < gcrAsNumber
        const pricedResultantCR = latestPrice !== 0 ? (resultantCR / latestPrice).toFixed(4) : '0'
        const pricedGCR = latestPrice !== 0 ? (gcrAsNumber / latestPrice).toFixed(4) : null
        const resultantLiquidationPrice = getLiquidationPrice(
            resultantCollateral,
            positionTokensAsNumber,
            collateralRequirementFromWei,
            isPricefeedInvertedFromTokenSymbol(tokenSymbol),
        ).toFixed(4)
        const isLiquidationPriceDangerouslyFarBelowCurrentPrice =
            parseFloat(resultantLiquidationPrice) < (1 - LIQUIDATION_PRICE_WARNING_THRESHOLD) * latestPrice

        // Fast withdrawal amount: can withdraw instantly as long as CR > GCR
        const fastWithdrawableCollateral =
            positionCollateralAsNumber > gcrAsNumber * positionTokensAsNumber
                ? (positionCollateralAsNumber - gcrAsNumber * positionTokensAsNumber).toFixed(4)
                : '0'

        // Pending withdrawal request information:
        const withdrawLivenessString = Math.floor(Number(withdrawalLiveness) / (60 * 60))
        const hasPendingWithdraw = pendingWithdraw === YES
        const pendingWithdrawTimeRemaining = withdrawalPassTimeAsNumber - Number(currentTime)
        const progressBarPercent =
            pendingWithdrawTimeRemaining > 0 ? ((Number(withdrawalLiveness) - pendingWithdrawTimeRemaining) / Number(withdrawalLiveness)) * 100 : 100
        const canExecutePendingWithdraw = hasPendingWithdraw && pendingWithdrawTimeRemaining <= 0
        const pendingWithdrawTimeString =
            pendingWithdrawTimeRemaining > 0
                ? Math.max(0, Math.floor(pendingWithdrawTimeRemaining / 3600)) +
                ':' +
                ('00' + Math.max(0, Math.floor((pendingWithdrawTimeRemaining % 3600) / 60))).slice(-2) +
                ':' +
                ('00' + Math.max(0, (pendingWithdrawTimeRemaining % 3600) % 60)).slice(-2)
                : 'None'

        // Error conditions for calling withdraw:
        const resultantCRBelowRequirement = parseFloat(pricedResultantCR) >= 0 && parseFloat(pricedResultantCR) < collateralRequirementFromWei
        const withdrawAboveBalance = collateralToWithdraw > positionCollateralAsNumber

        // internal functions
        const cancelWithdraw = async () => {
            setIsCancelling(true)
            if (hasPendingWithdraw) {
                setHash(null)
                setError(null)
                try {
                    const tx = await empInstance.cancelWithdrawal()
                    setHash(tx.hash as string)
                    await tx.wait()
                } catch (error) {
                    console.error(error)
                    setError(error)
                }
            } else {
                setError(new Error('No pending withdraw to cancel.'))
            }
            setIsCancelling(false)
        }

        const withdrawCollateral = async () => {
            setIsWithdrawing(true)
            if (collateralToWithdraw > 0) {
                setHash(null)
                setError(null)
                try {
                    const collateralToWithdrawWei = toWeiSafe(collateral, collateralDecimals)
                    if (isResultantCRBelowGCR) {
                        const tx = await empInstance.requestWithdrawal([collateralToWithdrawWei])
                        setHash(tx.hash as string)
                        await tx.wait()
                    } else {
                        const tx = await empInstance.withdraw([collateralToWithdrawWei])
                        setHash(tx.hash as string)
                        await tx.wait()
                    }
                } catch (error) {
                    console.error(error)
                    setError(error)
                }
            } else {
                setError(new Error('Collateral amount must be positive.'))
            }
            setIsWithdrawing(false)
        }

        const executeWithdraw = async () => {
            setIsExecutingWithdraw(true)
            if (canExecutePendingWithdraw) {
                setHash(null)
                setError(null)
                try {
                    const tx = await empInstance.withdrawPassedRequest()
                    setHash(tx.hash as string)
                    await tx.wait()
                } catch (error) {
                    console.error(error)
                    setError(error)
                }
            } else {
                setError(new Error('Cannot execute pending withdraw until liveness period has passed.'))
            }
            setIsExecutingWithdraw(false)
        }

        if (hasPendingWithdraw) {
            // If EMP is expired, user can only cancel pending withdrawal requests.
            if (isExpired) {
                return (
                    <Grid container>
                        <Grid item xs={8}>
                            <Grid container spacing={3}>
                                <Grid item md={12} sm={12} xs={12}>
                                    <FormTitle>You have a pending withdraw on your position</FormTitle>
                                </Grid>

                                <Grid item md={10} sm={10} xs={10}>
                                    <Typography>You may cancel any pending withdrawal requests that you made prior to the EMP expiration.</Typography>
                                </Grid>

                                <Grid item md={10} sm={10} xs={10}>
                                    <Typography>
                                        Post expiry, the only way to remove collateral from this contract is to Settle or Redeem synthetic tokens.
                                    </Typography>
                                </Grid>

                                <Grid item md={10} sm={10} xs={10}>
                                    <Typography>
                                        <strong>Requested withdrawal amount: </strong> {`${withdrawAmountAsNumber} ${collateralSymbol}`}
                                    </Typography>
                                </Grid>

                                <Grid item md={10} sm={10} xs={10}>
                                    <FormButton
                                        onClick={cancelWithdraw}
                                        isSubmitting={isCancelling}
                                        submittingText="Cancelling withdraw request..."
                                        text={`Cancel withdraw request`}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                )
            } else {
                return (
                    <Grid container>
                        <Grid item xs={8}>
                            <Grid container spacing={3}>
                                <Grid item md={12} sm={12} xs={12}>
                                    <FormTitle>You have a pending withdraw on your position</FormTitle>
                                </Grid>

                                <Grid item md={10} sm={10} xs={10}>
                                    <Typography>
                                        Once the liveness period has passed you can execute your withdrawal request. You can cancel the withdraw
                                        request at any time before you execute it.
                                    </Typography>
                                </Grid>

                                <Grid item md={10} sm={10} xs={10}>
                                    <Typography>
                                        <Box display="flex" alignItems="center">
                                            <Box width="100%">
                                                <strong>Time left until withdrawal: </strong>
                                                {pendingWithdrawTimeString}
                                            </Box>
                                            <Box width="100%" mr={1}>
                                                <LinearProgress variant="determinate" value={progressBarPercent} />{' '}
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" color="textSecondary">{`${progressBarPercent.toFixed(4)}%`}</Typography>
                                            </Box>
                                        </Box>
                                        <br></br>
                                        <strong>Requested withdrawal amount: </strong> {`${withdrawalAmount} ${collateralSymbol}`}
                                    </Typography>
                                </Grid>

                                <Grid item md={10} sm={10} xs={10}>
                                    <Box display="flex" flexDirection="horizontal" justifyContent="space-between">
                                        <Box width="45%">
                                            <Tooltip
                                                placement="bottom"
                                                title={
                                                    !canExecutePendingWithdraw &&
                                                    'Once the withdrawal liveness period passes you will be able to click this button'
                                                }
                                            >
                                                <span>
                                                    <FormButton
                                                        onClick={executeWithdraw}
                                                        disabled={!canExecutePendingWithdraw}
                                                        text={`Withdraw ${withdrawalAmount} ${collateralSymbol}`}
                                                        isSubmitting={isExecutingWithdraw}
                                                        submittingText={`Withdrawing ${withdrawalAmount} ${collateralSymbol}...`}
                                                    />
                                                </span>
                                            </Tooltip>
                                        </Box>
                                        <Box width="45%">
                                            <FormButton
                                                onClick={cancelWithdraw}
                                                text={`Cancel withdraw request`}
                                                isSubmitting={isCancelling}
                                                submittingText="Cancelling withdraw request..."
                                            />
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                )
            }
        }

        if (isExpired) {
            return (
                <Box textAlign="center">
                    <Typography>
                        <i>You cannot withdraw from an expired EMP. You may remove collateral by settling or redeeming synthetic tokens.</i>
                    </Typography>
                </Box>
            )
        }

        return (
            <React.Fragment>
                <Grid container>
                    <Grid item xs={6}>
                        <Grid container spacing={3}>
                            <Grid item md={12} sm={12} xs={12}>
                                <FormTitle>{`Withdraw (${collateralSymbol})`}</FormTitle>
                            </Grid>

                            <Grid item md={10} sm={10} xs={10}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    size="small"
                                    variant="outlined"
                                    inputProps={{ min: '0', max: positionCollateral }}
                                    label={`Collateral (${collateralSymbol})`}
                                    error={withdrawAboveBalance}
                                    helperText={withdrawAboveBalance && `Your locked ${collateralSymbol} is too low`}
                                    value={collateral}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCollateral(e.target.value)}
                                />
                            </Grid>

                            <Grid item md={10} sm={10} xs={10}>
                                <Box py={0}>
                                    <FormButton
                                        fullWidth
                                        variant="contained"
                                        onClick={withdrawCollateral}
                                        disabled={resultantCRBelowRequirement || withdrawAboveBalance || collateralToWithdraw <= 0}
                                        isSubmitting={isWithdrawing}
                                        submittingText={isResultantCRBelowGCR ? 'Requesting withdrawal...' : 'Withdrawing instantly...'}
                                        text={`${isResultantCRBelowGCR ? 'Request Withdrawal of' : 'Instantly Withdraw'
                                            } ${collateralToWithdraw} ${collateralSymbol}`}
                                    />
                                </Box>
                            </Grid>

                            <Grid item md={10} sm={10} xs={10} style={{ paddingTop: '0' }}>
                                <TransactionResultArea hash={hash} error={error} />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Right panel */}
                    <Grid item xs={6}>
                        <Box height="100%" flexDirection="column" display="flex" justifyContent="center">
                            <Typography style={{ padding: '0 0 1em 0' }}>
                                {`Resulting liquidation price: `}
                                <Tooltip
                                    placement="right"
                                    title={
                                        isLiquidationPriceDangerouslyFarBelowCurrentPrice &&
                                        parseFloat(resultantLiquidationPrice) > 0 &&
                                        `This is >${LIQUIDATION_PRICE_WARNING_THRESHOLD * 100}% below the current price: ${prettyLatestPrice}`
                                    }
                                >
                                    <span
                                        style={{
                                            color:
                                                isLiquidationPriceDangerouslyFarBelowCurrentPrice && parseFloat(resultantLiquidationPrice) > 0
                                                    ? 'red'
                                                    : 'unset',
                                        }}
                                    >
                                        {resultantLiquidationPrice} ({priceIdentifierUtf8})
                                    </span>
                                </Tooltip>
                            </Typography>

                            <Typography style={{ padding: '0 0 1em 0' }}>
                                {`Resulting CR: `}
                                <Tooltip
                                    placement="right"
                                    title={resultantCRBelowRequirement && `This must be above the requirement: ${collateralRequirementFromWei}`}
                                >
                                    <span
                                        style={{
                                            color: resultantCRBelowRequirement ? 'red' : 'unset',
                                        }}
                                    >
                                        {pricedResultantCR}
                                    </span>
                                </Tooltip>
                            </Typography>
                            <Typography style={{ padding: '0 0 1em 0' }}>{`GCR: ${pricedGCR}`}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }

    return <Loader />
}
