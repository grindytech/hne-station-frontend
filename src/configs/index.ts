import { BridgeToken } from "contracts/bridge";
import MainnetConfigs from "./mainnet";
import TestnetConfigs from "./testnet";

export type Network = {
  chainId: string;
  chainIdNumber: number;
  rpcUrls: string[];
  chainName: string;
  blockExplorerUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  wrapToken: {
    contract: string;
    name: string;
    symbol: string;
  };
};

export interface Configs {
  NETWORKS: { [n: string]: Network };
  API_URI: string;
  DEFAULT_CHAIN: string;
  BRIDGE: {
    [n: string]: {
      DST_CHAIN_ID: number;
      IS_USE_LP: boolean;
      CONTRACTS: {
        ROUTER_CONTRACT: string;
        PANCAKE_FACTORY_CONTRACT: string;
        PANCAKE_ROUTER_CONTRACT: string;
        ISSUE_CONTRACT: string;
        BRIDGE_TOKEN: string;
        LAYER_0_ENDPOINT: string;
        POOL: string;
      };
      TOKENS: { [n: string]: BridgeToken };
    };
  };
}

const envConfigs =
  !process.env.REACT_APP_ENV || process.env.REACT_APP_ENV === "testnet"
    ? TestnetConfigs
    : MainnetConfigs;

const configs = {
  ...envConfigs,
  DEFAULT_NETWORK: () => envConfigs.NETWORKS[envConfigs.DEFAULT_CHAIN],
};

export default configs;
