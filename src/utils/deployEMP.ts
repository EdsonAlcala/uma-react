import { BigNumber, ethers, utils, ContractReceipt } from "ethers";
import { toWei } from "web3-utils";

import { EthereumAddress, Percentage, Timestamp, EMPParameters } from "../types";
import { getUMAAbis } from "./umaAbis";
import { getUMAAddresses } from "./umaAddresses";

export const deployEMP = async (
  values: EMPParameters,
  network: ethers.providers.Network,
  signer: ethers.Signer
) => {
  const {
    expirationTimestamp,
    collateralAddress,
    priceFeedIdentifier,
    syntheticName,
    syntheticSymbol,
    collateralRequirement,
  } = values;

  const {
    disputeBondPercentage,
    sponsorDisputeRewardPercentage,
    disputerDisputeRewardPercentage,
    financialProductLibraryAddress,
  } = values;

  const params = {
    expirationTimestamp: BigNumber.from(expirationTimestamp),
    collateralAddress,
    priceFeedIdentifier: utils.formatBytes32String(priceFeedIdentifier),
    syntheticName,
    syntheticSymbol,
    collateralRequirement: {
      rawValue: toWei(`${collateralRequirement / 100}`),
    },
    disputeBondPercentage: {
      rawValue: toWei(disputeBondPercentage ? `${disputeBondPercentage / 100}` : "0.1"), // 0.1 -> 10 % dispute bond.
    },
    sponsorDisputeRewardPercentage: {
      rawValue: toWei(
        sponsorDisputeRewardPercentage ? `${sponsorDisputeRewardPercentage / 100}` : "0.05"
      ), // 0.05 -> 5% reward for sponsors who are disputed invalidly.
    },
    disputerDisputeRewardPercentage: {
      rawValue: toWei(
        disputerDisputeRewardPercentage ? `${disputerDisputeRewardPercentage / 100}` : "0.2"
      ), // 0.2 -> 20% reward for correct disputes.
    },
    minSponsorTokens: {
      rawValue: toWei(`${values.minSponsorTokens}`),
    },
    liquidationLiveness: BigNumber.from(values.liquidationLiveness),
    withdrawalLiveness: BigNumber.from(values.withdrawalLiveness),
    financialProductLibraryAddress: financialProductLibraryAddress ? financialProductLibraryAddress : "0x0000000000000000000000000000000000000000"
  };

  console.log("Params", params);

  const umaABIs = getUMAAbis();
  const umaAddresses = getUMAAddresses(network.chainId);

  const expiringMultipartyCreatorInterface = umaABIs.get(
    "ExpiringMultiPartyCreator"
  );
  if (!expiringMultipartyCreatorInterface) {
    throw new Error("Invalid ExpiringMultipartyCreator Interface");
  }

  const expiringMultipartyCreatorAddress = umaAddresses.get(
    "ExpiringMultiPartyCreator"
  );
  if (!expiringMultipartyCreatorAddress) {
    throw new Error("Invalid ExpiringMultipartyCreator Address");
  }

  console.log(
    "expiringMultipartyCreatorAddress",
    expiringMultipartyCreatorAddress
  );

  const expiringMultipartyCreator = new ethers.Contract(
    expiringMultipartyCreatorAddress,
    expiringMultipartyCreatorInterface,
    signer
  );

  const expiringMultiPartyAddress = await expiringMultipartyCreator.callStatic.createExpiringMultiParty(
    params
  );
  console.log("expiringMultiPartyAddress", expiringMultiPartyAddress);

  const txn = await expiringMultipartyCreator.createExpiringMultiParty(params);

  const receipt: ContractReceipt = await txn.wait();

  // console.log("Receipt", receipt);

  return { receipt, expiringMultiPartyAddress };
};
