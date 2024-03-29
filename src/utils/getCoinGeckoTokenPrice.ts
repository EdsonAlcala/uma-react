// Simplest possible way to get the current UMA token price to calculate equivalent APR.
// TODO: Incorporate this into the `getOffchainPrice` util module.

// so this can be tested outside browser
import axios from 'axios'

export async function getUmaPrice() {
    const query = 'https://api.coingecko.com/api/v3/simple/price?ids=uma&vs_currencies=usd'

    const response = await axios.get(query, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })

    const priceResponse = await response.data
    return priceResponse.uma.usd
}

export async function getRenPrice() {
    const query = 'https://api.coingecko.com/api/v3/simple/price?ids=republic-protocol&vs_currencies=usd'

    const response = await axios.get(query, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })

    const priceResponse = await response.data
    return priceResponse['republic-protocol'].usd
}

export async function getSimplePrice(fromCurrency: string, toCurrency = 'usd') {
    const query = `https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency}&vs_currencies=${toCurrency}`
    const response = await axios.get(query, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
    const priceResponse = await response.data
    return priceResponse[fromCurrency][toCurrency]
}

export async function getContractInfo(address: string) {
    const query = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`
    const response = await axios.get(query, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
    const result = await response.data
    if (result.error) throw new Error(result.error)
    return result
}
// Returns price or undefined if not found. Wish there was a better way to do this to get instant price.
export async function getSimplePriceByContract(address: string, toCurrency = 'usd') {
    const result = await getContractInfo(address)
    return result && result.market_data && result.market_data.current_price[toCurrency]
}
