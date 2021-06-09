import { createContainer } from "unstated-next";
import { useState } from "react";

function useEmpAddress() {
  const [address, setAddress] = useState<string | undefined>(undefined);

  const setEmpAddress = (value: string) => {
    setAddress(value);
  };

  return {
    empAddress: address,
    setEmpAddress,
  };
}

const EmpAddress = createContainer(useEmpAddress);

export default EmpAddress;
