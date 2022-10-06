import { Configs } from "configs";
import Web3 from "web3";

const configs: Configs = {
  HE_CLAIM_PRIVATE_CONTRACT: "",
  HE_CONTRACT: "0xE3942dDba8d8ff2c8b07875C483Dc6D3225d347b",
  PROVIDER: "https://fuji-rpc.doschain.com/",
  CHAIN_ID: 2508,
  HE_CLAIM_PRIVATE_CONTRACT_V2: "",
  HE_STAKE_CONTRACT: "0xDf0D61C55a2Dab966C4129370e96eB12425eF443",
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
