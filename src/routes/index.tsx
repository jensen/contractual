import type { LoaderFunction } from "remix";
import { useLoaderData, json, Link } from "remix";
import { supabase } from "~/util/auth";
import useRedirectOnLogin from "~/hooks/useRedirectOnLogin";
import { useSupabaseUser } from "~/context/supabase";

type IndexData = {};

export let loader: LoaderFunction = async ({ request }) => {
  const db = await supabase(request);

  const { data, error } = await db.from("contracts").select();

  return json({ contracts: data });
};

interface IIndexViewProps {
  contracts: any[];
}

const View = (props: IIndexViewProps) => {
  const user = useSupabaseUser();

  useRedirectOnLogin();

  return (
    <>
      {user && (
        <Link
          to="/contracts/new"
          className="block w-fit mb-2 px-4 py-2 bg-green-400 text-white rounded-md"
        >
          Create Contract
        </Link>
      )}
      <ul>
        {props.contracts.map((contract) => (
          <Link key={contract.id} to={`/contracts/${contract.id}`}>
            <li className="font-light text-2xl mb-2 pb-2 border-b">
              {contract.name}{" "}
            </li>
          </Link>
        ))}
      </ul>
    </>
  );
};

export default function Index() {
  let data = useLoaderData<IndexData>();

  return <View contracts={data.contracts} />;
}
