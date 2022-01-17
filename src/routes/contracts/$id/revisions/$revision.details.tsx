import { LoaderFunction, useLoaderData, useNavigate, json } from "remix";
import Modal from "~/components/Modal";
import cx from "classnames";
import { supabase } from "~/util/auth";
import { getContract } from "~/util/agreement.server";
import { getAccountPath } from "ethers/lib/utils";

export const loader: LoaderFunction = async ({ request, params }) => {
  const db = await supabase(request);

  const { data } = await db
    .from("revisions")
    .select("*, editor:editor_id(*)")
    .eq("contract_id", params.id)
    .order("created_at", { ascending: false });

  if (!data) {
    throw new Error("Revisions not found");
  }

  const revision = data[data.length - Number(params.revision) - 1];

  const contract = getContract(revision.chain_address);
  const signees = (await contract.getSignees()).map((signee) =>
    signee.toLowerCase()
  );

  const { data: accounts } = await db.rpc("get_signee_accounts", {
    addresses: signees,
  });

  return json({
    revision,
    accounts,
  });
};

interface IViewProps {
  revision: any;
  accounts: any[];
}

const View = (props: IViewProps) => {
  const navigate = useNavigate();

  return (
    <Modal title="Signed By">
      <div className="flex flex-col">
        <ul className="py-4">
          {props.accounts.map((account) => (
            <li key={account.address} className="flex space-x-2">
              <img src={account.avatar} className="w-8 h-8 rounded-full" />
              <div>
                <p className="font-bold">{account.name}</p>
                <p className="font-mono text-xs text-slate-600">
                  {/* {`${account.address.slice(0, 16)}...${account.address.slice(
                    38
                  )}`} */}
                  {account.address}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 w-full flex flex-end space-x-4 ">
        <button
          type="button"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          onClick={() => navigate("./..")}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default function ContractDetails() {
  let data = useLoaderData();

  return <View revision={data.revision} accounts={data.accounts} />;
}
