import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { EthereumAddress } from '../types'

import { useUMARegistry } from './useUMARegistry'
import { useWeb3Provider } from './useWeb3Provider'

export const useERC20At = (tokenAddress: EthereumAddress | undefined) => {
    const { provider, signer } = useWeb3Provider()
    const { getContractInterface } = useUMARegistry()
    const [instance, setInstance] = useState<ethers.Contract | undefined>(undefined)

    useEffect(() => {
        if (provider && tokenAddress) {
            if (!getContractInterface('ERC20')) {
                throw new Error('UMARegistryProvider is not defined')
            }
            const newInstance = new ethers.Contract(tokenAddress, getContractInterface('ERC20'), signer as any)
            setInstance(newInstance)
        }
    }, [provider, tokenAddress])

    return {
        instance,
    }
}
