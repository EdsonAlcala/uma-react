import { useEffect, useState } from "react"

import { TotalsData } from "../types"
import { weiToNum } from "../utils"

import { useEMPProvider } from "./useEMPProvider"

export const useTotals = (): TotalsData | undefined => {
  const { empState, collateralState, syntheticState } = useEMPProvider()
  const [totalState, setTotalState] = useState<TotalsData | undefined>(undefined)

  useEffect(() => {
    if (empState && collateralState && syntheticState) {
      const { cumulativeFeeMultiplier, rawTotalPositionCollateral, totalTokensOutstanding } = empState
      const { decimals: collateralDecimals } = collateralState
      const { decimals: syntheticDecimals } = syntheticState

      if (cumulativeFeeMultiplier && totalTokensOutstanding && rawTotalPositionCollateral) {
        const newTotalCollateral =
          weiToNum(cumulativeFeeMultiplier) * weiToNum(rawTotalPositionCollateral, collateralDecimals)
        const newTotalTokens = weiToNum(totalTokensOutstanding, syntheticDecimals)
        const newGcr = newTotalTokens > 0 ? newTotalCollateral / newTotalTokens : 0
        setTotalState({
          gcr: `${newGcr}`,
          totalCollateral: `${newTotalCollateral}`,
          totalSyntheticTokens: `${newTotalTokens}`,
        })
      }
    }
  }, [empState, collateralState, syntheticState])

  return totalState
}
