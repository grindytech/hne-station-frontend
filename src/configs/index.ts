import TestnetConfigs from "./testnet";
import MainnetConfigs from "./mainnet";

export interface Configs {
  HE_CLAIM_PRIVATE_CONTRACT: string;
  HE_CLAIM_PRIVATE_CONTRACT_V2: string;
  HE_CONTRACT: string;
  HE_STAKE_CONTRACT: string;
  COMMUNITY_AIRDROP_CONTRACT: string;
  PROVIDER: string;
  NETWORK: any;
  BUSD_CONTRACT: string;
  WBNB_CONTRACT: string;
  FACTORY_V2_CONTRACT: string;
  ROUTER_V2_CONTRACT: string;
}

const envConfigs =
  !process.env.REACT_APP_ENV || process.env.REACT_APP_ENV === "testnet"
    ? TestnetConfigs
    : MainnetConfigs;

const configs = { ...envConfigs, DASHBOARD_API_URL: "https://service.he.onl" };

export default configs;
