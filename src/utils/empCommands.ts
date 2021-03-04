import { BigNumber, ethers } from "ethers";

export const create = async (instance: ethers.Contract, collateral: BigNumber, tokens: BigNumber) => {
    const receipt = await instance.create([collateral], [tokens])
    await receipt.wait();
}

export const deposit = async (instance: ethers.Contract, collateralToDeposit: BigNumber) => {
    const receipt = await instance.deposit([collateralToDeposit])
    await receipt.wait();
}

export const redeem = async (instance: ethers.Contract, tokensToRedeem: BigNumber) => {
    const receipt = await instance.redeem([tokensToRedeem])
    await receipt.wait();
}

export const withdraw = async (instance: ethers.Contract, collateralToWithdraw: BigNumber) => {
    const receipt = await instance.withdraw([collateralToWithdraw])
    await receipt.wait();
}