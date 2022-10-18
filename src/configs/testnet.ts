import { Configs } from "configs";
import Web3 from "web3";

const configs: Configs = {
  HE_CLAIM_PRIVATE_CONTRACT: "",
  HE_CONTRACT: "0xf4a904478dB17d9145877bCF95F47C92FeC5eA8d",
  HE_CLAIM_PRIVATE_CONTRACT_V2: "",
  HE_STAKE_CONTRACT: "0xdBB51642Bbd2f9C127B405c817Ea1A60c8379a70",
  COMMUNITY_AIRDROP_CONTRACT: "",
  API_URI: "https://mpapi-testnet.heroesempires.com/station/",
  TOKEN_SYMBOL: "OVER",
  DEFAULT_CHAIN: "BSC",
  NETWORKS: {
    BSC: {
      chainIdNumber: 97,
      chainId: Web3.utils.numberToHex(97),
      rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
      chainName: "BSC Test Net",
      blockExplorerUrls: ["https://testnet.bscscan.com"],
      nativeCurrency: {
        name: "BNB",
        symbol: "BNB",
        decimals: 18,
      },
    },
    DOS: {
      chainIdNumber: 2508,
      chainId: Web3.utils.numberToHex(2508),
      rpcUrls: ["https://fuji-rpc.doschain.com/"],
      chainName: "DOS",
      blockExplorerUrls: ["https://test-explorer.doschain.com/"],
      nativeCurrency: {
        name: "DOS",
        symbol: "DOS",
        decimals: 18,
      },
    },
  },
  GOV: {
    BEGIN_V2_ID: 0,
    GOVERNANCE_CONTRACT: "",
    GOVERNANCE_CONTRACT_V2: "",
  },
  BUSD_CONTRACT: "",
  WBNB_CONTRACT: "",
  SWAP: {
    FACTORY_V2_CONTRACT: "",
    ROUTER_V2_CONTRACT: "",
  },
  BRIDGE: {
    FACTORY_CONTRACT: "",
    PAIR_CONTRACT: "",
    ROUTER_CONTRACT: "",
    TOKENS: {
      BSC: [
        {
          key: "HE",
          name: "Heroes & empires",
          id: "HE",
          contract: "0xf4a904478dB17d9145877bCF95F47C92FeC5eA8d",
        },
        {
          key: "BUSD",
          name: "BUSD",
          id: "BUSD",
          contract: "0x810c3aeec5Faeb9Ef9f05526Ec8e47fe3c93f1b2",
        },
        {
          key: "USDT",
          name: "USDT",
          id: "USDT",
          contract: "0x111133b311Fc230278eF44caf4EF90A6c76bc0a5",
        },
        {
          key: "WBNB",
          name: "Wrap BNB",
          id: "WBNB",
          contract: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
        },
      ],
      DOS: [
        {
          key: "SKY",
          name: "SKY",
          id: "HE",
          contract: "0x4D8c1AEa665624ee71c8d25e85bf738e4135ebE0",
        },
        {
          key: "USDT",
          name: "USDT",
          id: "USDT",
          contract: "",
        },
        {
          key: "WBNB",
          name: "Wrap BNB",
          id: "WBNB",
          contract: "0x5b74D1A144c2262c0f11cEe511faaF829232a58E",
        },
      ],
    },
  },
};
export default configs;
