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
  HE_CLAIM_PRIVATE_CONTRACT: string;
  HE_CLAIM_PRIVATE_CONTRACT_V2: string;
  HE_CONTRACT: string;
  HE_STAKE_CONTRACT: string;
  COMMUNITY_AIRDROP_CONTRACT: string;
  BUSD_CONTRACT: string;
  WBNB_CONTRACT: string;

  NETWORKS: { [n: string]: Network };
  DEFAULT_CHAIN: string;
  API_URI: string;
  TOKEN_SYMBOL: string;

  SWAP: {
    FACTORY_V2_CONTRACT: string;
    ROUTER_V2_CONTRACT: string;
  };
  GOV: {
    GOVERNANCE_CONTRACT: string;
    GOVERNANCE_CONTRACT_V2: string;
    BEGIN_V2_ID: number;
  };
  BRIDGE: {
    [n: string]: {
      CONTRACTS: {
        ROUTER_CONTRACT: string;
        PANCAKE_FACTORY_CONTRACT: string;
        PANCAKE_ROUTER_CONTRACT: string;
        ISSUE_CONTRACT: string;
        BRIDGE_TOKEN: string;
        DST_CHAIN_ID: number;
        LAYER_0_ENDPOINT: string;
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
  DASHBOARD_API_URL: "https://service.he.onl",
  DEFAULT_NETWORK: () => envConfigs.NETWORKS[envConfigs.DEFAULT_CHAIN],
};

export default configs;
