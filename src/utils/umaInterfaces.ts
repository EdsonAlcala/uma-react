import { ethers } from "ethers";

import ExpiringMultiPartyCreatorArtifact from '@uma/core/build/contracts/ExpiringMultiPartyCreator.json'
import ERC20Artifact from '@uma/core/build/contracts/ERC20.json'
import ExpiringMultiPartyArtifact from '@uma/core/build/contracts/ExpiringMultiParty.json'

import { UMAContractName } from "../types";

export const getUMAInterfaces = () => {
    const interfaces = new Map<UMAContractName, ethers.utils.Interface>();
    interfaces.set('ERC20', new ethers.utils.Interface(ERC20Artifact.abi as any))
    interfaces.set('ExpiringMultiParty', new ethers.utils.Interface(ExpiringMultiPartyArtifact.abi as any))
    interfaces.set("ExpiringMultiPartyCreator", new ethers.utils.Interface(
        ExpiringMultiPartyCreatorArtifact.abi as any))

    return interfaces;
};
