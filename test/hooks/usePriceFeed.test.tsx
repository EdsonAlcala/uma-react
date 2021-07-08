import { renderHook } from '@testing-library/react-hooks'

import { usePriceFeed, YIELD_DOLLAR_UMA } from '../../src'

describe.skip('usePriceFeed tests', () => {
    const render = () => {
        const newToken = {
            id: '0x000',
            name: YIELD_DOLLAR_UMA,
            decimals: 18,
            symbol: YIELD_DOLLAR_UMA,
        }
        const result = renderHook(() => usePriceFeed(newToken))
        return result
    }

    test('get price correctly', async () => {
        const { result, waitForNextUpdate } = render()

        await waitForNextUpdate()

        expect(result.current).toBeDefined()
    })
})
