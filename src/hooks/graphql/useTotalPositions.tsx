import { useState } from 'react'
import { ApolloError, gql, useQuery } from '@apollo/client'

export const ALL_POSITIONS = gql`
    query allPositions {
        financialContracts {
            id
            positions {
                id
            }
        }
    }
`

interface ApolloProps {
    loading: boolean
    error: ApolloError
}

interface PositionsData {
    total: number
    // TODO: in case required: items: PositionData[]
}

interface State {
    positionsData: PositionsData
}

export const useTotalPositions = (): State & ApolloProps => {
    const [positionsData, setPositionsData] = useState<undefined | PositionsData>(undefined)

    const { loading, error } = useQuery(ALL_POSITIONS, {
        onCompleted: (data) => {
            console.log("Data", data)
            const allPositions = data.financialContracts.map((item) => {
                return item.positions
            })

            let total = allPositions.reduce((accumulator, currentValue) => {
                return accumulator + Number(currentValue.length)
            }, 0)

            setPositionsData({
                total
            })
        },
    })

    return {
        positionsData,
        loading,
        error
    }
}
