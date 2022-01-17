import type { LoaderFunction } from "remix";
import { useLoaderData, json, useParams } from "remix";

import MarkdownPreview from "~/components/MarkdownPreview";
import SignModal from "~/components/SignModal";
import ConnectModal from "~/components/ConnectModal";
import { supabase } from "~/util/auth";

export let loader: LoaderFunction = async ({ request, params }) => {
  const db = await supabase(request);

  const [{ data: contract }, { data: revisions }] = await Promise.all([
    db
      .from("contracts")
      .select("*, creator:creator_id(*)")
      .eq("id", params.id)
      .single(),
    db
      .from("revisions")
      .select("*, editor:editor_id(*)")
      .eq("contract_id", params.id)
      .order("created_at", { ascending: false }),
  ]);

  contract.revisions = revisions;

  return json({ contract });
};

const View = (props) => {
  const { revision } = useParams();

  return (
    <div className="h-full flex flex-col">
      <h2 className="font-bold text-2xl mb-4">{props.contract.name}</h2>
      <section className="h-full w-[96ch] flex">
        <div className="h-full flex flex-col space-y-4">
          <MarkdownPreview
            input={
              props.contract.revisions[
                props.contract.revisions.length - Number(revision) - 1
              ].content
            }
          />
          <SignModal
            revision={
              props.contract.revisions[
                props.contract.revisions.length - Number(revision) - 1
              ]
            }
          />
        </div>
      </section>
    </div>
  );
};

export default function SignContract() {
  let data = useLoaderData();

  return <View contract={data.contract} />;
}
