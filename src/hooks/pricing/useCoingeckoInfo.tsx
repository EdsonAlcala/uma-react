import { useEffect, useState } from 'react'
import axios from 'axios'

interface Result {
    price: string
    marketCap: string
    totalValueLocked: string
    totalSupply: string
}

const URL =
    'https://api.coingecko.com/api/v3/coins/uma?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false'

export const useCoingeckoInfo = () => {
    const [state, setState] = useState<Result | undefined>(undefined)

    useEffect(() => {
        const getCoingeckoInfo = async () => {
            try {
                const result = await axios.get(URL)

                const marketData = result.data.market_data
                const totalValueLocked = Number(marketData.total_value_locked['usd']).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                })
                const marketCap = Number(marketData.market_cap['usd']).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                })
                const totalSupply = Number(marketData.total_supply).toLocaleString('en-US')

                const currentPrice = Number(marketData.current_price['usd']).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                })

                setState({
                    totalSupply,
                    totalValueLocked,
                    price: currentPrice,
                    marketCap,
                })
            } catch (error) {
                // TODO
            }
        }

        getCoingeckoInfo()
    }, [])

    return state
}
