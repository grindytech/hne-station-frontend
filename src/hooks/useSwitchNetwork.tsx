import configs from "configs";
import { useState } from "react";
import { useWallet } from "use-wallet";
import useWalletConnectContext from "./useWalletConnectContext";

const useSwitchNetwork = () => {
  const wallet = useWallet();
  const { chainId } = wallet;
  const { setCurrentChain } = useWalletConnectContext();
  function isWrongNetwork(network: string) {
    return configs.NETWORKS[network].chainIdNumber !== chainId;
  }
  function switchEthereumChain(chainId: string) {
    return wallet.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainId }],
    });
  }
  function addEthereumChain(params: any) {
    return wallet.ethereum.request({
      method: "wallet_addEthereumChain",
      params: params,
    });
  }
  function changeNetwork(chain: string) {
    const network = configs.NETWORKS[chain];
    return switchEthereumChain(String(network.chainId))
      .then(() => {
        setCurrentChain(network);
        // @ts-ignore
        wallet.connect();
      })
      .catch((err: any) => {
        if (err.code === 4902) {
          addEthereumChain([network]).then(() => {
            setCurrentChain(network);
            // @ts-ignore
            wallet.connect();
          });
        }
      });
  }
  return { isWrongNetwork, changeNetwork };
};
export default useSwitchNetwork;
