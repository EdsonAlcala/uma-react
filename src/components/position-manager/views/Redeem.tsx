import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import Tooltip from '@material-ui/core/Tooltip'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { ethers } from 'ethers'
import { YES } from '../../../constants'

import { useEMPProvider, usePosition, usePriceFeed, useWeb3Provider } from '../../../hooks'
import { fromWei, toWeiSafe } from '../../../utils'
import { FormButton, FormTitle, Loader, MaxLink, TransactionResultArea } from '../../common'

export const Redeem: React.FC = () => {
    // internal state
    const [collateral, setCollateral] = useState<string>('0')
    const [tokens, setTokens] = useState<string>('0')
    const [hash, setHash] = useState<string | undefined>(undefined)
    const [success, setSuccess] = useState<boolean | undefined>(undefined)
    const [error, setError] = useState<Error | undefined>(undefined)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // read data
    const { address: userAddress } = useWeb3Provider()
    const { collateralState, syntheticState, empState, instance: empInstance } = useEMPProvider()
    const positionState = usePosition(userAddress)
    const { latestPrice } = usePriceFeed(syntheticState)

    if (collateralState && syntheticState && empState && positionState && latestPrice) {
        // position
        const { syntheticTokens: positionTokens, collateral: positionCollateral, pendingWithdraw } = positionState
        const positionTokensAsNumber = Number(positionTokens)
        const positionCollateralAsNumber = Number(positionCollateral)
        const hasPendingWithdraw = pendingWithdraw === YES

        // tokens
        const {
            decimals: tokenDecimals,
            symbol: tokenSymbol,
            balance: tokenBalance,
            balanceBN: tokenBalanceBN,
            allowance: tokenAllowance,
            instance: syntheticInstance
        } = syntheticState
        const {
            decimals: collateralDecimals,
            symbol: collateralSymbol,
            balance: collateralBalance,
            allowance: collateralAllowance
        } = collateralState

        const collateralBalanceAsNumber = Number(collateralBalance)
        const collateralAllowanceAsNumber = Number(collateralAllowance)

        const tokenBalanceAsNumber = Number(tokenBalance)
        const tokenAllowanceAsNumber = Number(tokenAllowance)

        // expiring multi party
        const { minSponsorTokens, collateralRequirement, priceIdentifier } = empState
        const minSponsorTokensFromWei = parseFloat(
            fromWei(minSponsorTokens, collateralDecimals), // TODO: This should be using the decimals of the token...
        )
        const priceIdentifierUtf8 = ethers.utils.toUtf8String(priceIdentifier)

        // input data
        const tokensToRedeem = (Number(tokens) || 0) > positionTokensAsNumber ? positionTokensAsNumber : Number(tokens) || 0

        // computed
        const maxPartialRedeem = positionCollateralAsNumber > minSponsorTokensFromWei ? positionCollateralAsNumber - minSponsorTokensFromWei : 0

        // Note: If not redeeming full position, then cannot bring position below the minimum sponsor token threshold.
        // Amount of collateral received is proportional to percentage of outstanding tokens in position retired.
        const proportionTokensRedeemed = positionTokensAsNumber > 0 ? tokensToRedeem / positionTokensAsNumber : 0
        const proportionCollateralReceived =
            proportionTokensRedeemed <= 1 ? proportionTokensRedeemed * positionCollateralAsNumber : positionCollateralAsNumber

        // computed synthetic
        const resultantTokens = positionTokensAsNumber >= tokensToRedeem ? positionTokensAsNumber - tokensToRedeem : 0

        // computed collateral
        const resultantCollateral = positionCollateralAsNumber - proportionCollateralReceived

        // Error conditions for calling redeem: (Some of these might be redundant)
        const balanceBelowTokensToRedeem = tokenBalanceAsNumber < tokensToRedeem
        const invalidRedeemAmount = tokensToRedeem < positionTokensAsNumber && tokensToRedeem > maxPartialRedeem
        const needAllowance = tokenAllowance !== 'Infinity' && tokenAllowanceAsNumber < tokensToRedeem

        // internal functions
        const redeemTokens = async () => {
            setIsSubmitting(true)
            if (tokensToRedeem > 0) {
                setHash(null)
                setSuccess(null)
                setError(null)
                try {
                    const tokensToRedeemWei = toWeiSafe(tokens, tokenDecimals) // Note: the synthetic token uses the decimals of the collateral
                    const tx = await empInstance.redeem([tokensToRedeemWei])
                    setHash(tx.hash as string)
                    await tx.wait()
                    setSuccess(true)
                } catch (error) {
                    console.error(error)
                    setError(error)
                }
            } else {
                setError(new Error('Token amounts must be positive'))
            }
            setIsSubmitting(false)
        }

        const setTokensToRedeemToMax = () => {
            // `tokenBalance` and `positionTokens` might be incorrectly rounded,
            // so we compare their raw BN's instead.
            if (tokenBalanceBN.gte(toWeiSafe(positionTokens, tokenDecimals))) {
                setTokens(positionTokens)
            } else {
                setTokens(tokenBalance.toString())
            }
        }

        const setMaxAllowance = async () => {
            setIsSubmitting(true)
            setHash(undefined)
            setError(undefined)
            try {
                const receipt = await syntheticInstance.approve(empInstance.address, ethers.constants.MaxUint256)
                setHash(receipt.hash as string)
                await receipt.wait()
            } catch (error) {
                console.error(error)
                setError(error)
            }
            setIsSubmitting(false)
        }

        // optional render views
        if (positionCollateralAsNumber === 0) {
            return (
                <Box textAlign="center">
                    <Typography>
                        <i>You need to borrow tokens before redeeming.</i>
                    </Typography>
                </Box>
            )
        }

        if (hasPendingWithdraw) {
            return (
                <Box textAlign="center">
                    <Typography>
                        <i>You need to cancel or execute your pending withdrawal request before depositing additional collateral.</i>
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
                                <FormTitle>{`Redeem (${tokenSymbol})`}</FormTitle>
                                {/* TODO: Think what to do with this text */}
                                {/* <Box pt={2} pb={4}>
                                    <Typography>
                                        By redeeming your synthetic tokens, you will pay back a portion of
                                        your debt and receive a proportional part of your collateral.
                                        <br></br>
                                        <br></br>
                                        <strong>Note:</strong> this will not change the collateralization
                                        ratio of your position or its liquidation price.
                                        </Typography>
                                    <br></br>
                                    <Typography>
                                        {`When redeeming, you must keep at least ${minSponsorTokensFromWei} ${tokenSymbol} in your position. Currently, you can either redeem exactly ${positionTokensAsNumber} or no more than ${maxPartialRedeem} ${tokenSymbol}`}
                                    </Typography>
                                </Box> */}
                            </Grid>

                            <Grid item md={10} sm={10} xs={10}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type="number"
                                    size="small"
                                    label={`Redeem (${tokenSymbol})`}
                                    inputProps={{ min: '0', max: tokenBalance }}
                                    error={balanceBelowTokensToRedeem || invalidRedeemAmount}
                                    helperText={
                                        invalidRedeemAmount &&
                                        `If you are not redeeming all tokens outstanding, then you must keep more than ${minSponsorTokensFromWei} ${tokenSymbol} in your position`
                                    }
                                    value={tokens}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTokens(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button fullWidth onClick={() => setTokensToRedeemToMax()}>
                                                    <MaxLink>Max</MaxLink>
                                                </Button>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item md={10} sm={10} xs={10}>
                                <Box py={0}>
                                    {needAllowance && (
                                        <FormButton
                                            size="small"
                                            onClick={setMaxAllowance}
                                            isSubmitting={isSubmitting}
                                            submittingText="Approving..."
                                            text="Max Approve"
                                        >
                                            Max Approve
                                        </FormButton>
                                    )}
                                    {!needAllowance && (
                                        <FormButton
                                            disabled={balanceBelowTokensToRedeem || invalidRedeemAmount || tokensToRedeem <= 0}
                                            onClick={redeemTokens}
                                            isSubmitting={isSubmitting}
                                            submittingText="Redeeming tokens..."
                                            text={`Redeem ${tokensToRedeem} ${tokenSymbol}`}
                                        />
                                    )}
                                </Box>
                            </Grid>

                            <Grid item md={10} sm={10} xs={10} style={{ paddingTop: '0' }}>
                                <TransactionResultArea hash={hash} error={error} />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={6}>
                        <Box height="100%" flexDirection="column" display="flex" justifyContent="center">
                            <Typography
                                style={{ padding: '0 0 1em 0' }}
                            >{`${collateralSymbol} you will receive: ${proportionCollateralReceived}`}</Typography>
                            <Typography style={{ padding: '0 0 1em 0' }}>
                                <Tooltip placement="right" title={invalidRedeemAmount && `This must remain above ${minSponsorTokensFromWei}`}>
                                    <span
                                        style={{
                                            color: invalidRedeemAmount ? 'red' : 'unset',
                                        }}
                                    >
                                        {`Remaining ${tokenSymbol} in your position after redemption: ${resultantTokens}`}
                                    </span>
                                </Tooltip>
                            </Typography>
                            <Typography
                                style={{ padding: '0 0 1em 0' }}
                            >{`Remaining ${collateralSymbol} in your position after redemption: ${resultantCollateral}`}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }

    return <Loader />
}
