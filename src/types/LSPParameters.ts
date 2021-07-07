import { EthereumAddress, Timestamp } from './Common'

export interface LSPParameters {
    // lspCreatorAddress
    expirationTimestamp: Timestamp
    collateralPerPair: number
    priceIdentifier: string
    syntheticName: string
    syntheticSymbol: string
    collateralToken: EthereumAddress
    financialProductLibraryAddress?: EthereumAddress
}
