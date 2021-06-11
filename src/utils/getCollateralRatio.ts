export const getCollateralRatio = (collateral: number, tokens: number, price: number) => {
    if (tokens <= 0 || price <= 0) return 0
    const tokensScaled = tokens * price
    return collateral / tokensScaled
}
