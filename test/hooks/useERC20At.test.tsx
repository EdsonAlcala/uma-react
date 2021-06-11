import { renderHook } from '@testing-library/react-hooks'
import { ethers } from 'ethers'
import React from 'react'

import { EthereumAddress, ReactWeb3Provider, useERC20At, UMARegistryProvider, deployERC20 } from '../../src'

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
