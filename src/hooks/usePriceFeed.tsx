import { useState, useEffect } from 'react'

import { getOffchainPriceFromTokenSymbol, getPricefeedParamsFromTokenSymbol } from '../utils'

export const usePriceFeed = (tokenSymbol?: string) => {
    const [latestPrice, setLatestPrice] = useState<number | null>(null)
    const [source, setSource] = useState<string[] | undefined>(undefined)

    const queryPrice = async () => {
        setLatestPrice(null)

        if (tokenSymbol) {
            const query = await getOffchainPriceFromTokenSymbol(tokenSymbol)
            setLatestPrice(query)
            setSource(getPricefeedParamsFromTokenSymbol(tokenSymbol)?.source)
        }
    }

    // update price on setting of contract
    useEffect(() => {
        queryPrice()
    }, [tokenSymbol])

    return {
        latestPrice,
        sourceUrls: source,
    }
}
