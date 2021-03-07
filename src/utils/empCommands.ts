import { BigNumber, ContractReceipt, ethers } from 'ethers'

export const create = async (instance: ethers.Contract, collateral: BigNumber, tokens: BigNumber): Promise<ContractReceipt> => {
    const receipt = await instance.create([collateral], [tokens])
    await receipt.wait()
    return receipt
}

export const deposit = async (instance: ethers.Contract, collateralToDeposit: BigNumber): Promise<ContractReceipt> => {
    const receipt = await instance.deposit([collateralToDeposit])
    await receipt.wait()
    return receipt

    // TODO: Think how to pass options elegantly, like the typechain...
    // {
    // gasPrice: 200000,
    // gasLimit: 2000000
    // }
}

export const redeem = async (instance: ethers.Contract, tokensToRedeem: BigNumber): Promise<ContractReceipt> => {
    const receipt = await instance.redeem([tokensToRedeem])
    await receipt.wait()
    return receipt
}

export const withdraw = async (instance: ethers.Contract, collateralToWithdraw: BigNumber): Promise<ContractReceipt> => {
    const receipt = await instance.withdraw([collateralToWithdraw])
    await receipt.wait()
    return receipt
}

export const requestWithdrawal = async (instance: ethers.Contract, collateralToWithdraw: BigNumber): Promise<ContractReceipt> => {
    const receipt = await instance.requestWithdrawal([collateralToWithdraw])
    await receipt.wait()
    return receipt
}
