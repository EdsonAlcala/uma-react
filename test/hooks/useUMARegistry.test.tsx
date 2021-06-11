import React from 'react'
import { renderHook } from '@testing-library/react-hooks'

import { useUMARegistry, UMARegistryProvider } from './useUMARegistry'
import { ethers } from 'ethers'
import { ReactWeb3Provider } from './useWeb3Provider'

describe('useUMARegistry tests', () => {
    let injectedProvider: ethers.providers.Web3Provider

    beforeAll(async () => {
        injectedProvider = (global as any).ethersProvider
    })

    const render = () => {
        const wrapper = ({ children }: any) => (
            <ReactWeb3Provider injectedProvider={injectedProvider}>
                <UMARegistryProvider>{children}</UMARegistryProvider>
            </ReactWeb3Provider>
        )
        const result = renderHook(() => useUMARegistry(), { wrapper })
        return result
    }
    test('get ExpiringMultiPartyCreator', async () => {
        const { result, waitForNextUpdate } = render()

        await waitForNextUpdate()

        await waitForNextUpdate()

        expect(result.current.getContractAddress('ExpiringMultiPartyCreator')).toBeDefined()
        expect(result.current.getContractAddress('ExpiringMultiPartyCreator')).toEqual('0xddfC7E3B4531158acf4C7a5d2c3cB0eE81d018A5')
    })
})
