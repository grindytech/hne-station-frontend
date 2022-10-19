import { chainName } from "connectWallet/connectors";
import { useCallback, useEffect, useMemo, useState } from "react";
import Web3 from "web3";

export enum Wallet {
  METAMASK = "metamask",
  CLOVER = "clover",
  COINBASE = "coinbase",
  WALLET_CONNECT = "walletconnect",
}
const LOCAL_STORE_ACCOUNT = "ACCOUNT";
const LOCAL_STORE_WALLET = "WALLET";
function useWallet() {
  const [web3Injected, setWeb3Injected] = useState<Web3>();
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<string>();
  const [wallet, setWallet] = useState<Wallet>();
  const [chainId, setChainId] = useState<number>();
  const currentAccount = useMemo(() => account, [account]);
  const networkName = useMemo(() => {
    return chainName[String(chainId)];
  }, [chainId]);
  const getProvider = (wallet: Wallet) => {
    let provider = null;
    if (wallet === Wallet.METAMASK) {
      if (window.ethereum?.providers) {
        // eslint-disable-next-line no-restricted-syntax
        for (const p of window.ethereum?.providers) {
          if (p.isMetaMask) {
            provider = p;
            break;
          }
        }
      } else if (window.ethereum?.isMetaMask) {
        provider = window.ethereum;
      }
    }
    if (wallet === Wallet.COINBASE) {
      if (window.ethereum?.providers)
        // eslint-disable-next-line no-restricted-syntax
        for (const p of window.ethereum?.providers) {
          if (p.isCoinbaseWallet) {
            provider = p;
            break;
          }
        }
      else provider = (window as any).coinbaseWalletExtension;
    }
    if (wallet === Wallet.CLOVER) {
      if (window.ethereum?.providers)
        // eslint-disable-next-line no-restricted-syntax
        for (const p of window.ethereum?.providers) {
          if (p.isClover) {
            provider = p;
            break;
          }
        }
      else provider = (window as any).clover;
    }
    return provider;
  };
  const connect = async (walletType: Wallet, requestConnect = true) => {
    const provider = getProvider(walletType);
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
    setWallet(walletType);
    const chainId = await web3.eth.getChainId();
    const chainNumber = Web3.utils.hexToNumber(chainId);
    setChainId(chainNumber);
  };
  const reset = () => {
    setWeb3Injected(undefined);
    setConnected(false);
    setAccount(undefined);
    localStorage.removeItem(LOCAL_STORE_ACCOUNT);
    localStorage.removeItem(LOCAL_STORE_WALLET);
  };

  useEffect(() => {
    if (account) localStorage.setItem(LOCAL_STORE_ACCOUNT, account);
    if (wallet) localStorage.setItem(LOCAL_STORE_WALLET, wallet);
  }, [account, wallet]);

  const autoConnect = useCallback(async () => {
    const lastWallet = localStorage.getItem(LOCAL_STORE_WALLET);
    const lastAccount = localStorage.getItem(LOCAL_STORE_ACCOUNT);
    if (lastWallet && lastAccount) {
      connect(lastWallet as Wallet, false);
    }
  }, []);

  useEffect(() => {
    autoConnect();
  }, [autoConnect]);

  return {
    connect,
    web3Injected,
    connected,
    reset,
    currentAccount,
    account,
    wallet,
    networkName,
  };
}
export default useWallet;
