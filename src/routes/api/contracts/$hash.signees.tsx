import type { LoaderFunction } from "remix";
import { json } from "remix";
import { getContract } from "~/util/agreement.server";
import { supabase } from "~/util/auth";

export let loader: LoaderFunction = async ({ request, params }) => {
  const db = await supabase(request);

  const contract = getContract(params.hash);

  const signees = (await contract.getSignees()).map((signee) =>
    signee.toLowerCase()
  );

  const { data: accounts } = await db.rpc("get_signee_accounts", {
    addresses: signees,
  });

  return json({
    signees,
    accounts,
  });
};
