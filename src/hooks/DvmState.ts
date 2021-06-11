import { createContainer } from 'unstated-next'
import { useState, useEffect } from 'react'
import { utils } from 'ethers'

import { Connection } from './Connection'
import { DvmContracts } from './DvmContracts'
import { EmpAddress } from './EmpAddress'
import { useEMPProvider } from './useEMPProvider'

const { formatUnits: fromWei } = utils

interface ContractState {
    hasEmpPrice: boolean | null
    resolvedPrice: number | null
    finalFee: number | null
}

const initState = {
    hasEmpPrice: null,
    resolvedPrice: null,
    finalFee: null,
}

const useContractState = () => {
    const { block$ } = Connection.useContainer()
    const { votingContract, storeContract } = DvmContracts.useContainer()
    const { collateralState, empState } = useEMPProvider()
    const { empAddress } = EmpAddress.useContainer()

    const [state, setState] = useState<ContractState>(initState)

    // get state from EMP
    const queryState = async () => {
        if (votingContract !== null && storeContract !== null && empState && collateralState) {
            const { priceIdentifier, expirationTimestamp } = empState
            const { decimals: collDecimals, instance } = collateralState

            const [hasPriceResult, finalFeeResult] = await Promise.all([
                votingContract.hasPrice(priceIdentifier.toString(), expirationTimestamp.toNumber(), { from: empAddress }),
                storeContract.computeFinalFee(instance.address),
            ])

            const hasPrice = hasPriceResult as boolean
            const finalFee = parseFloat(fromWei(finalFeeResult[0].toString(), collDecimals))

            let resolvedPrice = null
            if (hasPrice) {
                try {
                    const postResolutionRes = await Promise.all([
                        votingContract.getPrice(priceIdentifier.toString(), expirationTimestamp.toNumber(), { from: empAddress }),
                    ])
                    // Important assumption we make: the price identifier's resolved price has the same
                    // precision as the collateral currency.
                    resolvedPrice = parseFloat(fromWei(postResolutionRes.toString(), collDecimals))
                } catch (err) {
                    console.error(`getPrice failed:`, err)
                }
            }

            const newState: ContractState = {
                hasEmpPrice: hasPrice,
                resolvedPrice: resolvedPrice,
                finalFee: finalFee,
            }

            setState(newState)
        }
    }

    // get state on setting of contract
    useEffect(() => {
        if (empState && collateralState) {
            queryState()
        }
    }, [votingContract, storeContract, empState, collateralState])

    // get state on each block
    useEffect(() => {
        if (block$) {
            const sub = block$.subscribe(() => queryState())
            return () => sub.unsubscribe()
        }
    }, [block$, votingContract, storeContract])

    return { dvmState: state }
}

export const DvmState = createContainer(useContractState)
