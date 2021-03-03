import { renderHook } from '@testing-library/react-hooks'
import { ethers } from 'ethers'
import React from 'react'

import { EthereumAddress } from '../types'
import { Ganache } from '../utils'

import { ReactWeb3Provider } from './useWeb3Provider'
import { useERC20At } from './useERC20At'
import { deployERC20 } from './utils'
import { UMARegistryProvider } from './useUMARegistry'

describe('useERC20At tests', () => {
    let tokenAddress: EthereumAddress
    let ganacheInstance: Ganache
    let injectedProvider: ethers.providers.Web3Provider

    beforeAll(async () => {
        ganacheInstance = new Ganache({
            port: 8549,
            gasLimit: 10000000,
        })
        await ganacheInstance.start()

        const ganacheProvider = ganacheInstance.server.provider
        injectedProvider = new ethers.providers.Web3Provider(ganacheProvider)

        const network = await injectedProvider.getNetwork()
        const signer = injectedProvider.getSigner()

        // deploy token
        tokenAddress = await deployERC20(signer)
    })

    afterAll(async () => {
        await ganacheInstance.stop()
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
