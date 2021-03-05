import { EMPParameters } from '../types'
import { getTestCollaterals } from '../utils/getTestCollateral'
import { getTestPriceIdentifier } from '../utils/getTestPriceIdentifier'
import { UMA, YIELD_DOLLAR_UMA } from '../constants'

export const buildFakeEMP: () => EMPParameters = () => {
    const umaCollateralInfo = getTestCollaterals().find((s) => s.symbol === UMA)
    if (!umaCollateralInfo) {
        throw new Error("Couldn't find collateral info")
    }
    return {
        expirationTimestamp: new Date(2030, 10, 10).getTime(),
        collateralAddress: umaCollateralInfo.address,
        priceFeedIdentifier: getTestPriceIdentifier(),
        syntheticName: YIELD_DOLLAR_UMA,
        syntheticSymbol: YIELD_DOLLAR_UMA,
        collateralRequirement: 125,
        minSponsorTokens: 100,
        liquidationLiveness: 7200,
        withdrawalLiveness: 7200,
    }
}
