import { ContractReceipt, ethers } from 'ethers'
import { getUMAInterfaces } from '../utils'
import TestnetERC20Artifact from '@uma/core/build/contracts/TestnetERC20.json'
import { EthereumAddress } from '../types'
import { toWei } from 'web3-utils'

export const deployERC20 = async (signer: ethers.Signer): Promise<EthereumAddress> => {
    const newToken = {
        name: 'SampleERC20',
        symbol: 'SERC20',
        decimals: 18,
        totalSupply: 10000,
    }

    const testnetERC20Factory = new ethers.ContractFactory(TestnetERC20Artifact.abi, TestnetERC20Artifact.bytecode, signer)
    const collateralTokenContract = await testnetERC20Factory.deploy(newToken.name, newToken.symbol, newToken.decimals)

    await collateralTokenContract.deployTransaction.wait()
    return collateralTokenContract.address
}

export const createPosition = async (
    empAddress: EthereumAddress,
    collateralAmount: number,
    syntheticTokens: number,
    signer: ethers.Signer,
): Promise<ContractReceipt> => {
    const allUMAInterfaces = getUMAInterfaces()
    const expiringMultipartyInterface = allUMAInterfaces.get('ExpiringMultiParty') as ethers.utils.Interface

    const contract = new ethers.Contract(empAddress, expiringMultipartyInterface, signer)
    const receipt = await contract.create({ rawValue: toWei(`${collateralAmount}`) }, { rawValue: toWei(`${syntheticTokens}`) })

    await receipt.wait()

    console.log('Position created')
    return Promise.resolve(receipt)
}
