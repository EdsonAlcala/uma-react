require('dotenv').config()

const ethers = require('ethers')

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'ethers',
  testEnvironmentOptions: {
    fork_block_number: 12057129,
    vmErrorsOnRPCResponse: true,
    port: 8549,
    network_id: parseInt(process.env.NETWORK_ID),
    networkId: parseInt(process.env.NETWORK_ID),
    fork: process.env.FORK_URL,
    gasLimit: 200000000000,
    allowUnlimitedContractSize: true,
    _chainId: parseInt(process.env.NETWORK_ID),
    _chainIdRpc: parseInt(process.env.NETWORK_ID),
    gasPrice: '0x2E90EDD000',
    accounts: [
      {
        secretKey: process.env.PRIV_KEY,
        balance: ethers.utils.hexlify(ethers.utils.parseEther('1000')),
      },
    ],
    unlocked_accounts: ['0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D', '0x02c8ef8bf76c4bff3b961ff3c3db665a00fc02b4', '0xddfC7E3B4531158acf4C7a5d2c3cB0eE81d018A5']
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/test/__mocks__/fileMock.ts",
    "\\.(css|less)$": "<rootDir>/test/__mocks__/styleMock.ts"
  }
};