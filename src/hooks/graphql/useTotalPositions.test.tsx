/**
 * @jest-environment node
 */
import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { MockedProvider } from '@apollo/client/testing'

import { ALL_POSITIONS, useTotalPositions } from './useTotalPositions'

const mocks = [
    {
        request: {
            query: ALL_POSITIONS,
        },
        result: {
            data: {
                financialContracts: [
                    {
                        id: '0xb1a3e5a8d642534840bfc50c6417f9566e716cc7',
                        positions: [
                            {
                                collateral: "7.5",
                                collateralToken: {
                                    decimals: 18,
                                    id: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
                                    name: "Uniswap"
                                },
                                id: "0xe14d5843449caf4773165ca7e1d406a015dd6a0c-0xdd0ace85fcdc46d6430c7f24d56a0a80277ad8d2"
                            }
                        ]
                    }
                ]
            },
        },
    }
]

describe('useTotalPositions tests', () => {
    const render = () => {
        const wrapper = ({ children }: any) => (
            <MockedProvider mocks={mocks} addTypename={false}>
                {children}
            </MockedProvider>
        )
        const result = renderHook(() => useTotalPositions(), { wrapper })
        return result
    }

    test('useTotalPositions', async () => {
        const { result, waitForNextUpdate } = render()

        await waitForNextUpdate()

        expect(result.current.positionsData.total).toEqual(1)
    })
})
