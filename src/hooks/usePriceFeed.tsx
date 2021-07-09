import { useState, useEffect } from 'react'
import axios from 'axios'
import { getOffchainPriceFromTokenSymbol } from '../utils/getOffchainPrice'

import { Token, TokenData } from '../types'
import { useConfigProvider } from './useConfig'
import { fromWei, toChecksumAddress } from 'web3-utils'
import { NON_PRICE } from '../constants'

export const usePriceFeed = (token?: Token | TokenData, empAddress?: string) => {
    const [latestPrice, setLatestPrice] = useState<number | null>(null)
    const { umaAPIBaseUrl: UMA_API_URL } = useConfigProvider()

    const queryPriceByToken = async () => {
        if (token) {
            try {
                // try first from UMA
                // const price = await axios.post(`${UMA_API_URL}/latestPriceByTokenAddress`, [toChecksumAddress(token.id)])
                // const priceParsed = Number(fromWei(price.data[1]))
                // setLatestPrice(1 / priceParsed)
                const price = await axios.post(`${UMA_API_URL}/latestCollateralPrice`, [toChecksumAddress(empAddress)])

                setLatestPrice(1 / Number(fromWei(price.data[1])))
            } catch (error) {
                try {
                    const symbol = token.symbol
                    const query = await getOffchainPriceFromTokenSymbol(symbol)
                    if (query === null) {
                        setLatestPrice(NON_PRICE)
                    } else {
                        setLatestPrice(query)
                    }
                } catch (error) {
                    console.log('Error getting price for', token.symbol, token.id)
                    setLatestPrice(NON_PRICE)
                }
            }
        }
    }

    useEffect(() => {
        if (token && empAddress) {
            queryPriceByToken()
        }
    }, [token, empAddress])

    return {
        latestPrice,
    }
}
