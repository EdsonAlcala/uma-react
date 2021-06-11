import { renderHook } from '@testing-library/react-hooks'
import { ethers } from 'ethers'
import React from 'react'

import { EthereumAddress } from '../types'

import { ReactWeb3Provider } from './useWeb3Provider'
import { useERC20At } from './useERC20At'
import { deployERC20 } from './utils'
import { UMARegistryProvider } from './useUMARegistry'

describe('useERC20At tests', () => {
    let tokenAddress: EthereumAddress
    let injectedProvider: ethers.providers.Web3Provider

    beforeAll(async () => {
        injectedProvider = (global as any).ethersProvider
        const signer = injectedProvider.getSigner()

        // deploy token
        tokenAddress = await deployERC20(signer)
    })

    const render = () => {
        const wrapper = ({ children }: any) => (
            <UMARegistryProvider>
                <ReactWeb3Provider injectedProvider={injectedProvider}>{children}</ReactWeb3Provider>
            </UMARegistryProvider>
        )
        const result = renderHook(() => useERC20At(tokenAddress), { wrapper })
        return result
    }

    test('properties are defined', async () => {
        const { result, waitForNextUpdate } = render()

        await waitForNextUpdate()
        await waitForNextUpdate()

        expect(result.current.instance).toBeDefined()
    })
})
