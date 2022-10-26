import detectEthereumProvider from "@metamask/detect-provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { chainName } from "connectWallet/connectors";
import walletConnectProvider from "connectWallet/WalletConnectProvider";
import { web3 } from "contracts/contracts";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Web3 from "web3";
import { AbstractProvider } from "web3-core";

export enum Wallet {
  METAMASK = "metamask",
  CLOVER = "clover",
  COINBASE = "coinbase",
  WALLET_CONNECT = "walletconnect",
}
const LOCAL_STORE_ACCOUNT = "ACCOUNT";
const LOCAL_STORE_WALLET = "WALLET";

const ConnectWalletContext = React.createContext<{
  connect: (walletType: string, requestConnect?: any) => Promise<void>;
  web3Injected?: Web3;
  connected: boolean;
  reset: () => void;
  account?: string;
  wallet?: string;
  networkName?: string;
  chainId?: number;
  ethereum?: AbstractProvider;
}>({
  account: "",
  connect: async () => {},
  connected: false,
  reset: () => {},
});

const getProvider = async (wallet: Wallet) => {
  let provider = null;
  if (wallet === Wallet.METAMASK) {
    provider = await detectEthereumProvider({ mustBeMetaMask: true });
  }
  if (wallet === Wallet.COINBASE) {
    provider = (window as any).coinbaseWalletExtension;
  }
  if (wallet === Wallet.CLOVER) {
    provider = (window as any).clover;
  }
  if (wallet === Wallet.WALLET_CONNECT) {
    provider = walletConnectProvider();
  }
  return provider;
};
const ConnectWalletProvider: React.FC<Record<string, unknown>> = (props) => {
  const { children } = props;
  const walletContext = useWallet();
  useEffect(() => {
    const { ethereum, connect, wallet } = walletContext;
    const reConnect = () => wallet && connect(wallet, false);
    if (ethereum && wallet) {
      (ethereum as any)?.on("chainChanged", reConnect);
      (ethereum as any)?.on("accountsChanged", reConnect);
    }
    return () => {
      if (ethereum) {
        (ethereum as any)?.removeListener("chainChanged", reConnect);
        (ethereum as any)?.removeListener("accountsChanged", reConnect);
      }
    };
  }, [walletContext]);
  return (
    <>
      <ConnectWalletContext.Provider value={walletContext}>
        {children}
      </ConnectWalletContext.Provider>
    </>
  );
};
function useWallet() {
  const [web3Injected, setWeb3Injected] = useState<Web3>();
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<string>();
  const [wallet, setWallet] = useState<Wallet>();
  const [chainId, setChainId] = useState<number>();
  const [ethereum, setEthereum] = useState<AbstractProvider>();
  const networkName = useMemo(() => {
    return chainName[String(chainId)] || "Unknown network";
  }, [chainId]);

  const connect = useCallback(
    async (walletType: string, requestConnect = true) => {
      const provider = await getProvider(walletType as Wallet);
      if (!provider) return;
      const web3 = new Web3(provider);
      setWeb3Injected(web3);
      let user = "";
      let accounts: string[] = [];
      if (requestConnect) {
        if (walletType === Wallet.WALLET_CONNECT) {
          try {
            accounts = await (provider as WalletConnectProvider).enable();
          } catch (error) {}
        } else {
          accounts = await web3.eth.requestAccounts();
        }
      } else {
        accounts = await web3.eth.getAccounts();
      }
      const [account] = accounts;
      user = account;
      setConnected(true);
      setAccount(user);
      setWallet(walletType as Wallet);
      const chainId = await web3.eth.getChainId();
      const chainNumber = Web3.utils.hexToNumber(chainId);
      setChainId(chainNumber);
      setEthereum(provider);
    },
    []
  );
  const reset = useCallback(async () => {
    setWeb3Injected(undefined);
    setConnected(false);
    setAccount(undefined);
    setEthereum(undefined);
    localStorage.removeItem(LOCAL_STORE_ACCOUNT);
    localStorage.removeItem(LOCAL_STORE_WALLET);
    if (wallet === Wallet.WALLET_CONNECT) {
      try {
        await (ethereum as any as WalletConnectProvider).disconnect();
      } catch (error) {}
    }
  }, [ethereum, wallet]);

  const autoConnect = useCallback(async () => {
    const lastWallet = localStorage.getItem(LOCAL_STORE_WALLET);
    const lastAccount = localStorage.getItem(LOCAL_STORE_ACCOUNT);
    if (lastWallet && lastAccount) {
      connect(lastWallet as Wallet, false);
    }
  }, [connect]);

  useEffect(() => {
    if (account) localStorage.setItem(LOCAL_STORE_ACCOUNT, account);
    if (wallet) localStorage.setItem(LOCAL_STORE_WALLET, wallet);
  }, [account, wallet]);

  useEffect(() => {
    autoConnect();
  }, [autoConnect]);

  useEffect(() => {
    if (ethereum) web3.setProvider(ethereum);
  }, [ethereum]);

  return {
    connect,
    web3Injected,
    connected,
    reset,
    account,
    wallet,
    networkName,
    chainId,
    ethereum,
  };
}

const useConnectWallet = () => {
  const walletContext = useContext(ConnectWalletContext);
  return walletContext;
};
export { useConnectWallet, ConnectWalletProvider };