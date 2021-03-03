import { BigNumber, Bytes } from 'ethers'

export interface EMPData {
    expirationTimestamp: BigNumber
    collateralCurrency: string
    priceIdentifier: Bytes
    tokenCurrency: string
    collateralRequirement: BigNumber
    disputeBondPercentage: BigNumber
    disputerDisputeRewardPercentage: BigNumber
    sponsorDisputeRewardPercentage: BigNumber
    minSponsorTokens: BigNumber
    timerAddress: string
    cumulativeFeeMultiplier: BigNumber
    rawTotalPositionCollateral: BigNumber
    totalTokensOutstanding: BigNumber
    liquidationLiveness: BigNumber
    withdrawalLiveness: BigNumber
    currentTime: BigNumber
    isExpired: boolean
    contractState: number
    finderAddress: string
    expiryPrice: BigNumber
}
