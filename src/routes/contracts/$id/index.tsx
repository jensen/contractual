import { LoaderFunction, redirect } from "remix";
import { supabase } from "~/util/auth";

export const loader: LoaderFunction = async ({ request, params }) => {
  const db = await supabase(request);

  const { data, error } = await db
    .from("revisions")
    .select("*")
    .eq("contract_id", params.id);

  return redirect(`/contracts/${params.id}/${data.length - 1}`);
};
