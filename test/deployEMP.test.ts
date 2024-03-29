import { ethers } from 'ethers'

import { UMA } from '../src/constants'
import { EMPParameters } from '../src/types'

import { getTestPriceIdentifier, getTestCollaterals, deployEMP } from './test-utilities'

describe('Deploy EMP Tests', () => {
    let signer: ethers.Signer
    let network: ethers.providers.Network

    beforeAll(async () => {
        const provider: ethers.providers.Web3Provider = (global as any).ethersProvider
        network = await provider.getNetwork()
        signer = provider.getSigner()
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
