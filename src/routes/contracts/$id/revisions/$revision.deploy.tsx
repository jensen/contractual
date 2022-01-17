import { ethers } from "ethers";
import type { ActionFunction } from "remix";
import { redirect } from "remix";
import { deployContract } from "~/util/agreement.server";
import { supabase } from "~/util/auth";

export let action: ActionFunction = async ({ request, params }) => {
  const db = await supabase(request);
  const body = await request.formData();

  const { data } = await db
    .from("revisions")
    .select("id, content, hash")
    .eq("contract_id", params.id)
    .order("created_at", { ascending: false });

  if (!data) {
    throw new Error("Must have revisions to deploy a contract.");
  }

  const { id, content, hash } = data[data.length - Number(params.revision) - 1];
  const hashed = ethers.utils.sha256(ethers.utils.toUtf8Bytes(content));

  if (hashed.toLowerCase() !== hash.toLowerCase()) {
    throw new Error("Stored has does not match generated hash.");
  }

  const contract = await deployContract(body.get("creator") as string, hashed);

  await db
    .from("revisions")
    .update({ chain_address: contract.address.toLowerCase() })
    .eq("id", id);

  return redirect(`/revisions/${id}/deploying`);
};
