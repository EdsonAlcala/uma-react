export interface IGanacheOptions {
    port?: number
    mnemonic?: string
    db_path?: string
    gasLimit?: string | number
    allowUnlimitedContractSize?: boolean
    fork: string
    network_id: number
    accounts: [
        {
            secretKey: string
            balance: string
        },
    ]
    _chainId: number
    _chainIdRpc: number
    fork_block_number: number | string
    unlocked_accounts: string[]
    vmErrorsOnRPCResponse: boolean
    gasPrice: string
}
