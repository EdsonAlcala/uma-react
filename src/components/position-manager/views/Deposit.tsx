import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { ethers } from 'ethers'

import { fromWei, getLiquidationPrice, isPricefeedInvertedFromTokenSymbol, toWeiSafe } from '../../../utils'
import { useEMPProvider, usePosition, usePriceFeed, useWeb3Provider } from '../../../hooks'
import { FormButton, FormTitle, Loader, TransactionResultArea } from '../../common'
import { INFINITY, NA, NON_PRICE, YES } from '../../../constants'

export const Deposit: React.FC = () => {
    // internal state
    const [collateral, setCollateral] = useState<string>('0')
    const [hash, setHash] = useState<string | undefined>(undefined)
    const [success, setSuccess] = useState<boolean | undefined>(undefined)
    const [error, setError] = useState<Error | undefined>(undefined)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // read data
    const { address: userAddress } = useWeb3Provider()
    const { collateralState, syntheticState, empState, instance: empInstance } = useEMPProvider()
    const positionState = usePosition(userAddress)
    const { latestPrice } = usePriceFeed(syntheticState, empInstance.address)

    if (collateralState && syntheticState && empState && positionState && empInstance && latestPrice) {
        // position
        const { syntheticTokens: positionTokens, collateral: positionCollateral, pendingWithdraw } = positionState
        const positionTokensAsNumber = Number(positionTokens)
        const positionCollateralAsNumber = Number(positionCollateral)
        const hasPendingWithdraw = pendingWithdraw === YES

        // tokens
        const { decimals: tokenDecimals, symbol: tokenSymbol } = syntheticState
        const {
            decimals: collateralDecimals,
            symbol: collateralSymbol,
            balance: collateralBalance,
            allowance: collateralAllowance,
            instance: collateralInstance,
        } = collateralState

        // expiring multi party
        const { collateralRequirement, priceIdentifier } = empState
        const priceIdentifierUtf8 = ethers.utils.toUtf8String(priceIdentifier)

        const collateralBalanceAsNumber = Number(collateralBalance)
        const collateralAllowanceAsNumber = Number(collateralAllowance)

        // input data
        const collateralToDeposit = Number(collateral) || 0

        // computed collateral
        const resultantCollateral = positionCollateralAsNumber + collateralToDeposit
        const collateralRequirementFromWei = parseFloat(fromWei(collateralRequirement))
        const resultantCR = positionTokensAsNumber > 0 ? resultantCollateral / positionTokensAsNumber : 0
        const pricedResultantCR = latestPrice === NON_PRICE ? NA : latestPrice !== 0 ? (resultantCR / latestPrice).toFixed(4) : '0'

        const resultantLiquidationPrice =
            latestPrice === NON_PRICE
                ? NA
                : getLiquidationPrice(
                    resultantCollateral,
                    positionTokensAsNumber,
                    collateralRequirementFromWei,
                    isPricefeedInvertedFromTokenSymbol(tokenSymbol),
                ).toFixed(4)

        // Error conditions for calling deposit:
        const balanceBelowCollateralToDeposit = collateralBalanceAsNumber < collateralToDeposit
        const needAllowance = collateralAllowance !== INFINITY && collateralAllowanceAsNumber < collateralToDeposit

        const depositCollateral = async () => {
            setIsSubmitting(true)
            if (collateralToDeposit > 0) {
                setHash(null)
                setSuccess(null)
                setError(null)
                try {
                    const collateralToDepositWei = toWeiSafe(collateral, collateralDecimals)
                    const tx = await empInstance.deposit([collateralToDepositWei])
                    setHash(tx.hash as string)
                    await tx.wait()
                    setSuccess(true)
                } catch (error) {
                    console.error(error)
                    setError(error)
                }
            } else {
                setError(new Error('Collateral amount must be positive.'))
            }
            setIsSubmitting(false)
        }

        const setMaxAllowance = async () => {
            setIsSubmitting(true)
            setHash(undefined)
            setError(undefined)
            try {
                const receipt = await collateralInstance.approve(empInstance.address, ethers.constants.MaxUint256)
                setHash(receipt.hash as string)
                await receipt.wait()
                console.log('Set max allowance successfully')
            } catch (error) {
                console.error(error)
                setError(error)
            }
            setIsSubmitting(false)
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
                                <FormTitle>{`Deposit (${collateralSymbol})`}</FormTitle>
                            </Grid>

                            <Grid item md={10} sm={10} xs={10}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    variant="outlined"
                                    inputProps={{ min: '0', max: collateralBalance }}
                                    label={`Collateral (${collateralSymbol})`}
                                    error={balanceBelowCollateralToDeposit}
                                    helperText={balanceBelowCollateralToDeposit && `Your ${collateralSymbol} balance too low`}
                                    value={collateral}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCollateral(e.target.value)}
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
                                            fullWidth
                                            variant="contained"
                                            onClick={depositCollateral}
                                            disabled={balanceBelowCollateralToDeposit || collateralToDeposit <= 0}
                                            isSubmitting={isSubmitting}
                                            submittingText="Depositing collateral..."
                                            text={`Deposit ${collateralToDeposit} ${collateralSymbol} into your position`}
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
                            <Typography style={{ padding: '0 0 1em 0' }}>{`Resulting CR: ${pricedResultantCR}`}</Typography>
                            <Typography style={{ padding: '0 0 1em 0' }}>
                                {`Resulting liquidation price: ${resultantLiquidationPrice} (${priceIdentifierUtf8})`}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }

    return <Loader />
}
