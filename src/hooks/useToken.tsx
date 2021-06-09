import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { EthereumAddress, TokenData } from "../types";
import { fromWei } from "../utils";
import { INFINITY } from "../constants";

import { useWeb3Provider } from "./useWeb3Provider";
import { useERC20At } from "./useERC20At";

export const useToken = (
  empAddress: EthereumAddress,
  address?: EthereumAddress,
  tokenAddress?: EthereumAddress
): TokenData | undefined => {
  // external
  const { block$ } = useWeb3Provider();
  const { instance } = useERC20At(tokenAddress);

  // state
  const [tokenState, setTokenState] =
    useState<TokenData | undefined>(undefined);

  const getBalance = async (
    contractInstance: ethers.Contract,
    addressParam: EthereumAddress
  ) => {
    const balanceRaw = await contractInstance.balanceOf(addressParam);
    return balanceRaw;
  };

  const getAllowance = async (
    contractInstance: ethers.Contract,
    addressParam: EthereumAddress,
    newDecimals: number
  ) => {
    const allowanceRaw = await contractInstance.allowance(
      addressParam,
      empAddress
    );
    const newAllowance = allowanceRaw.eq(ethers.constants.MaxUint256)
      ? INFINITY
      : fromWei(allowanceRaw, newDecimals);

    return newAllowance;
  };

  const getTokenInfo = async (contractInstance: ethers.Contract) => {
    const [newSymbol, newName, newDecimals, newTotalSupply] = await Promise.all(
      [
        contractInstance.symbol(),
        contractInstance.name(),
        contractInstance.decimals(),
        contractInstance.totalSupply(),
      ]
    );

    if (address) {
      const [balanceRaw, newAllowance] = await Promise.all([
        getBalance(contractInstance, address),
        getAllowance(contractInstance, address, newDecimals),
      ]);
      setTokenState({
        id: tokenAddress,
        symbol: newSymbol,
        name: newName,
        decimals: newDecimals,
        totalSupply: newTotalSupply,
        allowance: newAllowance,
        balance: fromWei(balanceRaw, newDecimals),
        balanceBN: balanceRaw,
        // setMaxAllowance,
        instance: contractInstance,
      });
    } else {
      setTokenState({
        id: tokenAddress,
        symbol: newSymbol,
        name: newName,
        decimals: newDecimals,
        totalSupply: newTotalSupply,
        allowance: undefined,
        balance: undefined,
        balanceBN: undefined,
        instance: contractInstance,
      });
    }
  };

  useEffect(() => {
    if (instance) {
      setTokenState(undefined);
      getTokenInfo(instance).catch((error) =>
        console.log("error getting token info", error)
      );
    }
  }, [instance, address]); // eslint-disable-line

  // get collateral info on each new block
  useEffect(() => {
    if (block$ && instance) {
      const sub = block$.subscribe(() =>
        getTokenInfo(instance).catch((error) =>
          console.log("Error getTokenInfo", error)
        )
      );
      return () => sub.unsubscribe();
    }
  }, [block$, instance]); // eslint-disable-line

  return tokenState;
};
