import { KOVAN_NETWORK, MAINNET_NETWORK } from '../constants'
import { kovanCollaterals } from './kovanCollaterals'
import { mainnetCollaterals } from './mainnetCollaterals'

export const getTestCollaterals = () => {
    if (process.env.FORK_MODE === KOVAN_NETWORK) {
        return kovanCollaterals
    } else if (process.env.FORK_MODE === MAINNET_NETWORK) {
        return mainnetCollaterals
    } else {
        throw new Error('Not fork mode specified')
    }
}
