import { ActionFunction, LoaderFunction, redirect } from "remix";
import { useLoaderData, json, Link, useParams } from "remix";
import { supabase } from "~/util/auth";
import ContractInput from "~/components/ContractInput";

export let action: ActionFunction = async ({ request, params }) => {
  const db = await supabase(request);
  const body = await request.formData();

  const { data, error } = await db
    .from("revisions")
    .insert({
      content: body.get("content") as string,
      hash: "abc123",
      contract_id: params.id,
    })
    .single();

  return redirect(`/contracts/${params.id}`);
};

type IndexData = {};

export let loader: LoaderFunction = async ({ request, params }) => {
  const db = await supabase(request);

  const { data, error } = await db
    .from("contracts")
    .select("*, revisions(*), creator:creator_id(*)")
    .eq("id", params.id)
    .single();

  const last = data.revisions.length - 1;

  console.log(last);

  if (Number(params.revision) < last) {
    return redirect(`/contracts/${params.id}/${last}/edit`);
  }

  return json({ contract: data });
};

interface IIndexViewProps {
  contract: any;
}

const View = (props: IIndexViewProps) => {
  const { revision } = useParams();

  return (
    <form className="h-full flex flex-col" method="post">
      <header className="py-2">
        <div className="p-2 w-full text-2xl border-b border-gray-900/5">
          {props.contract.name}
        </div>
      </header>
      <ContractInput
        content={props.contract.revisions[Number(revision)].content}
      />
      <footer className="py-4 flex justify-end space-x-4">
        <Link
          className="rounded-md px-4 p-2 border-2 border-discord text-discord"
          to={`/contracts/${props.contract.id}`}
        >
          Cancel
        </Link>
        <button className="rounded-md px-4 p-2 bg-discord text-white">
          Save
        </button>
      </footer>
    </form>
  );
};

export default function EditContract() {
  let data = useLoaderData<IndexData>();

  return <View contract={data.contract} />;
}
