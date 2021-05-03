import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { ApolloProvider } from '@apollo/client'
import { MockedProvider } from '@apollo/client/testing';

import { client } from '../apollo/client'

import { ALL_EMPS, useEMPs } from './useEMPs'

const mocks = [
    {
        request: {
            query: ALL_EMPS
        },
        result: {
            "data": {
                "financialContracts": [
                    {
                        "id": "0xb1a3e5a8d642534840bfc50c6417f9566e716cc7"
                    },
                    {
                        "id": "0x7fbe19088b011a9de0e3a327d7c681028f065616"
                    },
                    {
                        "id": "0x67f4dec415ce95f8e66d63c926605d16f8d1b4e4"
                    },
                    {
                        "id": "0xecfe987d8c103a3ec2041774e4514ed0614fb42c"
                    },
                    {
                        "id": "0x12d21cb3e544de60edb434a43ae7ef0715bee6cc"
                    },
                    {
                        "id": "0x9c9ee67586faf80afe147306fb858af4ec2212a4"
                    },
                    {
                        "id": "0xc9e6c106c65edd67c83cc6e3bcd18bf8d2ebf182"
                    },
                    {
                        "id": "0x32f0405834c4b50be53199628c45603cea3a28aa"
                    },
                    {
                        "id": "0x0759883acf042a54fab083378b0395f773a79767"
                    },
                    {
                        "id": "0x0d1ba751bade6d7bb54cf4f05d2dc0a9f45605e5"
                    },
                    {
                        "id": "0xb2aea0de92acff7e1146333f776db42e5d004128"
                    },
                    {
                        "id": "0x10e018c01792705befb7a757628c2947e38b9426"
                    },
                    {
                        "id": "0x4f8d7bffe8a2428a313b737001311ad302a60df4"
                    },
                    {
                        "id": "0x56babecb3dcac063697fe38ab745c10181c56fa6"
                    },
                    {
                        "id": "0xcef85b352ccd7a446d94aeeea02dd11622289954"
                    },
                    {
                        "id": "0x0ee5bb3deae8a44fbdeb269941f735793f8312ef"
                    },
                    {
                        "id": "0x312ecf2854f73a3ff616e3cdbc05e2ff6a98d1f0"
                    },
                    {
                        "id": "0x0f4e2a456aafc0068a0718e3107b88d2e8f2bfef"
                    },
                    {
                        "id": "0xd9af2d7e4cf86aafbcf688a47bd6b95da9f7c838"
                    },
                    {
                        "id": "0x885c5fcb4d3b574a39f6750f962a3b52600ad728"
                    },
                    {
                        "id": "0x8f92465991e1111f012f24a55ae2b0742f82dd7b"
                    },
                    {
                        "id": "0x46f5e363e69798a74c8422bfb9edb63e3fb0f08a"
                    },
                    {
                        "id": "0xb40ba94747c59d076b3c189e3a031547492013da"
                    },
                    {
                        "id": "0xfdf90c4104c1de34979235e6ae080528266a14a3"
                    },
                    {
                        "id": "0x52f83aca94904b3590669e3525d25ec75cdff798"
                    },
                    {
                        "id": "0x45788a369f3083c02b942aea02dba25c466a773f"
                    },
                    {
                        "id": "0x02bd62088a02668f29102b06e4925791cd0fe4c5"
                    },
                    {
                        "id": "0xdf68acf496db55f4a882a0371c489d739173fbec"
                    },
                    {
                        "id": "0xb82756f9853a148a2390a08aad30babcdc22f068"
                    },
                    {
                        "id": "0x6da66c15823cff681dad6963fbd325a520362958"
                    },
                    {
                        "id": "0xdb2e7f6655de37822c3020a8988351cc76cadad5"
                    },
                    {
                        "id": "0x144a3290c9db859939f085e3ec9a5c321fc713af"
                    },
                    {
                        "id": "0x8e51ad4eeb19693751a9a3e36b8f098d891ddc7f"
                    },
                    {
                        "id": "0xd60139b287de1408f8388f5f57fc114fb4b03328"
                    },
                    {
                        "id": "0xa24ba528be99024f7f7c227b55cbb265ecf0c078"
                    },
                    {
                        "id": "0x1066e9d2e372d01a0f57bb6f231d34ce4ced228e"
                    },
                    {
                        "id": "0x14a415dd90b63c791c5dc544594605c8bc13bc8d"
                    },
                    {
                        "id": "0x161fa1ac2d93832c3f77c8b5879cb4dc56d958a7"
                    },
                    {
                        "id": "0x0388f65c185a7e7d857bb142185381d97a4bc747"
                    },
                    {
                        "id": "0x9bb1f39b6db45bd087046385a43eab7b60c52e7d"
                    },
                    {
                        "id": "0x964be01cce200e168c4ba960a764cbeba8c01200"
                    },
                    {
                        "id": "0x6618ff5a7dcea49f1aada3bafde3e87fe28d1303"
                    },
                    {
                        "id": "0x4e8d60a785c2636a63c5bd47c7050d21266c8b43"
                    },
                    {
                        "id": "0x384e239a2b225865558774b005c3d6ec29f8ce70"
                    },
                    {
                        "id": "0x9e929a85282fb0555c19ed70942b952827ca4b0b"
                    },
                    {
                        "id": "0xdf739f0219fa1a9288fc4c790304c8a3e928544c"
                    },
                    {
                        "id": "0xf796059731942ab6317e1bd5a8e98ef1f6d345b1"
                    },
                    {
                        "id": "0xcdf99b9ace35e6414d802e97ed75ecfee99a6f62"
                    },
                    {
                        "id": "0x4e2697b3deec9cac270be97e254ec1a791588770"
                    },
                    {
                        "id": "0xb33e3b8f5a172776730b0945206d6f75a2491307"
                    },
                    {
                        "id": "0x4f1424cef6ace40c0ae4fc64d74b734f1eaf153c"
                    },
                    {
                        "id": "0x5a7f8f8b0e912bbf8525bc3fb2ae46e70db9516b"
                    },
                    {
                        "id": "0x14a046c066266da6b8b8c4d2de4afbeecd53a262"
                    },
                    {
                        "id": "0xd50fbace72352c2e15e0986b8ad2599627b5c340"
                    },
                    {
                        "id": "0xab3aa2768ba6c5876b2552a6f9b70e54aa256175"
                    },
                    {
                        "id": "0xad3cceebeffcdc3576de56811d0a6d164bf9a5a1"
                    },
                    {
                        "id": "0x7c4090170aeadd54b1a0dbac2c8d08719220a435"
                    },
                    {
                        "id": "0x94c7cab26c04b76d9ab6277a0960781b90f74294"
                    },
                    {
                        "id": "0x2862a798b3defc1c24b9c0d241beaf044c45e585"
                    },
                    {
                        "id": "0xd81028a6fbaaaf604316f330b20d24bfbfd14478"
                    },
                    {
                        "id": "0x267d46e71764abaa5a0dd45260f95d9c8d5b8195"
                    },
                    {
                        "id": "0xeaddb6ad65dca45ac3bb32f88324897270da0387"
                    },
                    {
                        "id": "0xf215778f3a5e7ab6a832e71d87267dd9a9ab0037"
                    },
                    {
                        "id": "0xda0943251079eb9f517668fdb372fc6ae299d898"
                    },
                    {
                        "id": "0xd6fc1a7327210b7fe33ef2514b44979719424a1d"
                    },
                    {
                        "id": "0x45c4dbd73294c5d8ddf6e5f949be4c505e6e9495"
                    },
                    {
                        "id": "0xa1005db6516a097e562ad7506cf90ebb511f5604"
                    },
                    {
                        "id": "0xca44d9e1eb0b27a0b56cdbebf4198de5c2e6f7d0"
                    },
                    {
                        "id": "0xfa3aa7ee08399a4ce0b4921c85ab7d645ccac669"
                    },
                    {
                        "id": "0x2e918f0f18a69cfda3333c146a81e8100c85d8b0"
                    },
                    {
                        "id": "0xeaa081a9fad4607cdf046fea7d4bf3dfef533282"
                    },
                    {
                        "id": "0x1c3f1a342c8d9591d9759220d114c685fd1cf6b8"
                    },
                    {
                        "id": "0xe4256c47a3b27a969f25de8bef44eca5f2552bd5"
                    },
                    {
                        "id": "0xecfe06574b4a23a6476ad1f2568166bd1857e7c5"
                    },
                    {
                        "id": "0x4aa79c00240a2094ff3fa6cf7c67f521f32d84a2"
                    },
                    {
                        "id": "0xf32219331a03d99c98adf96d43cc312353003531"
                    },
                    {
                        "id": "0xc843538d70ee5d28c5a80a75bb94c28925bb1cf2"
                    },
                    {
                        "id": "0xefa41f506eaa5c24666d4ee40888ba18fa60a1c7"
                    },
                    {
                        "id": "0x516f595978d87b67401dab7afd8555c3d28a3af4"
                    },
                    {
                        "id": "0x3a93e863cb3adc5910e6cea4d51f132e8666654f"
                    },
                    {
                        "id": "0x1477c532a5054e0879eafbd6004208c2065bc21f"
                    },
                    {
                        "id": "0x306b19502c833c1522fbc36c9dd7531eda35862b"
                    },
                    {
                        "id": "0x3605ec11ba7bd208501cbb24cd890bc58d2dba56"
                    },
                    {
                        "id": "0xabbee9fc7a882499162323eeb7bf6614193312e3"
                    },
                    {
                        "id": "0xc0b19570370478ede5f2e922c5d31faf1d5f90ea"
                    },
                    {
                        "id": "0xe1ee8d4c5dba1c221840c08f6cf42154435b9d52"
                    },
                    {
                        "id": "0x4e3168ea1082f3dda1694646b5eacdeb572009f1"
                    },
                    {
                        "id": "0xb56c5f1fb93b1fbd7c473926c87b6b9c4d0e21d5"
                    },
                    {
                        "id": "0x39450eb4f7de57f2a25eee548ff392532cfb8759"
                    },
                    {
                        "id": "0x67dd35ead67fcd184c8ff6d0251df4241f309ce1"
                    },
                    {
                        "id": "0x3f2d9edd9702909cf1f8c4237b7c4c5931f9c944"
                    }
                ]
            }
        },
    },
];

describe.skip('useEMPs tests', () => {

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

        // await waitForNextUpdate()
        // await waitForNextUpdate()
        // await waitForNextUpdate()

        console.log("Result", result.current)
    })
})