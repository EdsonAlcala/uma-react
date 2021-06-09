import React, { PropsWithChildren, useContext, useEffect, useState } from 'react'
import { BigNumber, Bytes, ethers } from 'ethers'
import { Observable } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { EMPData, EthereumAddress, TokenData } from '../types'

import { useWeb3Provider } from './useWeb3Provider'
import { useToken } from './useToken'


interface IEMPProvider {
    empState: EMPData | undefined
    collateralState: TokenData | undefined
    syntheticState: TokenData | undefined
    instance: ethers.Contract
    change$: Observable<any> | undefined
}

const EMPContext = React.createContext<IEMPProvider>({
    empState: undefined,
    collateralState: undefined,
    syntheticState: undefined,
    instance: {} as ethers.Contract,
    change$: undefined,
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
    const [change$, setChange$] = useState<Observable<any> | undefined>(undefined)

    const { address } = useWeb3Provider()

    const collateralStateResult = useToken(empInstance.address, address, empState ? empState.collateralCurrency : undefined)
    const syntheticStateResult = useToken(empInstance.address, address, empState ? empState.tokenCurrency : undefined)

    useEffect(() => {
        if (empInstance) {
            getAllEMPData(empInstance)
                .then((newState) => setEMPState(newState))
                .catch((error) => {
                    console.log('Error on getAllEMPData', error)
                })

            const observableCallBack = (subscriber) => {
                console.log('Called observable callback')
                getAllEMPData(empInstance)
                    .then((newState) => {
                        setEMPState(newState as any)
                        subscriber.next()
                    })
                    .catch((error) => console.log('error getAllEMPData', error))
            }

            const observable = new Observable<any>((subscriber) => {
                empInstance.on('LiquidationCreated', (...args) => {
                    observableCallBack(subscriber)
                })
                empInstance.on('LiquidationDisputed', (...args) => {
                    observableCallBack(subscriber)
                })
                empInstance.on('DisputeSettled', (...args) => {
                    observableCallBack(subscriber)
                })
                empInstance.on('LiquidationWithdrawn', (...args) => {
                    observableCallBack(subscriber)
                })
                empInstance.on('Deposit', (...args) => {
                    observableCallBack(subscriber)
                })
                empInstance.on('Withdrawal', (...args) => {
                    observableCallBack(subscriber)
                })
                empInstance.on('RequestWithdrawal', (...args) => {
                    observableCallBack(subscriber)
                })
                empInstance.on('RequestWithdrawalExecuted', (...args) => {
                    observableCallBack(subscriber)
                })
                empInstance.on('RequestWithdrawalCanceled', (...args) => {
                    observableCallBack(subscriber)
                })
                empInstance.on('PositionCreated', (...args) => {
                    observableCallBack(subscriber)
                })
                empInstance.on('NewSponsor', (...args) => {
                    observableCallBack(subscriber)
                })
                empInstance.on('EndedSponsorPosition', (...args) => {
                    observableCallBack(subscriber)
                })
                empInstance.on('Repay', (...args) => {
                    observableCallBack(subscriber)
                })
                empInstance.on('Redeem', (...args) => {
                    observableCallBack(subscriber)
                })
                empInstance.on('ContractExpired', (...args) => {
                    observableCallBack(subscriber)
                })
                empInstance.on('SettleExpiredPosition', (...args) => {
                    observableCallBack(subscriber)
                })
                empInstance.on('RequestTransferPosition', (...args) => {
                    observableCallBack(subscriber)
                })
                empInstance.on('RequestTransferPositionExecuted', (...args) => {
                    observableCallBack(subscriber)
                })
                empInstance.on('RequestTransferPositionCanceled', (...args) => {
                    observableCallBack(subscriber)
                })
            })
            // debounce to prevent subscribers making unnecessary calls
            setChange$(observable.pipe(debounceTime(1000)))
        }
    }, [empInstance]) // eslint-disable-line

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
                change$,
            }}
        >
            {children}
        </EMPContext.Provider>
    )
}

export const useEMPProvider = (): IEMPProvider => {
    const context = useContext(EMPContext)

    if (context === null) {
        throw new Error('useEMPProvider() can only be used inside of <EMPProvider />, please declare it at a higher level')
    }
    return context
}
