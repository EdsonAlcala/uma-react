import { renderHook } from '@testing-library/react-hooks'
import { ethers } from 'ethers'
import React from 'react'

import { UMARegistryProvider, getUMAInterfaces, EMPProvider, ReactWeb3Provider, EthereumAddress, createPosition, usePosition } from '../../src'
import { deployEMP, } from '../test-utilities'
import { buildFakeEMP } from '../fakers'

describe.skip('usePosition tests', () => {
    let injectedProvider: ethers.providers.Web3Provider
    let instance: ethers.Contract
    let ownerAddress: EthereumAddress

    beforeAll(async () => {
        injectedProvider = (global as any).ethersProvider

        const network = await injectedProvider.getNetwork()
        const signer = injectedProvider.getSigner()

        const sampleEMP = buildFakeEMP()
        ownerAddress = await signer.getAddress()

        // create sample EMP
        const { expiringMultiPartyAddress } = await deployEMP(sampleEMP, network, signer)
        const allInterfaces = getUMAInterfaces()
        const empInterface = allInterfaces.get('ExpiringMultiParty')
        const erc20Interface = allInterfaces.get('ERC20')

        if (!empInterface) {
            throw new Error("Couldn't find the EMP interface")
        }

        if (!erc20Interface) {
            throw new Error("Couldn't find the ERC20 interface")
        }

        instance = new ethers.Contract(expiringMultiPartyAddress, empInterface, signer)
        const collateralAmount = 2000
        const syntheticTokens = 100

        // approve collateral
        const collateralAddress = await instance.collateralCurrency()
        console.log('collateralAddress', collateralAddress)
        const collateralInstance = new ethers.Contract(collateralAddress, erc20Interface, signer)
        const tx1 = await collateralInstance.approve(expiringMultiPartyAddress, ethers.constants.MaxUint256)
        await tx1.wait()

        // create a sample position
        await createPosition(expiringMultiPartyAddress, collateralAmount, syntheticTokens, signer)
    })

    const render = () => {
        const wrapper = ({ children }: any) => (
            <UMARegistryProvider>
                <ReactWeb3Provider injectedProvider={injectedProvider}>
                    <EMPProvider empInstance={instance}>{children}</EMPProvider>
                </ReactWeb3Provider>
            </UMARegistryProvider>
        )
        const result = renderHook(() => usePosition(ownerAddress), { wrapper })
        return result
    }

    test('properties are defined', async () => {
        const { result, waitForNextUpdate } = render()

        await waitForNextUpdate()
        await waitForNextUpdate()
        await waitForNextUpdate()
        await waitForNextUpdate()
        await waitForNextUpdate()
        await waitForNextUpdate()
        await waitForNextUpdate()

        expect(result.current).toBeDefined()
        expect(result.current!.collateral).toBeDefined()
    })
})
