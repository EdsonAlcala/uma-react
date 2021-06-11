import { useState, useEffect } from 'react'
import { getOffchainPriceFromTokenSymbol } from '../utils/getOffchainPrice'
import { getSimplePriceByContract } from '../utils/getCoinGeckoTokenPrice'

import { Token, TokenData } from '../types'

export const usePriceFeed = (token?: Token | TokenData) => {
    const [latestPrice, setLatestPrice] = useState<number | null>(null)

    const queryPrice = async () => {
        if (token) {
            try {
                const address = token.id
                const query = await getSimplePriceByContract(address)
                setLatestPrice(query)
            } catch (error) {
                try {
                    const symbol = token.symbol
                    const query = await getOffchainPriceFromTokenSymbol(symbol)
                    setLatestPrice(query)
                } catch (error) {
                    console.log('Error getting price for', token.symbol, token.id)
                    setLatestPrice(null)
                }
            }
        }
    }

    useEffect(() => {
        queryPrice()
    }, [token])

    return {
        latestPrice,
    }
}
