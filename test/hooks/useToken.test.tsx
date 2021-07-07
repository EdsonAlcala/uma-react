import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { ethers } from 'ethers'

import { UMARegistryProvider, useToken, getAllEMPData, EMPData, EthereumAddress, getUMAInterfaces, EMPProvider, ReactWeb3Provider } from '../../src'

import { deployEMP } from '../test-utilities'
import { buildFakeEMP } from '../fakers'

describe('useCollateralToken tests', () => {
    let empAddress: EthereumAddress
    let signer: ethers.Signer
    let network: ethers.providers.Network
    let userAddress: EthereumAddress
    let empInstance: ethers.Contract
    let empData: EMPData
    let injectedProvider: ethers.providers.Web3Provider

    beforeAll(async () => {
        injectedProvider = (global as any).ethersProvider
        network = await injectedProvider.getNetwork()
        signer = injectedProvider.getSigner()
        userAddress = await signer.getAddress()

        const sampleEMP = buildFakeEMP()
        const { expiringMultiPartyAddress } = await deployEMP(sampleEMP, network, signer)

        empAddress = expiringMultiPartyAddress
        const allInterfaces = getUMAInterfaces()
        empInstance = new ethers.Contract(expiringMultiPartyAddress, allInterfaces.get('ExpiringMultiParty') as ethers.utils.Interface, signer)
        empData = (await getAllEMPData(empInstance)) as EMPData
    })

    const renderCollateral = () => {
        const wrapper = ({ children }: any) => (
            <UMARegistryProvider>
                <ReactWeb3Provider injectedProvider={injectedProvider}>{children}</ReactWeb3Provider>
            </UMARegistryProvider>
        )
        const result = renderHook(() => useToken(empAddress, userAddress, empData.collateralCurrency), { wrapper })
        return result
    }

    const renderToken = () => {
        const wrapper = ({ children }: any) => (
            <UMARegistryProvider>
                <ReactWeb3Provider injectedProvider={injectedProvider}>{children}</ReactWeb3Provider>
            </UMARegistryProvider>
        )
        const result = renderHook(() => useToken(empAddress, userAddress, empData.tokenCurrency), { wrapper })
        return result
    }

    test('properties are defined [collateral]', async () => {
        const { result, waitForNextUpdate } = renderCollateral()

        await waitForNextUpdate()

        await waitForNextUpdate()

        await waitForNextUpdate()

        expect(result.current).toBeDefined()
        expect(result.current!.name).toEqual('UMA Voting Token v1')
        expect(result.current!.decimals).toEqual(18)
        expect(result.current!.symbol).toEqual('UMA')
    })

    test('properties are defined [synthetic token]', async () => {
        const { result, waitForNextUpdate } = renderToken()

        await waitForNextUpdate()

        await waitForNextUpdate()

        await waitForNextUpdate()

        expect(result.current).toBeDefined()
        expect(result.current!.name).toEqual('YD-UMA-JUN21')
        expect(result.current!.decimals).toEqual(18)
        expect(result.current!.symbol).toEqual('YD-UMA-JUN21')
    })
})
