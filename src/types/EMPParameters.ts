import { EthereumAddress, Percentage, Timestamp } from "./Common";

export interface EMPParameters {
    expirationTimestamp: Timestamp;
    collateralAddress: EthereumAddress;
    priceFeedIdentifier: string;
    syntheticName: string;
    syntheticSymbol: string;
    collateralRequirement: Percentage;
    minSponsorTokens: number;

    liquidationLiveness: number;
    withdrawalLiveness: number;
    financialProductLibraryAddress?: EthereumAddress;

    disputeBondPercentage?: Percentage;
    sponsorDisputeRewardPercentage?: Percentage;
    disputerDisputeRewardPercentage?: Percentage;
}