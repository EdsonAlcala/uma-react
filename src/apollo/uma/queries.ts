import { gql } from "@apollo/client";

export const ALL_EMPS = gql`
  query allEMPs {
    financialContracts(first: 1000, orderBy: deploymentTimestamp, orderDirection: desc) {
      id
    }
  }
`

export const ALL_POSITIONS = gql`
  query allPositions{
    financialContracts(orderBy: deploymentTimestamp, orderDirection: desc) {
      id
      positions {
        id
        sponsor {
          id
        }
        collateralToken {
          id
          name
          decimals
          address
        }
        syntheticToken {
          address
          name
          decimals
          id
        }
      tokensOutstanding
      rawCollateral
      }
    }
  }
`

export const ALL_POSITIONS_BY_EMP = gql`
query allPositionsByEMP{
  financialContracts(orderBy: deploymentTimestamp, orderDirection: desc, where: { id: "TODO" }) {
    id
    positions {
      id
      sponsor {
        id
      }
      collateralToken {
        id
        name
        decimals
        address
      }
      syntheticToken {
        address
        name
        decimals
        id
      }
		tokensOutstanding
    rawCollateral
    }
  }
}
`

export const EMP_DATA = gql`
  query activePositions {
    financialContracts {
      id
      positions(first: 1000, where: { collateral_gt: 0 }) {
        collateral
        isEnded
        tokensOutstanding
        withdrawalRequestPassTimestamp
        withdrawalRequestAmount
        transferPositionRequestPassTimestamp
        sponsor {
          id
        }
      }
      liquidations(first: 1000) {
        id
        sponsor {
          id
        }
        liquidationId
        liquidator {
          address
        }
        disputer {
          address
        }
        tokensLiquidated
        lockedCollateral
        liquidatedCollateral
        status
        events {
          __typename
          timestamp
          tx_hash
        }
      }
    }
  }
`;

// QUERY to get OVerview
// {
// 	financialContracts(where:{ id:"0xdb2e7f6655de37822c3020a8988351cc76cadad5"}){
//     id
//     address
//     collateralToken {
//       id
//       name
//       decimals
//       symbol
//     }
//     syntheticToken {
//       id 
//       name
//       decimals
//       symbol
//     }
//     collateralRequirement
//     expirationTimestamp
//     totalTokensOutstanding
//     rawTotalPositionCollateral
//     globalCollateralizationRatio
//   }
// }


// EMP

// {
//   financialContracts {
//     id
//     positions(first: 1000, where: {collateral_gt: 0}) {
//       collateral
//       isEnded
//       tokensOutstanding
//       withdrawalRequestPassTimestamp
//       withdrawalRequestAmount
//       transferPositionRequestPassTimestamp
//       sponsor {
//         id
//       }
//     }
//   }
// }
