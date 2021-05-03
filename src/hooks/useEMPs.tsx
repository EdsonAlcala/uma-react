import React, { useEffect, useState } from 'react'
import { gql, useQuery } from "@apollo/client";
import { EthereumAddress } from '../types';


export const ALL_EMPS = gql`
  query allEMPs {
    financialContracts(first: 1000, orderBy: deploymentTimestamp, orderDirection: desc) {
      id
    }
  }
`

interface EMPsData {
  emps: EthereumAddress[]
}

export const useEMPs = () => {
  const [emps, setEMPs] = useState([])
  const { loading, error, data } = useQuery(ALL_EMPS, {
    onCompleted: (data) => {
      console.log("Data", data)
      setEMPs(data)
    }
  });

  // useEffect(() => {

  // }, [])
  console.log("ASD")

  return (
    <h1>{data}</h1>
  )
}