import { DAI } from '../constants'
import { EMPParameters } from '../types'
import { getTestCollaterals } from '../utils/getTestCollateral'
import { getTestPriceIdentifier } from '../utils/getTestPriceIdentifier'

export const buildFakeEMP: () => EMPParameters = () => {
    const daiCollateralInfo = getTestCollaterals().find((s) => s.symbol === DAI)
    if (!daiCollateralInfo) {
        throw new Error("Couldn't find collateral info")
    }
    return {
        expirationTimestamp: new Date(2030, 10, 10).getTime(),
        collateralAddress: daiCollateralInfo.address,
        priceFeedIdentifier: getTestPriceIdentifier(),
        syntheticName: 'yUSD',
        syntheticSymbol: 'yUSD',
        collateralRequirement: 125,
        minSponsorTokens: 100,
        liquidationLiveness: 7200,
        withdrawalLiveness: 7200,
    }
}
