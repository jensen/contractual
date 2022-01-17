import Modal from "~/components/Modal";

interface IDeploymentModalProps {
  accounts: any;
  onClose: any;
}

export default function DeploymentModal(props: IDeploymentModalProps) {
  return (
    <Modal title="Signed By" onClose={props.onClose}>
      <div className="flex flex-col"></div>
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
