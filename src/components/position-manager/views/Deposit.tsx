import React, { useState } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@material-ui/core';
import { ethers } from 'ethers';

import { fromWei, getLiquidationPrice, isPricefeedInvertedFromTokenSymbol, toWeiSafe } from '../../../utils';
import { useEMPProvider, useEtherscan, usePosition, usePriceFeed, useWeb3Provider } from '../../../hooks';
import { Loader, TransactionResultArea } from '../../common';
import { INFINITY, YES } from '../../../constants';

export interface DepositProps {

}

export const Deposit: React.FC<DepositProps> = () => {
    // internal state
    const [collateral, setCollateral] = useState<string>("0");
    const [hash, setHash] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<boolean | undefined>(undefined);
    const [error, setError] = useState<Error | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false)

    // read data
    const { address: userAddress } = useWeb3Provider()
    const { collateralState, syntheticState, empState, instance: empInstance } = useEMPProvider()
    const positionState = usePosition(userAddress)
    const { latestPrice } = usePriceFeed(syntheticState ? syntheticState.symbol : undefined)
    const { getEtherscanUrl } = useEtherscan()

    if (collateralState && syntheticState && empState && positionState && empInstance && latestPrice) {
        // position
        const { syntheticTokens: positionTokens, collateral: positionCollateral, pendingWithdraw } = positionState
        const positionTokensAsNumber = Number(positionTokens)
        const positionCollateralAsNumber = Number(positionCollateral)
        const hasPendingWithdraw = pendingWithdraw === YES;

        // tokens
        const { decimals: tokenDecimals, symbol: tokenSymbol } = syntheticState
        const { decimals: collateralDecimals, symbol: collateralSymbol, balance: collateralBalance, allowance: collateralAllowance, setMaxAllowance } = collateralState

        // expiring multi party 
        const { minSponsorTokens, collateralRequirement, priceIdentifier } = empState
        const minSponsorTokensFromWei = parseFloat(
            fromWei(minSponsorTokens, collateralDecimals) // TODO: This should be using the decimals of the token...
        );
        const priceIdentifierUtf8 = ethers.utils.toUtf8String(priceIdentifier);

        const collateralBalanceAsNumber = Number(collateralBalance)
        const collateralAllowanceAsNumber = Number(collateralAllowance)

        // input data
        const collateralToDeposit = Number(collateral) || 0;

        // computed collateral
        const resultantCollateral = positionCollateralAsNumber + collateralToDeposit;
        const collateralRequirementFromWei = parseFloat(fromWei(collateralRequirement));
        const resultantCR = positionTokensAsNumber > 0 ? resultantCollateral / positionTokensAsNumber : 0;
        const pricedResultantCR = latestPrice !== 0 ? (resultantCR / latestPrice).toFixed(4) : "0";

        const resultantLiquidationPrice = getLiquidationPrice(
            resultantCollateral,
            positionTokensAsNumber,
            collateralRequirementFromWei,
            isPricefeedInvertedFromTokenSymbol(tokenSymbol)
        ).toFixed(4);

        // Error conditions for calling deposit:
        const balanceBelowCollateralToDeposit = collateralBalanceAsNumber < collateralToDeposit;
        const needAllowance = collateralAllowance !== INFINITY && collateralAllowanceAsNumber < collateralToDeposit;

        const depositCollateral = async () => {
            if (collateralToDeposit > 0) {
                setHash(null);
                setSuccess(null);
                setError(null);
                try {
                    const collateralToDepositWei = toWeiSafe(collateral, collateralDecimals);
                    const tx = await empInstance.deposit([collateralToDepositWei]);
                    setHash(tx.hash as string);
                    await tx.wait();
                    setSuccess(true);
                } catch (error) {
                    console.error(error);
                    setError(error);
                }
            } else {
                setError(new Error("Collateral amount must be positive."));
            }
        };

        if (hasPendingWithdraw) {
            return (
                <Box textAlign="center">
                    <Typography>
                        <i>
                            You need to cancel or execute your pending withdrawal request
                            before depositing additional collateral.
                        </i>
                    </Typography>
                </Box>
            );
        }

        return (
            <React.Fragment>
                <Grid container>
                    <Grid item xs={6}>
                        <Grid container spacing={3}>
                            <Grid item md={4} sm={6} xs={12}>
                                <Box py={0}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        variant="outlined"
                                        inputProps={{ min: "0", max: collateralBalance }}
                                        label={`Collateral (${collateralSymbol})`}
                                        error={balanceBelowCollateralToDeposit}
                                        helperText={
                                            balanceBelowCollateralToDeposit &&
                                            `Your ${collateralSymbol} balance too low`
                                        }
                                        value={collateral}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setCollateral(e.target.value)
                                        }
                                    />
                                </Box>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <Box py={0}>
                                    {needAllowance && (
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={setMaxAllowance}
                                            style={{ marginRight: `12px` }}>
                                            Max Approve
                                        </Button>
                                    )}
                                    {!needAllowance && (
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={depositCollateral}
                                            disabled={
                                                balanceBelowCollateralToDeposit ||
                                                collateralToDeposit <= 0
                                            }>
                                            {`Deposit ${collateralToDeposit} ${collateralSymbol} into your position`}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={6}>
                        <Box pt={5}>
                            <Typography>{`Resulting CR: ${pricedResultantCR}`}</Typography>
                            <Typography>
                                {`Resulting liquidation price: ${resultantLiquidationPrice} (${priceIdentifierUtf8})`}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <TransactionResultArea hash={hash} error={error} />
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }

    return (
        <Loader />
    );
}