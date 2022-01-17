import { useNavigate } from "remix";
import { useWallet } from "~/context/wallet";
import Modal from "~/components/Modal";

export default function ConnectModal(props) {
  const { connect } = useWallet();
  const navigate = useNavigate();

  return (
    <Modal onClose={props.onClose} title="Connect Wallet">
      <div className="mt-2">
        <p className="text-sm text-gray-500">
          Download a wallet from{" "}
          <a
            className="text-discord hover:text-slate-800"
            href="https://metamask.io/"
          >
            https://metamask.io/
          </a>
        </p>
      </div>
      <div className="mt-4 flex space-x-4">
        <button
          type="button"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          onClick={() => (props.onClose ? props.onClose() : navigate("./.."))}
        >
          Cancel
        </button>
        <button
          type="button"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          onClick={connect}
        >
          Connect
        </button>
      </div>
    </Modal>
  );
}
