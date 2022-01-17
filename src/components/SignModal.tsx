import { useNavigate } from "remix";
import { useState } from "react";
import { useAgreement } from "~/context/agreement";
import { useWallet } from "~/context/wallet";
import { ethers } from "ethers";
import cx from "classnames";
import Modal from "~/components/Modal";
import { Spinner } from "~/components/common/Loading";

const DiffedHash = (props) => {
  return props.left.split("").map((character, index: number) => (
    <span
      key={index}
      className={cx("text-gray-900", {
        "bg-green-400": character === props.right[index],
        "bg-red-400": character !== props.right[index],
      })}
    >
      {character}
    </span>
  ));
};

interface ISignModalProps {
  revision: any;
}

export default function SignModal(props: ISignModalProps) {
  const { account } = useWallet();
  const { sign } = useAgreement();
  const navigate = useNavigate();
  const [signing, setSigning] = useState(false);

  const onSign = async (hashed: string) => {
    setSigning(true);
    await sign(props.revision.chain_address, hashed);
    navigate("./..");
  };

  const calculatedHash = ethers.utils.sha256(
    ethers.utils.toUtf8Bytes(props.revision.content)
  );
  const hashesMatch = props.revision.hash === calculatedHash;

  return (
    <Modal title="Sign Agreement" onClose={signing ? () => null : undefined}>
      <div className="flex flex-col">
        <h2 className="mt-4 mb-1">Connected Account:</h2>
        <p className="font-mono text-sm text-gray-500">{account}</p>
        <h2 className="mt-4 mb-1">Contract Address:</h2>
        <p className="font-mono text-sm text-gray-500">
          {props.revision.chain_address}
        </p>
        <h2 className="mt-4 mb-1">Hashed Content:</h2>
        <p className="font-mono text-sm text-gray-500">
          <DiffedHash left={props.revision.hash} right={calculatedHash} />
        </p>

        {hashesMatch ? (
          <>
            <p className="mt-6 text-sm text-gray-900">
              Hashes match, would you like to sign with the connected wallet?
            </p>
          </>
        ) : (
          <>
            <h2 className="mt-4 mb-1">Stored Hash:</h2>
            <p className="font-mono text-sm text-gray-500">
              {props.revision.hash}
            </p>
            <h2 className="mt-4 mb-1">Calculated Hash:</h2>
            <p className="font-mono text-sm text-gray-500">{calculatedHash}</p>
            <p className="mt-6 text-sm text-gray-900">
              The stored has does not match the calculated hash.
            </p>
          </>
        )}
      </div>
      <div className="mt-4 w-full flex flex-end space-x-4 ">
        <button
          type="button"
          disabled={signing}
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          onClick={() => navigate("./..")}
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={hashesMatch === false || signing}
          className={cx(
            "inline-flex justify-center px-4 py-2 text-sm font-medium border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 space-x-2",
            {
              "text-green-800 bg-green-100 hover:bg-green-200 focus-visible:ring-green-500":
                hashesMatch,

              "text-red-800 bg-red-100 hover:bg-red-200 focus-visible:ring-red-500 opacity-50":
                hashesMatch === false,
            }
          )}
          onClick={() => onSign(calculatedHash)}
        >
          {signing && <Spinner show />}
          <span>Sign</span>
        </button>
      </div>
    </Modal>
  );
}
