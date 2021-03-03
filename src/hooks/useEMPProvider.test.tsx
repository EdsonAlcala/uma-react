import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { ethers } from "ethers";

import { Ganache, getUMAInterfaces, deployEMP } from "../utils";
import { buildFakeEMP } from "./faker";
import { EMPProvider, useEMPProvider } from "./useEMPProvider";
import { UMARegistryProvider } from "./useUMARegistry";
import { ReactWeb3Provider } from "./useWeb3Provider";

describe('useEMPProvider tests', () => {

    let ganacheInstance: Ganache;
    let injectedProvider: ethers.providers.Web3Provider
    let instance: ethers.Contract

    beforeAll(async () => {
        ganacheInstance = new Ganache({
            port: 8549,
            gasLimit: 10000000,
        });
        await ganacheInstance.start();

        const ganacheProvider = ganacheInstance.server.provider;
        injectedProvider = new ethers.providers.Web3Provider(ganacheProvider);

        const network = await injectedProvider.getNetwork()
        const signer = injectedProvider.getSigner();

        const sampleEMP = buildFakeEMP()
        const { expiringMultiPartyAddress } = await deployEMP(sampleEMP, network, signer)
        const allInterfaces = getUMAInterfaces()
        const empInterface = allInterfaces.get('ExpiringMultiParty')
        if (!empInterface) {
            throw new Error("Couldn't find the EMP interface")
        }
        instance = new ethers.Contract(expiringMultiPartyAddress, empInterface, signer)
    })

    afterAll(async () => {
        await ganacheInstance.stop();
    });

    const render = () => {
        const wrapper = ({ children }: any) => (
            <UMARegistryProvider>
                <ReactWeb3Provider injectedProvider={injectedProvider}>
                    <EMPProvider empInstance={instance}>{children}</EMPProvider>
                </ReactWeb3Provider>
            </UMARegistryProvider>

        )
        const result = renderHook(() => useEMPProvider(), { wrapper })
        return result
    }

    test('empProvider', async () => {
        const { result, waitForNextUpdate } = render()

        await waitForNextUpdate()
        await waitForNextUpdate()
        await waitForNextUpdate()
        await waitForNextUpdate()
        await waitForNextUpdate()
        await waitForNextUpdate()

        expect(result.current.instance).toBeDefined()
        expect(result.current.empState).toBeDefined()
        expect(result.current.collateralState).toBeDefined()
        expect(result.current.syntheticState).toBeDefined()
    })
})
