import { ethers } from 'ethers'
import React, { PropsWithChildren, useContext, useEffect, useState } from 'react'

import { EthereumAddress, UMAContractName } from '../types'
import { getUMAAddresses, getUMAInterfaces } from '../utils'
import { useWeb3Provider } from './useWeb3Provider'

interface IUMAProvider {
    getContractAddress: (contractName: UMAContractName) => EthereumAddress | undefined
    getContractInterface: (contractName: UMAContractName) => ethers.utils.Interface | undefined
}

const UMAContext = React.createContext<IUMAProvider>({
    getContractAddress: (contractName: UMAContractName) => {
        return undefined
    },
    getContractInterface: (contractName: UMAContractName) => {
        return undefined
    },
})

export const UMARegistryProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const [contracts, setContracts] = useState(new Map<UMAContractName, EthereumAddress>())
    const [interfaces, setInterfaces] = useState(new Map<UMAContractName, ethers.utils.Interface>())
    const { network } = useWeb3Provider()

    const getContractAddress = (contractName: UMAContractName) => {
        return contracts.get(contractName) as string
    }

    const getContractInterface = (contractName: UMAContractName) => {
        return interfaces.get(contractName) as ethers.utils.Interface
    }

    useEffect(() => {
        const umaInterfaces = getUMAInterfaces()
        setInterfaces(umaInterfaces)
    }, [])

    useEffect(() => {
        if (network) {
            const umaAddresses = getUMAAddresses(network.chainId)
            setContracts(umaAddresses)
        }
    }, [network])

    return (
        <UMAContext.Provider
            value={{
                getContractAddress,
                getContractInterface,
            }}>
            {children}
        </UMAContext.Provider>
    )
}

export const useUMARegistry = () => {
    const context = useContext(UMAContext)

    if (context === null) {
        throw new Error('useUMARegistry() can only be used inside of <UMARegistryProvider />, please declare it at a higher level')
    }
    return context
}
