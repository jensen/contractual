import type { LoaderFunction } from "remix";
import { json } from "remix";
import { getContract } from "~/util/agreement.server";

export let loader: LoaderFunction = async ({ request, params }) => {
  const contract = getContract(params.hash);

  try {
    await contract.deployed();
    return json({
      deployed: true,
    });
  } catch (error) {
    return json({
      deployed: false,
    });
  }
};
