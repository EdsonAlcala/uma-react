import ExpiringMultiPartyCreatorArtifact from '@uma/core/build/contracts/ExpiringMultiPartyCreator.json'

import { SUPPORTED_NETWORK_IDS } from '../constants'
import { EthereumAddress, UMAContractName } from '../types'

export const getUMAAddresses = (networkId: number): Map<UMAContractName, EthereumAddress> => {
    if (!SUPPORTED_NETWORK_IDS.includes(networkId)) {
        throw new Error('Unsupported network')
    }
    const addresses = new Map<UMAContractName, EthereumAddress>()

    addresses.set('ExpiringMultiPartyCreator', (ExpiringMultiPartyCreatorArtifact as any).networks[networkId].address) // eslint-disable-line

    return addresses
}
