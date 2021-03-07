import { useEffect, useState } from 'react'
import { BigNumber, ethers } from 'ethers'

import { EMPData, EthereumAddress, TokenData } from '../types'
import { fromWei } from '../utils'
import { INFINITY } from '../constants'

import { useWeb3Provider } from './useWeb3Provider'
import { useERC20At } from './useERC20At'

export const useCollateralToken = (empAddress: EthereumAddress, address: EthereumAddress, empState?: EMPData): TokenData | undefined => {
    // external
    const { block$ } = useWeb3Provider()
    const tokenAddress = empState ? empState.collateralCurrency : undefined
    const { instance } = useERC20At(tokenAddress)

    // state
    const [collateralState, setCollateralState] = useState<TokenData | undefined>(undefined)

    const getBalance = async (contractInstance: ethers.Contract, addressParam: EthereumAddress) => {
        const balanceRaw: BigNumber = await contractInstance.balanceOf(addressParam)
        return balanceRaw
    }

    const getAllowance = async (contractInstance: ethers.Contract, addressParam: EthereumAddress, newDecimals: number) => {
        const allowanceRaw: BigNumber = await contractInstance.allowance(addressParam, empAddress)
        const newAllowance = allowanceRaw.eq(ethers.constants.MaxUint256) ? INFINITY : fromWei(allowanceRaw, newDecimals)

        return newAllowance
    }

    const getCollateralInfo = async (contractInstance: ethers.Contract) => {
        const [newSymbol, newName, newDecimals, newTotalSupply] = await Promise.all([
            contractInstance.symbol(),
            contractInstance.name(),
            contractInstance.decimals(),
            contractInstance.totalSupply(),
        ])

        const [balanceRaw, newAllowance] = await Promise.all([
            getBalance(contractInstance, address),
            getAllowance(contractInstance, address, newDecimals),
        ])

        setCollateralState({
            symbol: newSymbol,
            name: newName,
            decimals: newDecimals,
            totalSupply: newTotalSupply,
            allowance: newAllowance,
            balance: fromWei(balanceRaw, newDecimals),
            balanceBN: balanceRaw,
            // setMaxAllowance,
            instance: contractInstance,
        })
    }

    useEffect(() => {
        if (instance) {
            setCollateralState(undefined)
            getCollateralInfo(instance).catch((error) => console.log('error getting token info', error))
        }
    }, [instance, address]) // eslint-disable-line

    // get collateral info on each new block
    useEffect(() => {
        if (block$ && instance) {
            const sub = block$.subscribe(() => getCollateralInfo(instance).catch((error) => console.log('Error getCollateralInfo', error)))
            return () => sub.unsubscribe()
        }
    }, [block$, instance]) // eslint-disable-line

    return collateralState
}
