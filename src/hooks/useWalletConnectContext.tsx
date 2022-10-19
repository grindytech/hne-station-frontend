import configs from "configs";
import { useState } from "react";

function useWalletConnectContext() {
  const [currentChain, setCurrentChain] = useState(configs.DEFAULT_NETWORK());
  const updateContextByInjectProvider = () => {
    if (!(window.ethereum as any)?.isConnected()) return;
    const chainId = window.ethereum.chainId;
    for (const k of Object.keys(configs.NETWORKS)) {
      const network = configs.NETWORKS[k];
      if (
        network.chainId === chainId &&
        currentChain.chainIdNumber !== network.chainIdNumber
      ) {
        setCurrentChain(network);
      }
    }
  };
  return { currentChain, setCurrentChain, updateContextByInjectProvider };
}
export default useWalletConnectContext;
