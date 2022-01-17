import { useNavigate } from "remix";
import Modal from "~/components/Modal";

interface IDetailsModalProps {
  accounts: any;
  onClose: any;
}

export default function DetailsModal(props: IDetailsModalProps) {
  return (
    <Modal title="Signed By" onClose={props.onClose}>
      <div className="flex flex-col">
        <h2 className="mt-4 mb-1">Contract Address:</h2>
        <p className="font-mono text-sm text-gray-500">{props.address}</p>
        <ul className="py-4">
          {props.accounts.map((account: any) => (
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
          onClick={props.onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
