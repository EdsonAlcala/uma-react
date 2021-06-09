import { createContainer } from 'unstated-next'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

import FinderArtifact from '@uma/core/build/contracts/Finder.json'
import VotingArtifact from '@uma/core/build/contracts/Voting.json'
import StoreArtifact from '@uma/core/build/contracts/Store.json'

import { Connection } from './Connection'
import { useEMPProvider } from './useEMPProvider'
import { EthereumAddress } from '../types'

const { formatBytes32String: utf8ToHex } = ethers.utils

function useContracts() {
    const { provider } = Connection.useContainer()
    const { empState } = useEMPProvider()
    const [finderAddress, setFinderAddress] = useState<EthereumAddress | undefined>(undefined)
    const [votingContract, setVotingContract] = useState<ethers.Contract | null>(null)
    const [storeContract, setStoreContract] = useState<ethers.Contract | null>(null)

    const setDvmContracts = async () => {
        if (finderAddress && provider) {
            const finder = new ethers.Contract(finderAddress, FinderArtifact.abi, provider)
            const [votingAddress, storeAddress] = await Promise.all([
                finder.getImplementationAddress(utf8ToHex('Oracle')),
                finder.getImplementationAddress(utf8ToHex('Store')),
            ])
            // Do not inject a provider into this contract so that we can make calls from the EMP's address.
            // We will only have read-only access to the Contract, but overriding the `from` address is neccessary for `getPrice` or `hasPrice`.
            // Moreover, we won't be submitting any txns to the DVM.
            const voting = new ethers.Contract(votingAddress, VotingArtifact.abi, provider)
            setVotingContract(voting)

            const store = new ethers.Contract(storeAddress, StoreArtifact.abi, provider)
            setStoreContract(store)
        }
    }
    useEffect(() => {
        if (empState) {
            setFinderAddress(empState.finderAddress)
            setVotingContract(null)
            setStoreContract(null)
            setDvmContracts()
        }
    }, [empState, provider])

    return { votingContract, storeContract }
}

const Contracts = createContainer(useContracts)

export default Contracts
