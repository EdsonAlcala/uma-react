import { ContractReceipt, ethers } from "ethers";
import { useState } from "react";
import { EthereumAddress } from "../types";

interface ITransactionSender {

}

// WIP
// abstract setMaxAllowance, emp methods in a hook and include`error`, `loading` and `success` and `hash`

export const useTransactionSender = () => {
    const [hash, setHash] = useState<string | undefined>(undefined);
    const [error, setError] = useState<Error | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false)

    const setMaxAllowance = async (instance: ethers.Contract, empAddress: EthereumAddress): Promise<ContractReceipt> => {
        const receipt = await instance.approve(empAddress, ethers.constants.MaxUint256)
        await receipt.wait()
        return receipt
    }
}
