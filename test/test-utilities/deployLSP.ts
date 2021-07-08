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
        priceIdentifier: '0x554d415553440000000000000000000000000000000000000000000000000000',
        longSynthName: 'UMA 25 USD Call [July 2021]',
        longSynthSymbol: 'UMAc25-0721-L',
        shortSynthName: 'UMA 25 USD Covered Call [July 2021]',
        shortSynthSymbol: 'UMAc25-0721-S',
        collateralToken: collateralToken,
        financialProductLibrary: financialProductLibraryAddress,
        customAncillaryData: '0',
        prepaidProposerReward: 0,
        pairName: 'test',
        optimisticOracleProposerBond: '0',
        optimisticOracleLivenessTime: '0',
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
    console.log('Params', params)
    const lspAddress = await lspCreator.callStatic.createLongShortPair(params, {
        value: 0,
    })

    console.log('lspAddress', lspAddress)

    const txn = await lspCreator.createLongShortPair(params)

    const receipt: ContractReceipt = await txn.wait()

    return { receipt, lspAddress }
}
