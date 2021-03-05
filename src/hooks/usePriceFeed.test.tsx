import { renderHook } from '@testing-library/react-hooks'

import { YIELD_DOLLAR_UMA } from '../constants'

import { usePriceFeed } from './usePriceFeed'

describe('usePriceFeed tests', () => {

    const render = () => {
        const result = renderHook(() => usePriceFeed(YIELD_DOLLAR_UMA))
        return result
    }

    test('get price correctly', async () => {
        const { result, waitForNextUpdate } = render()

        await waitForNextUpdate()

        expect(result.current).toBeDefined()
    })
})