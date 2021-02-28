import { NumberAsString } from "./Common"

export interface PositionData {
    collateral: NumberAsString
    backingCollateral: NumberAsString
    syntheticTokens: NumberAsString
    collateralRatio: NumberAsString
    withdrawalAmount: NumberAsString
    withdrawalPassTime: NumberAsString
    pendingWithdraw: NumberAsString
    pendingTransfer: NumberAsString
}
