import WalletConnectProvider from "@walletconnect/web3-provider";
import { walletConnectRpc } from "./connectors";

const provider = () =>
  new WalletConnectProvider({
    rpc: walletConnectRpc,
  });
export default provider;
