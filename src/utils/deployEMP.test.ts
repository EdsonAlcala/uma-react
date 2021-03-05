/**
 * @jest-environment node
 */

import { ethers } from 'ethers'

import { UMA } from '../constants'
import { EMPParameters } from '../types'

import { getTestPriceIdentifier } from './getTestPriceIdentifier'
import { getTestCollaterals } from './getTestCollateral'
import { deployEMP } from './deployEMP'
import { Ganache } from './ganache'

describe('Deploy EMP Tests', () => {
    let signer: ethers.Signer
    let network: ethers.providers.Network
    let ganacheInstance: Ganache

    beforeAll(async () => {
        ganacheInstance = new Ganache({
            port: 8549,
            gasLimit: 10000000,
        })
        await ganacheInstance.start()

        const ganacheProvider = ganacheInstance.server.provider
        const provider = new ethers.providers.Web3Provider(ganacheProvider)
        network = await provider.getNetwork()
        signer = provider.getSigner()
        console.log('Network', network)
    })

    afterAll(async () => {
        await ganacheInstance.stop()
    })

    test('that deploy EMP correctly', async () => {
        const umaCollateralInfo = getTestCollaterals().find((s) => s.symbol === UMA)
        if (!umaCollateralInfo) {
            throw new Error("Couldn't find collateral info")
        }
        const values: EMPParameters = {
            expirationTimestamp: new Date(2022, 10, 10).getTime(),
            collateralAddress: umaCollateralInfo.address,
            priceFeedIdentifier: getTestPriceIdentifier(),
            syntheticName: 'yUMA-JUN2021',
            syntheticSymbol: 'Yield UMA June',
            collateralRequirement: 125,
            minSponsorTokens: 100,
            liquidationLiveness: 7200,
            withdrawalLiveness: 7200,
        }

        const receipt = await deployEMP(values, network, signer)

        expect(receipt).toBeDefined()
    })
})
