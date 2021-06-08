# UMA React

A set of hooks and utilities to create Synthetic web applications with UMA.

### Peer dependencies

- ethers (5.0.31)
- @material-ui/core (4.11.3)
- @material-ui/icons (4.11.2)
- web3-utils (1.3.4)

### Hooks 

<TODO>

### Development

Start local blockchain

- yarn chain

Start Demo app

- yarn start:dev


# Configuration

The SDK uses Onboard.js, which requires the following environment variables:

- NEXT_PUBLIC_ONBOARD_API_KEY
- NEXT_PUBLIC_INFURA_ID
- NEXT_PUBLIC_PORTIS_API_KEY

Other environment variables

- SUPPORTED_NETWORK_IDS=<Array_NETWORK_IDs> (default to [1,42])

For testing:

- FORK_URL=<Alchemy_Url>
- NETWORK_ID=1 | 42
- PRIV_KEY=<Your_Test_Private_Key>
- FORK_MODE=Mainnet | Kovan

