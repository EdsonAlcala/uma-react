import { useState, useEffect } from 'react'
import axios from 'axios'
import { getOffchainPriceFromTokenSymbol } from '../utils/getOffchainPrice'
import { getSimplePriceByContract } from '../utils/getCoinGeckoTokenPrice'

import { Token, TokenData } from '../types'
import { useConfigProvider } from './useConfig'
import { fromWei, toChecksumAddress } from 'web3-utils'

export const usePriceFeed = (token?: Token | TokenData) => {
    const [latestPrice, setLatestPrice] = useState<number | null>(null)
    const { umaAPIBaseUrl: UMA_API_URL } = useConfigProvider()

    const queryPrice = async () => {
        if (token) {
            try {
                // try first from UMA
                const price = await axios.post(`${UMA_API_URL}/latestPriceByTokenAddress`, [toChecksumAddress(token.id)])
                const priceParsed = Number(fromWei(price.data[1]))
                setLatestPrice(priceParsed)
            } catch (error) {
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
    }

    useEffect(() => {
        queryPrice()
    }, [token])

    return {
        latestPrice,
    }
}
