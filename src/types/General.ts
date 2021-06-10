import { EthereumAddress, NumberAsString } from './Common'

export interface Token {
    id: EthereumAddress
    name: string
    decimals: number
    symbol: string
}

export interface FinancialContract {
    collateralRequirement: NumberAsString
    deploymentTimestamp: NumberAsString
    priceIdentifier: string
    id: EthereumAddress
    syntheticToken: Token
    collateralToken: Token
    expirationTimestamp: NumberAsString
    liquidationLiveness: NumberAsString
    withdrawLiveness: NumberAsString
    minimumSponsorTokens: NumberAsString
    totalTokensOutstanding: NumberAsString
    totalPositionCollateral: NumberAsString
    disputeBondPercentage: NumberAsString
    disputerDisputeRewardPercentage: NumberAsString
    sponsorDisputeRewardPercentage: NumberAsString
    positions: any[]
}
