import { ethers } from 'ethers'

import { UMA } from '../src/constants'
import { LSPParameters } from '../src/types'

import { getTestPriceIdentifier, getTestCollaterals } from './test-utilities'
import { deployLSP } from './test-utilities/deployLSP'

describe.skip('Deploy LSP Tests', () => {
    let signer: ethers.Signer
    let network: ethers.providers.Network

    beforeAll(async () => {
        const provider: ethers.providers.Web3Provider = (global as any).ethersProvider
        network = await provider.getNetwork()
        signer = provider.getSigner()
        console.log("Network", network)
    })

    test('that deploy LSP correctly', async () => {
        const umaCollateralInfo = getTestCollaterals().find((s) => s.symbol === UMA)
        if (!umaCollateralInfo) {
            throw new Error("Couldn't find collateral info")
        }
        const values: LSPParameters = {
            expirationTimestamp: new Date(2022, 10, 10).getTime(),
            collateralToken: umaCollateralInfo.address,
            priceIdentifier: getTestPriceIdentifier(),
            syntheticName: 'yUMA-JUN2021',
            syntheticSymbol: 'Yield UMA June',
            collateralPerPair: 1,
            financialProductLibraryAddress: '' // TODO set covered call
        }

        const receipt = await deployLSP(values, network, signer)

        expect(receipt).toBeDefined()
    })
})
