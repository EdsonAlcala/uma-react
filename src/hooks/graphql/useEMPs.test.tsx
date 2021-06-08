/**
 * @jest-environment node
 */
import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { MockedProvider } from '@apollo/client/testing'

import { ALL_EMPS, useEMPs } from './useEMPs'

const mocks = [
    {
        request: {
            query: ALL_EMPS,
        },
        result: {
            data: {
                financialContracts: [
                    {
                        id: '0xb1a3e5a8d642534840bfc50c6417f9566e716cc7',
                        syntheticToken: {
                            symbol: "yUNI 21"
                        }
                    },
                    {
                        id: '0x7fbe19088b011a9de0e3a327d7c681028f065616',
                        syntheticToken: {
                            symbol: "yUNI 21"
                        }
                    }
                ]
            },
        },
    },
]

describe('useEMPs tests', () => {
    const render = () => {
        const wrapper = ({ children }: any) => (
            <MockedProvider mocks={mocks} addTypename={false}>
                {children}
            </MockedProvider>
        )
        const result = renderHook(() => useEMPs(), { wrapper })
        return result
    }

    test('useEMPs', async () => {
        const { result, waitForNextUpdate } = render()

        await waitForNextUpdate()


        expect(result.current.total).toEqual(2)
        expect(result.current.items.length).toEqual(4)
        expect(result.current.allItemsTyped.length).toEqual(2)
    })
})
