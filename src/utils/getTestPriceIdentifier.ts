import { KOVAN_NETWORK, KOVAN_PRICE_IDENTIFIER, MAINNET_NETWORK, MAINNET_PRICE_IDENTIFIER } from '../constants'

export const getTestPriceIdentifier = (): string => {
    if (process.env.FORK_MODE === KOVAN_NETWORK) {
        return KOVAN_PRICE_IDENTIFIER
    } else if (process.env.FORK_MODE === MAINNET_NETWORK) {
        return MAINNET_PRICE_IDENTIFIER
    } else {
        throw new Error('Not fork mode specified')
    }
}
