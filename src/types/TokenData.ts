import { BigNumber, ContractReceipt, ethers } from "ethers"
import { NumberAsString } from "./Common"

export interface TokenData {
    symbol: string
    name: string
    decimals: number
    balance: NumberAsString
    allowance: NumberAsString | "Infinity"
    totalSupply: BigNumber
    setMaxAllowance: () => Promise<ContractReceipt>
    instance: ethers.Contract
}