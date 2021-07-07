import { ethers, utils, ContractReceipt } from 'ethers'
import { toWei } from 'web3-utils'

import { EthereumAddress, LSPParameters } from '../../src/types'
import { getUMAAbis } from '../../src/utils/umaAbis'
import { getUMAAddresses } from '../../src/utils/umaAddresses'

interface LSPDeployResult {
    receipt: ContractReceipt
    lspAddress: EthereumAddress
}

export const deployLSP = async (values: LSPParameters, network: ethers.providers.Network, signer: ethers.Signer): Promise<LSPDeployResult> => {
    const { expirationTimestamp, collateralToken, priceIdentifier, collateralPerPair, syntheticName, syntheticSymbol } = values

    const { financialProductLibraryAddress } = values

    const params = {
        expirationTimestamp: expirationTimestamp.toString(),
        collateralPerPair: toWei(`${collateralPerPair}`),
        priceIdentifier: utils.formatBytes32String(priceIdentifier),
        syntheticName,
        syntheticSymbol,
        collateralToken,
        financialProductLibraryAddress: financialProductLibraryAddress
            ? financialProductLibraryAddress
            : '0x0000000000000000000000000000000000000000',
    }

    const umaABIs = getUMAAbis()
    const umaAddresses = getUMAAddresses(network.chainId)

    const lspCreatorInterface = umaABIs.get('LongShortPairCreator')
    if (!lspCreatorInterface) {
        throw new Error('Invalid LongShortPairCreator Interface')
    }

    const lspCreatorAddress = umaAddresses.get('LongShortPairCreator')
    if (!lspCreatorAddress) {
        throw new Error('Invalid LongShortPairCreator Address')
    }

    console.log('lspCreatorAddress', lspCreatorAddress)

    const lspCreator = new ethers.Contract(lspCreatorAddress, lspCreatorInterface, signer)

    const lspAddress = await lspCreator.callStatic.createLongShortPair(params)

    console.log('lspAddress', lspAddress)

    const txn = await lspCreator.createLongShortPair(params)

    const receipt: ContractReceipt = await txn.wait()

    return { receipt, lspAddress }
}
