import React, { useState } from 'react';
import { Box, Button, Grid, InputAdornment, TextField, Tooltip, Typography } from '@material-ui/core';

import { useEMPProvider } from '../../../hooks';

import { Loader } from '../../common'

export interface MintProps {

}

// tokenSymbol
// minSponsorTokensFromWei
// tokens (user input)
// resultantTokensBelowMin
export const Mint: React.FC<MintProps> = () => {
    // internal state
    const [collateral, setCollateral] = useState<string>("0");
    const [tokens, setTokens] = useState<string>("0");
    const [hash, setHash] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [error, setError] = useState<Error | null>(null);

    // functions
    // setTokensToMax
    // setBackingCollateralToMin
    // price...

    // read data
    const { collateralState, syntheticState, empState } = useEMPProvider()
    if (collateralState && syntheticState && empState) {
        return (
            <Grid container>
                <Grid item xs={6}>
                    <h1>Something</h1>
                    {/* <Grid container spacing={3}>
                        <Grid item md={12} sm={12} xs={12}>
                            <label>Mint new synthetic tokens ({tokenSymbol})</label>
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
                                                            gcr,
                                                            collateralNum,
                                                            resultantCollateral,
                                                            posTokens,
                                                            posCollateral,
                                                            isLegacyEmp
                                                        )
                                                    }
                                                >
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
                                label={`Collateral (${collSymbol})`}
                                inputProps={{ min: "0", max: balance }}
                                value={collateral}
                                error={balanceBelowCollateralToDeposit}
                                helperText={
                                    balanceBelowCollateralToDeposit &&
                                    `${collSymbol} balance is too low`
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
                                                            gcr,
                                                            tokensNum,
                                                            resultantTokens,
                                                            posTokens,
                                                            posCollateral,
                                                            isLegacyEmp
                                                        )
                                                    }
                                                >
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
                                        onClick={setMaxAllowance}
                                    >
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
                                            balanceBelowCollateralToDeposit ||
                                            resultantCRBelowRequirement ||
                                            resultantTokensBelowMin ||
                                            collateralToDeposit < 0 ||
                                            tokensToCreate <= 0
                                        }
                                    >
                                        {`Mint ${tokensToCreate} ${tokenSymbol}`}
                                    </ColorButton>
                                )}
                            </Box>
                        </Grid>
                    </Grid> */}
                </Grid>
                <Grid item xs={6}>
                    <Box pt={5}>
                        {/* <Typography style={{ padding: "0 0 1em 0" }}>
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
                                }
                            >
                                <span
                                    style={{
                                        color:
                                            liquidationPriceDangerouslyFarBelowCurrentPrice &&
                                                parseFloat(resultantLiquidationPrice) > 0
                                                ? "red"
                                                : "unset",
                                    }}
                                >
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
                                    `This must be above the requirement: ${collReqFromWei}`
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
                        >{`GCR: ${pricedGCR}`}</Typography> */}
                    </Box>
                </Grid>
            </Grid>
        )
    } else {
        return (<Box width="100%" alignContent="center"><Loader /></Box>)
    }
}