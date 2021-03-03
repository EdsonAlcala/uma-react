/**
 * @jest-environment node
 */

import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { ethers } from 'ethers'

import { Ganache } from '../utils/ganache'

import { useWeb3Provider, ReactWeb3Provider } from './useWeb3Provider'

describe('useWeb3Provider tests', () => {
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
    })

    const render = () => {
        const wrapper = ({ children }: any) => (
            <ReactWeb3Provider injectedProvider={injectedProvider}>{children}</ReactWeb3Provider>
        )
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

        expect(result.current.address).toEqual('0x34ACCc6603C99C9e8608E5ab1903c1F4196641ce')
    })

    afterAll(async () => {
        await ganacheInstance.stop()
    })
})
