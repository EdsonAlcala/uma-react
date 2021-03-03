import { Fragment } from 'ethers/lib/utils'

import ExpiringMultiPartyCreatorArtifact from '@uma/core/build/contracts/ExpiringMultiPartyCreator.json'
import ERC20Artifact from '@uma/core/build/contracts/ERC20.json'
import ExpiringMultiPartyArtifact from '@uma/core/build/contracts/ExpiringMultiParty.json'

import { UMAContractName } from '../types'

export const getUMAAbis = (): Map<UMAContractName, Fragment[]> => {
    const abis = new Map<UMAContractName, Fragment[]>()
    abis.set('ERC20', ERC20Artifact.abi as any) // eslint-disable-line
    abis.set('ExpiringMultiParty', ExpiringMultiPartyArtifact.abi as any) // eslint-disable-line
    abis.set('ExpiringMultiPartyCreator', ExpiringMultiPartyCreatorArtifact.abi as any) // eslint-disable-line

    return abis
}
