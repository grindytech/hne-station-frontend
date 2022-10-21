import configs from "configs";
import { useConnectWallet, Wallet } from "./useWallet";

const useSwitchNetwork = () => {
  const { chainId, ethereum, connect, wallet } = useConnectWallet();
  function isWrongNetwork(network: string) {
    return configs.NETWORKS[network].chainIdNumber !== chainId;
  }
  function switchEthereumChain(chainId: string) {
    return (
      ethereum?.request &&
      ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainId }],
      })
    );
  }
  function addEthereumChain(params: any) {
    return (
      ethereum?.request &&
      ethereum.request({
        method: "wallet_addEthereumChain",
        params: params,
      })
    );
  }
  function changeNetwork(chain: string) {
    const network = configs.NETWORKS[chain];
    return switchEthereumChain(String(network.chainId))
      ?.then(() => {
        connect(wallet || Wallet.METAMASK);
      })
      .catch((err: any) => {
        if (err.code === 4902) {
          addEthereumChain([network])?.then(() => {
            connect(wallet || Wallet.METAMASK);
          });
        }
      });
  }
  return { isWrongNetwork, changeNetwork };
};
export default useSwitchNetwork;
