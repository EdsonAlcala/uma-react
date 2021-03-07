import { BigNumber, ethers } from 'ethers'
import { NumberAsString } from './Common'

export interface TokenData {
    symbol: string
    name: string
    decimals: number
    balance: NumberAsString
    balanceBN: BigNumber
    allowance: NumberAsString | 'Infinity'
    totalSupply: BigNumber
    instance: ethers.Contract
}
