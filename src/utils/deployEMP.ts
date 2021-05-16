import { ethers, utils, ContractReceipt } from 'ethers'
import { toWei } from 'web3-utils'
import ExpiringMultiPartyCreatorArtifact from '@uma/core/build/contracts/ExpiringMultiPartyCreator.json'
import Web3 from 'web3'

import { EMPParameters, EthereumAddress } from '../types'
import { getUMAAbis } from './umaAbis'
import { getUMAAddresses } from './umaAddresses'


interface EMPDeployResult {
    receipt: ContractReceipt
    expiringMultiPartyAddress: EthereumAddress
}

export const deployEMP = async (values: EMPParameters, network: ethers.providers.Network, signer: ethers.Signer): Promise<EMPDeployResult> => {
    const { expirationTimestamp, collateralAddress, priceFeedIdentifier, syntheticName, syntheticSymbol, collateralRequirement } = values

    const { disputeBondPercentage, sponsorDisputeRewardPercentage, disputerDisputeRewardPercentage, financialProductLibraryAddress } = values

    const params = {
        expirationTimestamp: expirationTimestamp.toString(),
        collateralAddress,
        priceFeedIdentifier: utils.formatBytes32String(priceFeedIdentifier),
        syntheticName,
        syntheticSymbol,
        collateralRequirement: {
            rawValue: toWei(`${collateralRequirement / 100}`),
        },
        disputeBondPercentage: {
            rawValue: toWei(disputeBondPercentage ? `${disputeBondPercentage / 100}` : '0.1'), // 0.1 -> 10 % dispute bond.
        },
        sponsorDisputeRewardPercentage: {
            rawValue: toWei(sponsorDisputeRewardPercentage ? `${sponsorDisputeRewardPercentage / 100}` : '0.05'), // 0.05 -> 5% reward for sponsors who are disputed invalidly.
        },
        disputerDisputeRewardPercentage: {
            rawValue: toWei(disputerDisputeRewardPercentage ? `${disputerDisputeRewardPercentage / 100}` : '0.2'), // 0.2 -> 20% reward for correct disputes.
        },
        minSponsorTokens: {
            rawValue: toWei(`${values.minSponsorTokens}`),
        },
        liquidationLiveness: 7200,
        withdrawalLiveness: 7200,
        financialProductLibraryAddress: financialProductLibraryAddress
            ? financialProductLibraryAddress
            : '0x0000000000000000000000000000000000000000',
    }

    const umaABIs = getUMAAbis()
    const umaAddresses = getUMAAddresses(network.chainId)

    const expiringMultipartyCreatorInterface = umaABIs.get('ExpiringMultiPartyCreator')
    if (!expiringMultipartyCreatorInterface) {
        throw new Error('Invalid ExpiringMultipartyCreator Interface')
    }

    const expiringMultipartyCreatorAddress = umaAddresses.get('ExpiringMultiPartyCreator')
    if (!expiringMultipartyCreatorAddress) {
        throw new Error('Invalid ExpiringMultipartyCreator Address')
    }

    console.log('expiringMultipartyCreatorAddress', expiringMultipartyCreatorAddress)

    const expiringMultipartyCreator = new ethers.Contract(expiringMultipartyCreatorAddress, expiringMultipartyCreatorInterface, signer)

    const web3 = new Web3("http://localhost:8549")
    const web3Contract = new web3.eth.Contract(ExpiringMultiPartyCreatorArtifact.abi as any, expiringMultipartyCreatorAddress)

    const expiringMultiPartyAddress = await web3Contract.methods.createExpiringMultiParty(params).call({
        gas: 12000000, // 12MM is very high. Set this lower if you only have < 2 ETH or so in your wallet.
        gasPrice: 200 * 1000000000, // gasprice arg * 1 GWEI
        from: "0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    })
    console.log('expiringMultiPartyAddress', expiringMultiPartyAddress)

    const txn = await expiringMultipartyCreator.createExpiringMultiParty(params)

    const receipt: ContractReceipt = await txn.wait()

    return { receipt, expiringMultiPartyAddress }


}
