// Onboard.js requires API keys for some providers. These keys provided below
// Enable the dapp to work out of the box without any custom configs.
// You can choose to specify these env variables if you wish to get analytics
// over user interactions. Otherwise, defaults are used.
import { Network } from '../types'

export const config = (network: Network | null, infuraId: string, onboardApiKey: string) => {
    const infuraRpc = `https://${network ? network?.name : 'mainnet'}.infura.io/v3/${infuraId}`

    return {
        onboardConfig: {
            apiKey: onboardApiKey,
            onboardWalletSelect: {
                wallets: [
                    { walletName: 'metamask', preferred: true },
                    {
                        walletName: 'imToken',
                        rpcUrl: !!network && network.chainId === 1 ? 'https://mainnet-eth.token.im' : 'https://eth-testnet.tokenlon.im',
                        preferred: true,
                    },
                    { walletName: 'coinbase', preferred: true },
                    {
                        walletName: 'walletConnect',
                        rpc: { [network?.chainId || 1]: infuraRpc },
                    },
                    { walletName: 'walletLink', rpcUrl: infuraRpc },
                    { walletName: 'opera' },
                    { walletName: 'operaTouch' },
                    { walletName: 'torus' },
                    { walletName: 'status' },
                    { walletName: 'unilogin' },
                    {
                        walletName: 'ledger',
                        rpcUrl: infuraRpc,
                    },
                ],
            },
            walletCheck: [
                { checkName: 'connect' },
                { checkName: 'accounts' },
                { checkName: 'network' },
                { checkName: 'balance', minimumBalance: '0' },
            ],
        },
    }
}
