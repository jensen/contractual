import { BytesLike, ethers } from "ethers";

import {
  abi,
  bytecode,
} from "../../chain/artifacts/contracts/Agreement.sol/Agreement.json";

export const getContract = (address: string) => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.POLYGON_URL
  );

  return new ethers.Contract(
    address,
    abi,
    new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY as BytesLike, provider)
  );
};

export const deployContract = async (creator: string, hashed: string) => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.POLYGON_URL
  );
  const signer = new ethers.Wallet(
    process.env.SIGNER_PRIVATE_KEY as BytesLike,
    provider
  );

  const factory = new ethers.ContractFactory(abi, bytecode, signer);

  return await factory.deploy(creator, hashed);
};
