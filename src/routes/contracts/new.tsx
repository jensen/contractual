import { ActionFunction, LoaderFunction, redirect } from "remix";
import { useLoaderData, json } from "remix";
import { supabase } from "~/util/auth";
import ContractInput from "~/components/ContractInput";

export let action: ActionFunction = async ({ request }) => {
  const db = await supabase(request);
  const body = await request.formData();

  const { data: contract } = await db
    .from("contracts")
    .insert({
      name: body.get("name") as string,
    })
    .single();

  const { data, error } = await db
    .from("revisions")
    .insert({
      content: body.get("content") as string,
      contract_id: contract.id,
    })
    .single();

  return redirect(`/contracts/${contract.id}`);
};

type IndexData = {};

export let loader: LoaderFunction = () => {
  return json({});
};

interface IIndexViewProps {}

const View = (props: IIndexViewProps) => {
  return (
    <form className="h-full flex flex-col" method="post">
      <header className="py-2">
        <input
          className="p-2 w-full text-2xl border-b border-gray-900/5 focus:outline-none"
          placeholder="Contract Title"
          name="name"
        />
      </header>
      <ContractInput />
      <footer className="py-4 flex justify-end">
        <button className="rounded-md px-4 p-2 bg-discord text-white">
          Create
        </button>
      </footer>
    </form>
  );
};

export default function CreateContract() {
  let data = useLoaderData<IndexData>();

  return <View />;
}
