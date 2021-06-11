import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { ethers } from 'ethers'

import { useWeb3Provider, ReactWeb3Provider } from './useWeb3Provider'

describe('useWeb3Provider tests', () => {
    let injectedProvider: ethers.providers.Web3Provider
    let accounts: string[]
    beforeAll(async () => {
        injectedProvider = (global as any).ethersProvider
        accounts = await injectedProvider.listAccounts()
    })

    const render = () => {
        const wrapper = ({ children }: any) => <ReactWeb3Provider injectedProvider={injectedProvider}>{children}</ReactWeb3Provider>
        const result = renderHook(() => useWeb3Provider(), { wrapper })
        return result
    }

    test('provider', async () => {
        const { result, waitForNextUpdate } = render()

        await waitForNextUpdate()

        await waitForNextUpdate()

        expect(result.current.provider).toBeDefined()
    })

    test('signer', async () => {
        const { result, waitForNextUpdate } = render()

        await waitForNextUpdate()

        await waitForNextUpdate()

        expect(result.current.signer).toBeDefined()
    })

    test('observable block', async () => {
        const { result, waitForNextUpdate } = render()

        await waitForNextUpdate()

        await waitForNextUpdate()

        expect(result.current.block$).toBeDefined()
    })

    test('address', async () => {
        const { result, waitForNextUpdate } = render()

        await waitForNextUpdate()

        await waitForNextUpdate()

        expect(result.current.address).toEqual(accounts[0])
    })
})
