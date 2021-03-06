import React, { useState } from 'react';
import { Box, Button, CircularProgress, Grid, InputAdornment, TextField, Tooltip, Typography, withStyles } from '@material-ui/core';
import CallMadeIcon from '@material-ui/icons/CallMade';

import { useEMPProvider, usePosition, useTotals, useWeb3Provider, usePriceFeed, useEtherscan } from '../../../hooks';
import { fromWei, toWeiSafe, getLiquidationPrice, isPricefeedInvertedFromTokenSymbol } from '../../../utils';

import { Loader } from '../../common'
import styled from 'styled-components';
import { ethers } from 'ethers';

export interface MintProps {

}

const isUndefined = (value: any) => value === undefined

export const Mint: React.FC<MintProps> = () => {
    // internal state
    const [collateral, setCollateral] = useState<string>("0");
    const [tokens, setTokens] = useState<string>("0");
    const [hash, setHash] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<boolean | undefined>(undefined);
    const [error, setError] = useState<Error | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false)

    // read data
    const { address: userAddress } = useWeb3Provider()
    const { collateralState, syntheticState, empState, instance: empInstance } = useEMPProvider()
    const positionState = usePosition(userAddress)
    const totalsState = useTotals()
    const { latestPrice } = usePriceFeed(syntheticState ? syntheticState.symbol : undefined)
    const { getEtherscanUrl } = useEtherscan()

    if (isUndefined(collateralState) || isUndefined(syntheticState) || isUndefined(empState) || isUndefined(positionState) || isUndefined(totalsState) && isUndefined(latestPrice)) {
        return (
            <Loader />
        )
    }

    // position
    const { syntheticTokens: positionTokens, collateral: positionCollateral } = positionState
    const positionTokensAsNumber = Number(positionTokens)
    const positionCollateralAsNumber = Number(positionCollateral)

    // tokens
    const { decimals: tokenDecimals, symbol: tokenSymbol } = syntheticState
    const { decimals: collateralDecimals, symbol: collateralSymbol, balance: collateralBalance, allowance: collateralAllowance, setMaxAllowance } = collateralState

    const collateralBalanceAsNumber = Number(collateralBalance)
    const collateralAllowanceAsNumber = Number(collateralAllowance)

    // expiring multi party 
    const { minSponsorTokens, collateralRequirement, priceIdentifier } = empState
    const minSponsorTokensFromWei = parseFloat(
        fromWei(minSponsorTokens, collateralDecimals) // TODO: This should be using the decimals of the token...
    );
    const priceIdentifierUtf8 = ethers.utils.toUtf8String(priceIdentifier);

    // totals
    const { gcr } = totalsState
    const gcrAsNumber = Number(gcr)

    console.log("GCR", gcr)

    // input data
    const collateralToDeposit = Number(collateral) || 0;
    const tokensToCreate = Number(tokens) || 0;

    // computed synthetic
    const resultantTokens = positionTokensAsNumber + tokensToCreate;
    const resultantTokensBelowMin = resultantTokens < minSponsorTokensFromWei && resultantTokens !== 0;

    // computed collateral
    const resultantCollateral = positionCollateralAsNumber + collateralToDeposit;
    const isBalanceBelowCollateralToDeposit = collateralBalanceAsNumber < collateralToDeposit;
    const needAllowance = collateralAllowance !== "Infinity" && collateralAllowanceAsNumber < collateralToDeposit;

    // computed general
    // const latestPrice = 100 | 0; // TODO: I need price feed
    const transactionCR = tokensToCreate > 0 ? collateralToDeposit / tokensToCreate : 0;
    const transactionCRBelowGCR = transactionCR < gcrAsNumber;
    const resultantCR = resultantTokens > 0 ? resultantCollateral / resultantTokens : 0;
    const pricedResultantCR = latestPrice !== 0 ? (resultantCR / latestPrice).toFixed(4) : "0";

    const resultantCRBelowGCR = resultantCR < gcrAsNumber;
    const cannotMint = transactionCRBelowGCR && resultantCRBelowGCR;
    const collateralRequirementFromWei = parseFloat(fromWei(collateralRequirement));
    const resultantCRBelowRequirement = parseFloat(pricedResultantCR) >= 0 && parseFloat(pricedResultantCR) < collateralRequirementFromWei;

    // price related
    const prettyLatestPrice = Number(latestPrice).toFixed(4);
    // GCR: total contract collateral / total contract tokens.
    const pricedGCR = latestPrice !== 0 ? (gcrAsNumber / latestPrice).toFixed(4) : undefined;
    const pricedTransactionCR = latestPrice !== 0 ? (transactionCR / latestPrice).toFixed(4) : "0";
    console.log("resultantCollateral", resultantCollateral)
    console.log("resultantTokens", resultantTokens)
    console.log("collateralRequirementFromWei", collateralRequirementFromWei)

    const resultantLiquidationPrice = getLiquidationPrice(
        resultantCollateral,
        resultantTokens,
        collateralRequirementFromWei,
        isPricefeedInvertedFromTokenSymbol(tokenSymbol)
    ).toFixed(4);

    const liquidationPriceWarningThreshold = 0.1;
    const liquidationPriceDangerouslyFarBelowCurrentPrice = parseFloat(resultantLiquidationPrice) < (1 - liquidationPriceWarningThreshold) * latestPrice;

    // internal functions
    const setTokensToMax = (_gcr: number, _transactionCollateral: number, _resultantPositionCollateral: number, _positionTokens: number, _positionCollateral: number) => {
        // Current EMP's require position CR must be > GCR otherwise transaction CR > GCR, therefore
        // if the current CR < GCR, then the max amount of tokens to mint is equal to transaction CR (and resultant
        // CR will still be < GCR). If the current CR > GCR, then the max amount of tokens to mint would set the
        // resultant CR to the GCR
        const currentCR = _positionTokens > 0 ? _positionCollateral / _positionTokens : 0;
        if (currentCR < _gcr) {
            _setTokensToMax(_gcr, _transactionCollateral, 0);
        } else {
            _setTokensToMax(_gcr, _resultantPositionCollateral, _positionTokens);
        }
    };

    // Sets `tokens` to the max amount of tokens that can be added to `startingTokens` to keep the CR <= GCR.
    const _setTokensToMax = (_gcr: number, _collateral: number, _startingTokens: number) => {
        // Set amount of tokens to the maximum required by the GCR constraint. This
        // is intended to encourage users to maximize their capital efficiency.
        const maxTokensToCreate = _gcr > 0 ? _collateral / _gcr - _startingTokens : 0;
        // Unlike the min collateral, we're ok if we round down the tokens slightly as round down
        // can only increase the position's CR and maintain it above the GCR constraint.
        setTokens((maxTokensToCreate - 0.0001).toFixed(4));
    };

    const setBackingCollateralToMin = (_gcr: number, _transactionTokens: number, _resultantPositionTokens: number, _positionTokens: number, _positionCollateral: number) => {
        // Current EMP's require position CR must be > GCR otherwise transaction CR > GCR, therefore
        // if the current CR < GCR, then the min amount of collateral to deposit is equal to transaction CR (and resultant
        // CR will still be < GCR). If the current CR > GCR, then the min amount of collateral to deposit would set the
        // resultant CR to the GCR
        const currentCR = _positionTokens > 0 ? _positionCollateral / _positionTokens : 0;
        if (currentCR < _gcr) {
            _setBackingCollateralToMin(_gcr, _transactionTokens, 0);
        } else {
            _setBackingCollateralToMin(_gcr, _resultantPositionTokens, _positionCollateral);
        }
    };

    // Sets `collateral` to the min amount of collateral that can be added to `startingCollateral` to keep the CR <= GCR.
    const _setBackingCollateralToMin = (_gcr: number, _tokens: number, _startingCollateral: number) => {
        // Set amount of collateral to the minimum required by the GCR constraint. This
        // is intended to encourage users to maximize their capital efficiency.
        const minBackingCollateral = _gcr * _tokens - _startingCollateral;
        if (minBackingCollateral < 0) {
            setCollateral("0");
        } else {
            // We want to round down the number for better UI display, but we don't actually want the collateral
            // amount to round down since we want the minimum amount of collateral to pass the GCR constraint. So,
            // we'll add a tiny amount of collateral to avoid accidentally rounding too low.
            setCollateral((minBackingCollateral + 0.00005).toFixed(4));
        }
    };

    const mintTokens = async () => {
        if (collateralToDeposit >= 0 && tokensToCreate > 0) {
            setHash(undefined);
            setSuccess(undefined);
            setError(undefined);
            setIsSubmitting(true)
            try {
                const collateralWei = toWeiSafe(collateral, collateralDecimals); // collateral = input by user
                const tokensWei = toWeiSafe(tokens); // tokens = input by user
                const tx = await empInstance.create([collateralWei], [tokensWei]);
                setHash(tx.hash as string);
                await tx.wait();

                console.log("Minting tokens successfully")
                setSuccess(true);
            } catch (error) {
                console.error(error);
                setError(error);
            }
        } else {
            setError(new Error("Collateral and Token amounts must be positive"));
        }
        setIsSubmitting(false)
    };

    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={6}>
                    <Grid container spacing={3}>
                        <Grid item md={12} sm={12} xs={12}>
                            <label style={{ fontFamily: "sans-serif", fontSize: "1.1em" }}>Mint new synthetic tokens ({tokenSymbol})</label>
                        </Grid>
                        <Grid item md={10} sm={10} xs={10}>
                            <TextField
                                size="small"
                                fullWidth
                                type="number"
                                variant="outlined"
                                label={`Tokens (${tokenSymbol})`}
                                inputProps={{ min: "0" }}
                                value={tokens}
                                error={resultantTokensBelowMin}
                                helperText={
                                    resultantTokensBelowMin &&
                                    `Below minimum of ${minSponsorTokensFromWei}`
                                }
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setTokens(e.target.value)
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Tooltip
                                                placement="top"
                                                title="Maximum amount of tokens with entered collateral"
                                            >
                                                <Button
                                                    style={{ fontSize: "0.8em" }}
                                                    fullWidth
                                                    onClick={() =>
                                                        setTokensToMax(
                                                            gcrAsNumber,
                                                            collateralToDeposit,
                                                            resultantCollateral,
                                                            positionTokensAsNumber,
                                                            positionCollateralAsNumber
                                                        )
                                                    }>
                                                    <MinLink>Max</MinLink>
                                                </Button>
                                            </Tooltip>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item md={10} sm={10} xs={10}>
                            <TextField
                                size="small"
                                fullWidth
                                type="number"
                                variant="outlined"
                                label={`Collateral (${collateralSymbol})`}
                                inputProps={{ min: "0", max: collateralBalance }}
                                value={collateral}
                                error={isBalanceBelowCollateralToDeposit}
                                helperText={
                                    isBalanceBelowCollateralToDeposit &&
                                    `${collateralSymbol} balance is too low`
                                }
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setCollateral(e.target.value)
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Tooltip
                                                placement="top"
                                                title="Minimum amount of collateral with entered tokens"
                                            >
                                                <Button
                                                    fullWidth
                                                    style={{ fontSize: "0.8em" }}
                                                    onClick={() =>
                                                        setBackingCollateralToMin(
                                                            gcrAsNumber,
                                                            tokensToCreate,
                                                            resultantTokens,
                                                            positionTokensAsNumber,
                                                            positionCollateralAsNumber
                                                        )
                                                    }>
                                                    <MinLink>Min</MinLink>
                                                </Button>
                                            </Tooltip>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item md={10} sm={10} xs={10}>
                            <Box py={0}>
                                {needAllowance && (
                                    <ColorButton
                                        color="primary"
                                        size="small"
                                        fullWidth
                                        variant="contained"
                                        onClick={setMaxAllowance}>
                                        Max Approve
                                    </ColorButton>
                                )}

                                {!needAllowance && (
                                    <ColorButton
                                        color="primary"
                                        disableElevation
                                        fullWidth
                                        variant="contained"
                                        onClick={mintTokens}
                                        disabled={
                                            cannotMint ||
                                            isBalanceBelowCollateralToDeposit ||
                                            resultantCRBelowRequirement ||
                                            resultantTokensBelowMin ||
                                            collateralToDeposit < 0 ||
                                            tokensToCreate <= 0
                                        }>
                                        {isSubmitting ? "Minting tokens..." : `Mint ${tokensToCreate} ${tokenSymbol}`}
                                        {isSubmitting && <CircularProgress style={{ marginLeft: "0.5em", color: "white" }} size={24} />}
                                    </ColorButton>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Box pt={5}>
                        <Typography style={{ padding: "0 0 1em 0" }}>
                            {`Transaction Collateral Ratio: `}
                            <Tooltip
                                placement="right"
                                title={
                                    transactionCRBelowGCR &&
                                    cannotMint &&
                                    `This transaction CR must be above the GCR: ${pricedGCR}`
                                }
                            >
                                <span
                                    style={{
                                        color:
                                            transactionCRBelowGCR && cannotMint ? "red" : "unset",
                                    }}
                                >
                                    {pricedTransactionCR}
                                </span>
                            </Tooltip>
                        </Typography>
                        <Typography style={{ padding: "0 0 1em 0" }}>
                            {`Resulting Liquidation Price: `}
                            <Tooltip
                                placement="right"
                                title={
                                    liquidationPriceDangerouslyFarBelowCurrentPrice &&
                                    parseFloat(resultantLiquidationPrice) > 0 &&
                                    `This is >${liquidationPriceWarningThreshold * 100
                                    }% below the current price: ${prettyLatestPrice}`
                                }>
                                <span
                                    style={{
                                        color:
                                            liquidationPriceDangerouslyFarBelowCurrentPrice &&
                                                parseFloat(resultantLiquidationPrice) > 0
                                                ? "red"
                                                : "unset",
                                    }}>
                                    {resultantLiquidationPrice} ({priceIdentifierUtf8})
                            </span>
                            </Tooltip>
                        </Typography>
                        <Typography style={{ padding: "0 0 1em 0" }}>
                            {`Resulting Collateral Ratio: `}
                            <Tooltip
                                placement="right"
                                title={
                                    resultantCRBelowRequirement &&
                                    `This must be above the requirement: ${collateralRequirementFromWei}`
                                }
                            >
                                <span
                                    style={{
                                        color: resultantCRBelowRequirement ? "red" : "unset",
                                    }}
                                >
                                    {pricedResultantCR}
                                </span>
                            </Tooltip>
                        </Typography>
                        <Typography
                            style={{ padding: "0 0 1em 0" }}
                        >{`GCR: ${pricedGCR}`}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>

                    <Box color="black" display="flex" flexDirection="column" mt="1em" fontSize="0.9em">

                        {hash &&
                            <React.Fragment>
                                <Typography>
                                    <label style={{ color: "rgb(98, 93, 247)" }}>Transaction successful</label>
                                </Typography>
                                <Box>
                                    <Link
                                        href={getEtherscanUrl(hash)}
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        <span style={{ fontSize: "1em", display: "inline-flex", alignItems: "center", marginTop: "0.5em" }}>
                                            View on Etherscan {" "} <CallMadeIcon style={{ fontSize: "1.3em" }} />
                                        </span>
                                    </Link>
                                </Box>
                            </React.Fragment>}

                        {error &&
                            <React.Fragment>
                                <Typography>
                                    <label style={{ color: "red" }}>{error.message}</label>
                                </Typography>
                            </React.Fragment>
                        }
                    </Box>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

const MinLink = styled.div`
  text-decoration-line: underline;
`;

const Link = styled.a`
  text-decoration: none;
  color: black;
`;

const ColorButton = withStyles((theme) => ({
    root: {
        textTransform: "capitalize",
        color: "#fff !important",
        backgroundColor: "#ff4a4a",
        "&:hover": {
            opacity: 0.9,
            backgroundColor: "#ff4a4a",
        },
        "&.MuiButtonBase-root:disabled": {
            color: "rgba(0, 0, 0, 0.26) !important",
        },
    },
}))(Button);
