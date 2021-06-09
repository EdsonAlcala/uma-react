import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { EthereumAddress } from '../../types'

export const ALL_EMPS = gql`
    query allEMPs {
        financialContracts(orderBy: deploymentTimestamp, orderDirection: desc) {
            id
            syntheticToken {
                symbol
            }
        }
    }
`

export interface EMPItem {
    id: EthereumAddress
    symbol: string
}

interface EMPsData {
    total: number
    items: EthereumAddress[]
    allItemsTyped: EMPItem[]
}

export const useEMPs = (): EMPsData => {
    const [empsData, setEMPsData] = useState<undefined | EMPsData>(undefined)

    // TODO: handle errors
    const { loading, error } = useQuery(ALL_EMPS, {
        onCompleted: (data) => {
            const allEMPs = data.financialContracts.map((item) => {
                return item.id
            })
            const allEMPsNames = data.financialContracts.map((item) => {
                return item.syntheticToken.symbol
            })
            const allItemsTyped = data.financialContracts.map((item) => {
                return {
                    id: item.id,
                    symbol: item.syntheticToken.symbol,
                }
            })
            setEMPsData({
                total: allEMPs.length,
                items: [...allEMPs, ...allEMPsNames],
                allItemsTyped,
            })
        },
    })

    return empsData
}
