import type { LoaderFunction } from "remix";
import { useLoaderData, json, Link } from "remix";
import { supabase } from "~/util/auth";
import useRedirectOnLogin from "~/hooks/useRedirectOnLogin";

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
  useRedirectOnLogin();

  return (
    <ul>
      {props.contracts.map((contract) => (
        <Link to={`/contracts/${contract.id}`}>
          <li className="font-light text-2xl pb-1 border-b">
            {contract.name}{" "}
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default function Index() {
  let data = useLoaderData<IndexData>();

  return <View contracts={data.contracts} />;
}
