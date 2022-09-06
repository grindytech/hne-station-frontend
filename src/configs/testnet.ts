import { Configs } from "configs";
import Web3 from "web3";

const configs: Configs = {
  HE_CLAIM_PRIVATE_CONTRACT: "",
  HE_CONTRACT: "0x8cA7b9e435F41eDC48e12D5d7F0F1Ba44F0e35Ab",
  PROVIDER: "https://fuji-rpc.doschain.com/",
  CHAIN_ID: 2508,
  HE_CLAIM_PRIVATE_CONTRACT_V2: "",
  HE_STAKE_CONTRACT: "0xfe712b70A0c1Dc7764306d00cFdFdF6f5056de61",
  NETWORK: {
    chainId: Web3.utils.numberToHex(2508),
    rpcUrls: ["https://fuji-rpc.doschain.com/"],
    chainName: "DOS",
    blockExplorerUrls: ["https://bscscan.com"],
    nativeCurrency: {
      name: "DOS",
      symbol: "DOS",
      decimals: 18,
    },
  },
  COMMUNITY_AIRDROP_CONTRACT: "",
  BUSD_CONTRACT: "",
  WBNB_CONTRACT: "",
  FACTORY_V2_CONTRACT: "",
  ROUTER_V2_CONTRACT: "",
  GOVERNANCE_CONTRACT: "",
  API_URI: "https://mpapi-testnet.heroesempires.com/station/",
  BSC_SCAN: "",
  GOVERNANCE_CONTRACT_V2: "",
  BEGIN_V2_ID: 0,
};
export default configs;
