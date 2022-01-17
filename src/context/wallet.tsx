import { useReducer, useEffect, useContext, createContext } from "react";
import { useSupabase } from "~/context/supabase";

interface IWalletState {
  wallet?: string;
  account?: string;
}

interface IWalletContext extends IWalletState {
  connect: () => void;
}

const WalletContext = createContext<IWalletContext>({
  wallet: undefined,
  account: undefined,
  connect: () => null,
});

const SET_WALLET = Symbol();
const SET_ACCOUNT = Symbol();

const reducer = (
  state: IWalletState,
  action: { type: Symbol; wallet?: string; address?: string }
) => {
  if (action.type === SET_WALLET) {
    return {
      ...state,
      wallet: action.wallet,
    };
  }

  if (action.type === SET_ACCOUNT) {
    return {
      ...state,
      account: action.address,
    };
  }

  return state;
};

export default function WalletProvider(props) {
  const [state, dispatch] = useReducer(reducer, {
    wallet: undefined,
    account: undefined,
  });
  const supabase = useSupabase();

  useEffect(() => {
    const ethereum = (window as WindowWithEthereum).ethereum;

    if (ethereum) {
      const handleChange = () => window.location.reload();

      ethereum.on("chainChanged", handleChange);

      ethereum.request({ method: "eth_chainId" }).then((chainId: string) => {
        console.log(chainId);
        if (
          chainId === "0x4" ||
          chainId === "0x13881" ||
          chainId === "0x7a69"
        ) {
          dispatch({ type: SET_WALLET, wallet: ethereum });
        } else {
          alert("Please use Mumbai network");
        }
      });

      return () => {
        ethereum.removeListener("chainChanged", handleChange);
      };
    }
  }, []);

  useEffect(() => {
    const ethereum = (window as WindowWithEthereum).ethereum;

    if (ethereum) {
      ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            const address = accounts[0].toLowerCase();
            dispatch({ type: SET_ACCOUNT, address });
          }
        });
    }
  }, []);

  const connect = () => {
    const ethereum = (window as WindowWithEthereum).ethereum;
    if (ethereum) {
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            const address = accounts[0].toLowerCase();
            dispatch({ type: SET_ACCOUNT, address });
            return supabase?.rpc("add_account", {
              address,
            });
          }

          return null;
        });
    }
  };

  return (
    <WalletContext.Provider value={{ ...state, connect }}>
      {props.children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  return useContext(WalletContext);
};
