import { ethers, Wallet } from 'ethers'
import erc20 from '@studydefi/money-legos/erc20'
import { ChainId, Token, WETH, Fetcher, Trade, Route, TokenAmount, TradeType, Percent } from '@uniswap/sdk'
import RouterArtifact from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import { toChecksumAddress } from 'web3-utils'
/**
 * @notice Buys 10 ETH worth of UMA on Uniswap for `wallet`.
 * @param wallet ethers.Wallet object to mint DAI to.
 */
export const getUMA = async (wallet: Wallet) => {
    const UMA_ADDRESS = toChecksumAddress('0x04fa0d235c4abf4bcf4787af4cf447de572ef828')
    const UMA_DECIMALS = 18
    // console.log('UMA ADDRESS', UMA_ADDRESS)
    const umaContract = new ethers.Contract(UMA_ADDRESS, erc20.abi, wallet)

    // balances before
    const ethBefore = await wallet.getBalance()
    const umaBefore = await umaContract.balanceOf(wallet.address)
    console.log('ETH balance before', ethers.utils.formatEther(ethBefore), 'ETH')
    console.log('UMA balance before', ethers.utils.formatUnits(umaBefore), 'UMA')

    const UMA = new Token(ChainId.MAINNET, UMA_ADDRESS, UMA_DECIMALS)
    const pair = await Fetcher.fetchPairData(UMA, WETH[UMA.chainId])

    const route = new Route([pair], WETH[UMA.chainId])

    const amountIn = '10000000000000000000' // 10 WETH / ETH (handled by the router)

    const trade = new Trade(route, new TokenAmount(WETH[UMA.chainId], amountIn), TradeType.EXACT_INPUT)
    const slippageTolerance = new Percent('50', '10000') // 50 bips, or 0.50%
    const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw // needs to be converted to e.g. hex
    const path = [WETH[UMA.chainId].address, UMA.address]
    const to = wallet.address // should be a checksummed recipient address
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
    const value = trade.inputAmount.raw // // needs to be converted to e.g. hex

    const amountOutMinHex = ethers.BigNumber.from(amountOutMin.toString()).toHexString()
    const valueHex = ethers.BigNumber.from(value.toString()).toHexString()

    // function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
    // external
    // payable
    // returns (uint[] memory amounts);
    const uniswapContract = new ethers.Contract('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', RouterArtifact.abi, wallet)
    const txReceipt = await uniswapContract.swapExactETHForTokens(amountOutMinHex, path, toChecksumAddress(to), deadline, {
        value: ethers.utils.parseEther('10'),
        gasLimit: 4000000,
    })

    await txReceipt.wait()

    // balances after
    const ethAfter = await wallet.getBalance()
    const umaAfter = await umaContract.balanceOf(wallet.address)
    console.log('ETH balance', ethers.utils.formatEther(ethAfter), 'ETH')
    console.log('UMA balance', ethers.utils.formatUnits(umaAfter), 'UMA')
}
