import type { LoaderFunction } from "remix";
import { useLoaderData, json, Link, useParams } from "remix";
import MarkdownPreview from "~/components/MarkdownPreview";
import RevisionList from "~/components/RevisionList";
import { supabase } from "~/util/auth";
import { useSupabaseUser } from "~/context/supabase";

type IndexData = {};

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

interface IViewProps {
  contract: any;
}

const View = (props: IViewProps) => {
  const user = useSupabaseUser();

  const { revision } = useParams();

  return (
    <div className="h-full flex flex-col">
      <h2 className="font-bold text-2xl mb-4">{props.contract.name}</h2>
      <section className="h-full flex">
        <div className="h-full flex flex-col space-y-4">
          <MarkdownPreview
            input={
              props.contract.revisions[
                props.contract.revisions.length - Number(revision) - 1
              ].content
            }
          />
        </div>
        <div className="px-8 flex flex-col space-y-4">
          {user && (
            <Link
              to="edit"
              className="px-4 py-2 bg-discord text-white rounded-md"
            >
              Make Revision
            </Link>
          )}
          <RevisionList
            revision={revision}
            revisions={props.contract.revisions}
          />
        </div>
      </section>
    </div>
  );
};

export default function ViewContract() {
  let data = useLoaderData();

  return <View contract={data.contract} />;
}
