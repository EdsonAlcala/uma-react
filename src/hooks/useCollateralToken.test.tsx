import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { ethers } from 'ethers'

import { deployEMP, getUMAInterfaces } from '../utils'
import { EMPData, EthereumAddress } from '../types'

import { ReactWeb3Provider } from './useWeb3Provider'
import { useCollateralToken } from './useCollateralToken'
import { getAllEMPData } from './useEMPProvider'
import { UMARegistryProvider } from './useUMARegistry'
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

    const render = () => {
        const wrapper = ({ children }: any) => (
            <UMARegistryProvider>
                <ReactWeb3Provider injectedProvider={injectedProvider}>{children}</ReactWeb3Provider>
            </UMARegistryProvider>
        )
        const result = renderHook(() => useCollateralToken(empAddress, userAddress, empData), { wrapper })
        return result
    }

    test('properties are defined', async () => {
        const { result, waitForNextUpdate } = render()

        await waitForNextUpdate()

        await waitForNextUpdate()

        await waitForNextUpdate()

        await waitForNextUpdate()

        expect(result.current).toBeDefined()
        expect(result.current!.name).toEqual('UMA Voting Token v1')
        expect(result.current!.decimals).toEqual(18)
        expect(result.current!.symbol).toEqual('UMA')
    })
})
