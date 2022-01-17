import { useRef, useContext, createContext } from "react";
import { ethers } from "ethers";

import { abi } from "../../chain/artifacts/contracts/Agreement.sol/Agreement.json";

const AgreementContext = createContext<{
  retrieve: (address: string) => ethers.Contract | undefined;
  sign: (address: string, hashed: string) => undefined;
}>({
  retrieve: (address: string) => undefined,
  sign: (address: string, hashed: string) => undefined,
});

interface IAgreementProps {
  children: React.ReactNode;
}

export default function AgreementProvider(props: IAgreementProps) {
  const cache = useRef<{ [key: string]: ethers.Contract }>({});

  const retrieve = (address: string) => {
    if (!address) {
      throw new Error("Must provide contract address");
    }

    const ethereum = (window as WindowWithEthereum).ethereum;

    if (ethereum) {
      if (cache.current[address]) return cache.current[address];

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(address, abi, signer);

      if (!contract) {
        return undefined;
      }

      cache.current[address] = contract;

      return contract;
    }
  };

  const sign = async (address: string, hashed: string) => {
    if (!address) {
      throw new Error("Must provide contract address");
    }

    const ethereum = (window as WindowWithEthereum).ethereum;

    if (ethereum) {
      const contract = retrieve(address);

      if (contract) {
        const signTransaction = await contract.sign(hashed);

        await signTransaction.wait();
      }
    }
  };

  return (
    <AgreementContext.Provider value={{ retrieve, sign }}>
      {props.children}
    </AgreementContext.Provider>
  );
}

export const useAgreement = () => {
  return useContext(AgreementContext);
};
