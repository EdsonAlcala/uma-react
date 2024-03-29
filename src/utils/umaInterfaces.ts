import { ContractInterface, ethers } from 'ethers'

import ExpiringMultiPartyCreatorArtifact from '@uma/core/build/contracts/ExpiringMultiPartyCreator.json'
import ERC20Artifact from '@uma/core/build/contracts/ERC20.json'
import ExpiringMultiPartyArtifact from '@uma/core/build/contracts/ExpiringMultiParty.json'
import LongShortPairCreatorArtifact from 'umacore/build/contracts/LongShortPairCreator.json'
import LongShortPairArtifact from 'umacore/build/contracts/LongShortPair.json'

import { UMAContractName } from '../types'

export const getUMAInterfaces = (): Map<UMAContractName, ethers.utils.Interface> => {
    const interfaces = new Map<UMAContractName, ethers.utils.Interface>()
    interfaces.set('ERC20', new ethers.utils.Interface(ERC20Artifact.abi as any)) // eslint-disable-line
    interfaces.set('ExpiringMultiParty', new ethers.utils.Interface(ExpiringMultiPartyArtifact.abi as any)) // eslint-disable-line
    interfaces.set(
        'ExpiringMultiPartyCreator',
        new ethers.utils.Interface(ExpiringMultiPartyCreatorArtifact.abi as any), // eslint-disable-line
    )
    interfaces.set('LongShortPair', LongShortPairArtifact.abi as any) // eslint-disable-line
    interfaces.set('LongShortPairCreator', LongShortPairCreatorArtifact.abi as any) // eslint-disable-line

    return interfaces
}
