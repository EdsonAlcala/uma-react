import { BigNumber } from "ethers"
import { useEffect, useState } from "react"
import { fromWei } from "../utils"

import { useEMPProvider } from "./useEMPProvider"

interface DisputeParams {
  // liquidationBond: BigNumber // TODO Requires final fee
  disputeBondPercentage: BigNumber
  disputerDisputeRewardPercentage: BigNumber
  sponsorDisputeRewardPercentage: BigNumber
  withdrawalLiveness: BigNumber
  liquidationLiveness: BigNumber
  // liquidationBondFormatted: number // TODO Requires final fee
  // disputeBondPercentageFormatted: number // TODO Requires final fee
  disputerDisputeRewardPercentageFormatted: string
  sponsorDisputeRewardPercentageFormatted: string
  withdrawalLivenessInMinutes: string
  liquidationLivenessInMinutes: string
}

export const useDisputeParams = (): DisputeParams | undefined => {
  const { empState } = useEMPProvider()

  const [disputeParams, setDisputeParams] = useState<DisputeParams | undefined>(undefined)

  useEffect(() => {
    if (empState) {
      const { liquidationLiveness, withdrawalLiveness, disputeBondPercentage, disputerDisputeRewardPercentage, sponsorDisputeRewardPercentage } = empState

      if (liquidationLiveness && withdrawalLiveness) {
        const withdrawalLivenessInMinutes = (Number(withdrawalLiveness) / 60).toFixed(2)
        const liquidationLivenessInMinutes = (Number(liquidationLiveness) / 60).toFixed(2)

        const disputerDisputeRewardPercentageFormatted = disputerDisputeRewardPercentage ?
          `${parseFloat(fromWei(disputerDisputeRewardPercentage)) * 100}%`
          : "N/A"

        const sponsorDisputeRewardPercentageFormatted = sponsorDisputeRewardPercentage ?
          `${parseFloat(fromWei(sponsorDisputeRewardPercentage)) * 100}%`
          : "N/A"

        setDisputeParams({
          liquidationLiveness,
          withdrawalLiveness,
          disputeBondPercentage,
          disputerDisputeRewardPercentage,
          sponsorDisputeRewardPercentage,
          disputerDisputeRewardPercentageFormatted,
          sponsorDisputeRewardPercentageFormatted,
          liquidationLivenessInMinutes,
          withdrawalLivenessInMinutes
        })
      } else {
        setDisputeParams(undefined)
      }
    }
  }, [empState])

  return disputeParams
}
