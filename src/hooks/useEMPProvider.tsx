import React, { PropsWithChildren, useContext, useEffect, useState } from 'react'
import { BigNumber, Bytes, ethers } from 'ethers'

import { EMPData, EthereumAddress, TokenData } from '../types'

import { useWeb3Provider } from './useWeb3Provider'
import { useCollateralToken } from './useCollateralToken'
import { useSyntheticToken } from './useSyntheticToken'

interface IEMPProvider {
    empState: EMPData | undefined
    collateralState: TokenData | undefined
    syntheticState: TokenData | undefined
    instance: ethers.Contract
}

const EMPContext = React.createContext<IEMPProvider>({
    empState: undefined,
    collateralState: undefined,
    syntheticState: undefined,
    instance: {} as ethers.Contract,
})

interface EMPProviderProps {
    empInstance: ethers.Contract
}

export const getAllEMPData = async (empInstance: ethers.Contract) => {
    const res = await Promise.all([
        empInstance.expirationTimestamp(),
        empInstance.collateralCurrency(),
        empInstance.priceIdentifier(),
        empInstance.tokenCurrency(),
        empInstance.collateralRequirement(),
        empInstance.minSponsorTokens(),
        empInstance.timerAddress(),
        empInstance.cumulativeFeeMultiplier(),
        empInstance.rawTotalPositionCollateral(),
        empInstance.totalTokensOutstanding(),
        empInstance.liquidationLiveness(),
        empInstance.withdrawalLiveness(),
        empInstance.getCurrentTime(),
        empInstance.contractState(),
        empInstance.finder(),
        empInstance.expiryPrice(),
        empInstance.disputeBondPercentage(),
        empInstance.disputerDisputeRewardPercentage(),
        empInstance.sponsorDisputeRewardPercentage(),
    ])

    const newState: EMPData = {
        expirationTimestamp: res[0] as BigNumber,
        collateralCurrency: res[1] as EthereumAddress,
        priceIdentifier: res[2] as Bytes,
        tokenCurrency: res[3] as EthereumAddress,
        collateralRequirement: res[4] as BigNumber,
        minSponsorTokens: res[5] as BigNumber,
        timerAddress: res[6] as EthereumAddress,
        cumulativeFeeMultiplier: res[7] as BigNumber,
        rawTotalPositionCollateral: res[8] as BigNumber,
        totalTokensOutstanding: res[9] as BigNumber,
        liquidationLiveness: res[10] as BigNumber,
        withdrawalLiveness: res[11] as BigNumber,
        currentTime: res[12] as BigNumber,
        isExpired: Number(res[12]) >= Number(res[0]),
        contractState: Number(res[13]),
        finderAddress: res[14] as EthereumAddress,
        expiryPrice: res[15] as BigNumber,
        disputeBondPercentage: res[16] as BigNumber,
        disputerDisputeRewardPercentage: res[17] as BigNumber,
        sponsorDisputeRewardPercentage: res[18] as BigNumber,
    }

    return newState
}

export const EMPProvider: React.FC<PropsWithChildren<EMPProviderProps>> = ({ children, empInstance }) => {
    const [empState, setEMPState] = useState<EMPData | undefined>(undefined)
    const [collateralState, setCollateralState] = useState<TokenData | undefined>(undefined)
    const [syntheticState, setSyntheticState] = useState<TokenData | undefined>(undefined)
    const [instance, setInstance] = useState(empInstance)

    const { block$, address } = useWeb3Provider()

    const collateralStateResult = useCollateralToken(empInstance.address, address, empState)
    const syntheticStateResult = useSyntheticToken(empInstance.address, address, empState)

    useEffect(() => {
        getAllEMPData(empInstance)
            .then((newState) => setEMPState(newState))
            .catch((error) => {
                console.log('Error on getAllEMPData', error)
            })
    }, [empInstance]) // eslint-disable-line

    // get state on each block
    useEffect(() => {
        if (block$ && empInstance) {
            const sub = block$.subscribe(() =>
                getAllEMPData(empInstance)
                    .then((newState) => setEMPState(newState as any))
                    .catch((error) => console.log('error getAllEMPData', error)),
            )
            return () => sub.unsubscribe()
        }
    }, [block$, empInstance]) // eslint-disable-line

    useEffect(() => {
        if (collateralStateResult) {
            setCollateralState(collateralStateResult)
        }
    }, [collateralStateResult])

    useEffect(() => {
        if (syntheticStateResult) {
            setSyntheticState(syntheticStateResult)
        }
    }, [syntheticStateResult])

    useEffect(() => {
        setInstance(empInstance)
    }, [empInstance])

    return (
        <EMPContext.Provider
            value={{
                empState,
                collateralState,
                syntheticState,
                instance,
            }}
        >
            {children}
        </EMPContext.Provider>
    )
}

export const useEMPProvider = (): IEMPProvider => {
    const context = useContext(EMPContext)

    if (context === null) {
        throw new Error(
            'useEMPProvider() can only be used inside of <EMPProvider />, please declare it at a higher level',
        )
    }
    return context
}
