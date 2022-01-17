import { useEffect } from "react";
import type { LoaderFunction } from "remix";
import { useLoaderData, json, useNavigate } from "remix";
import { supabase } from "~/util/auth";
import { Spinner } from "~/components/common/Loading";

export let loader: LoaderFunction = async ({ request, params }) => {
  const db = await supabase(request);

  const { data: revision } = await db
    .from("revisions")
    .select("*")
    .eq("id", params.id)
    .single();

  return json({
    address: revision.chain_address,
    contract: revision.contract_id,
  });
};

interface IViewProps {
  address: string;
  contract: string;
}

const View = (props: IViewProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`/api/contracts/${props.address}/deployed`)
        .then((response) => response.json())
        .then((status) => {
          if (status.deployed) {
            navigate(`/contracts/${props.contract}`);
          }
        });
    }, 2000);

    return () => clearInterval(interval);
  }, [props.address]);

  return (
    <div className="h-full flex justify-center items-center">
      <div className="p-4 bg-discord rounded-lg">
        <h2 className="flex space-x-2 text-xl font-bold uppercase text-white">
          <Spinner show />
          <span>Deploying Contract</span>
        </h2>
        <p className="text-sm text-white my-2">Please wait.</p>
      </div>
    </div>
  );
};

export default function ContractDeploying() {
  let data = useLoaderData();

  return <View address={data.address} contract={data.contract} />;
}
