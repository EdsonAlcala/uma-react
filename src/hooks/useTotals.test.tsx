import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { ethers } from 'ethers'

import { deployEMP, getUMAInterfaces } from '../utils'

import { ReactWeb3Provider } from './useWeb3Provider'
import { useTotals } from './useTotals'
import { EMPProvider } from './useEMPProvider'
import { UMARegistryProvider } from './useUMARegistry'
import { buildFakeEMP } from '../fakers'

describe('useTotals tests', () => {
    let injectedProvider: ethers.providers.Web3Provider
    let instance: ethers.Contract

    beforeAll(async () => {
        injectedProvider = (global as any).ethersProvider
        const network = await injectedProvider.getNetwork()
        const signer = injectedProvider.getSigner()

        const sampleEMP = buildFakeEMP()
        const { expiringMultiPartyAddress } = await deployEMP(sampleEMP, network, signer)
        const allInterfaces = getUMAInterfaces()
        const empInterface = allInterfaces.get('ExpiringMultiParty')
        if (!empInterface) {
            throw new Error("Couldn't find the EMP interface")
        }
        instance = new ethers.Contract(expiringMultiPartyAddress, empInterface, signer)
    })

    const render = () => {
        const wrapper = ({ children }: any) => (
            <UMARegistryProvider>
                <ReactWeb3Provider injectedProvider={injectedProvider}>
                    <EMPProvider empInstance={instance}>{children}</EMPProvider>
                </ReactWeb3Provider>
            </UMARegistryProvider>
        )
        const result = renderHook(() => useTotals(), { wrapper })
        return result
    }

    test('values are defined', async () => {
        const { result, waitForNextUpdate } = render()

        await waitForNextUpdate()

        await waitForNextUpdate()

        await waitForNextUpdate()

        await waitForNextUpdate()

        await waitForNextUpdate()

        await waitForNextUpdate()

        expect(result.current!.gcr).toBeDefined()
        expect(result.current!.totalCollateral).toBeDefined()
        expect(result.current!.totalSyntheticTokens).toBeDefined()
    })
})
