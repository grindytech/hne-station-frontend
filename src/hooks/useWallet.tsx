import { chainName } from "connectWallet/connectors";
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

const getProvider = (wallet: Wallet) => {
  let provider = null;
  if (wallet === Wallet.METAMASK) {
    if ((window.ethereum as any)?.providers) {
      // eslint-disable-next-line no-restricted-syntax
      for (const p of (window.ethereum as any)?.providers) {
        if (p.isMetaMask) {
          provider = p;
          break;
        }
      }
    } else if ((window.ethereum as any)?.isMetaMask) {
      provider = window.ethereum;
    }
  }
  if (wallet === Wallet.COINBASE) {
    if ((window.ethereum as any)?.providers)
      // eslint-disable-next-line no-restricted-syntax
      for (const p of (window.ethereum as any)?.providers) {
        if (p.isCoinbaseWallet) {
          provider = p;
          break;
        }
      }
    else provider = (window as any).coinbaseWalletExtension;
  }
  if (wallet === Wallet.CLOVER) {
    if ((window.ethereum as any)?.providers)
      // eslint-disable-next-line no-restricted-syntax
      for (const p of (window.ethereum as any)?.providers) {
        if (p.isClover) {
          provider = p;
          break;
        }
      }
    else provider = (window as any).clover;
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
      const provider = getProvider(walletType as Wallet);
      if (!provider) return;
      const web3 = new Web3(provider);
      setWeb3Injected(web3);
      let user = "";
      try {
        if (requestConnect) {
          const [account] = await web3.eth.requestAccounts();
          user = account;
        } else {
          throw new Error();
        }
      } catch {
        const [account] = await web3.eth.getAccounts();
        user = account;
      }
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
  const reset = useCallback(() => {
    setWeb3Injected(undefined);
    setConnected(false);
    setAccount(undefined);
    setEthereum(undefined);
    localStorage.removeItem(LOCAL_STORE_ACCOUNT);
    localStorage.removeItem(LOCAL_STORE_WALLET);
  }, []);

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
