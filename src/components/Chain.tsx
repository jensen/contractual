import { useEffect, useState } from "react";
import { Link, Form, useFetcher, useSubmit, useTransition } from "remix";
import { useWallet } from "~/context/wallet";
import ConnectModal from "./ConnectModal";
import { useSupabaseUser } from "~/context/supabase";
import { Spinner } from "~/components/common/Loading";
import DetailsModal from "~/components/DetailsModal";

interface IChainProps {
  address: string;
  newest: boolean;
}

const classes = {
  greenButton:
    "w-fit h-fit flex justify-center px-4 py-1 bg-green-400 text-white rounded-md hover:bg-green-500",
};

const Details = ({ show }) => (
  <button className={classes.greenButton} onClick={show}>
    Details
  </button>
);

export default function Chain(props: IChainProps) {
  const submit = useSubmit();
  const transition = useTransition();

  const { account } = useWallet();
  const fetcher = useFetcher();
  const user = useSupabaseUser();

  const [showDetails, setShowDetails] = useState(false);

  const [connect, setConnect] = useState(false);

  const handleRequestSignature = (event) =>
    submit(event.currentTarget, { replace: true });

  useEffect(() => {
    if (props.address) {
      fetcher.load(`/api/contracts/${props.address}/signees`);
    }
  }, [props.address]);

  if (
    props.address &&
    ((fetcher.state === "idle" && fetcher.type === "init") ||
      fetcher.state === "loading")
  ) {
    return (
      <div className={classes.greenButton}>
        <Spinner show />
      </div>
    );
  }

  if (fetcher.data?.signees.includes(account)) {
    return showDetails ? (
      <DetailsModal
        accounts={fetcher.data?.accounts}
        onClose={() => setShowDetails(false)}
        address={props.address}
      />
    ) : (
      <Details revision={props.revision} show={() => setShowDetails(true)} />
    );
  }

  if (props.newest === false || user === null) {
    return null;
  }

  if (transition.state === "submitting") {
    return (
      <div className={classes.greenButton}>
        <Spinner show />
        <span className="ml-2">Creating Contract</span>
      </div>
    );
  }

  if (account === undefined) {
    return (
      <>
        {connect ? (
          <ConnectModal onClose={() => setConnect(false)} />
        ) : (
          <button
            className={classes.greenButton}
            onClick={() => setConnect(true)}
          >
            Connect
          </button>
        )}
      </>
    );
  }

  if (props.address) {
    return (
      <>
        {fetcher.data?.signees.length > 0 &&
          (showDetails ? (
            <DetailsModal
              accounts={fetcher.data?.accounts}
              onClose={() => setShowDetails(false)}
              address={props.address}
            />
          ) : (
            <Details
              revision={props.revision}
              show={() => setShowDetails(true)}
            />
          ))}
        <Link
          className={classes.greenButton}
          to={`./../${props.revision}/sign`}
          replace
        >
          Sign
        </Link>
      </>
    );
  }

  return (
    <Form
      method="post"
      action={`./../${props.revision}/deploy`}
      onSubmit={handleRequestSignature}
    >
      <input hidden defaultValue={account} name="creator" />
      <button type="submit" className={classes.greenButton}>
        Request Signatures
      </button>
    </Form>
  );
}
