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
      wrapToken: {
        contract: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
        name: "WBNB",
        symbol: "WBNB",
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
      wrapToken: {
        contract: "",
        name: "",
        symbol: "",
      },
    },
    AVAX: {
      chainIdNumber: 43113,
      chainId: Web3.utils.numberToHex(43113),
      rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
      chainName: "Avalanche Testnet",
      blockExplorerUrls: ["https://testnet.snowtrace.io"],
      nativeCurrency: {
        name: "AVAX",
        symbol: "AVAX",
        decimals: 18,
      },
      wrapToken: {
        contract: "",
        name: "",
        symbol: "",
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
    BSC: {
      CONTRACTS: {
        PANCAKE_FACTORY_CONTRACT: "0xB7926C0430Afb07AA7DEfDE6DA862aE0Bde767bc",
        PANCAKE_ROUTER_CONTRACT: "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3",
        ROUTER_CONTRACT: "0xcB01670d5881aF6cD42aA7CAc02c996168631e1b",
        BRIDGE_TOKEN: "0x810c3aeec5Faeb9Ef9f05526Ec8e47fe3c93f1b2", //BUSD
        ISSUE_CONTRACT: "",
        DST_CHAIN_ID: 10102,
      },
      TOKENS: {
        HE: {
          key: "HE",
          name: "Heroes & empires",
          id: "HE",
          contract: "0xf4a904478dB17d9145877bCF95F47C92FeC5eA8d",
        },
        BUSD: {
          key: "BUSD",
          name: "BUSD",
          id: "BUSD",
          contract: "0x810c3aeec5Faeb9Ef9f05526Ec8e47fe3c93f1b2",
        },
        USDT: {
          key: "USDT",
          name: "USDT",
          id: "USDT",
          contract: "0x111133b311Fc230278eF44caf4EF90A6c76bc0a5",
        },
        BNB: {
          key: "BNB",
          name: "BNB",
          id: "BNB",
          contract: "",
          native: true,
        },
      },
    },
    AVAX: {
      CONTRACTS: {
        PANCAKE_FACTORY_CONTRACT: "",
        PANCAKE_ROUTER_CONTRACT: "",
        ROUTER_CONTRACT: "",
        BRIDGE_TOKEN: "",
        ISSUE_CONTRACT: "0xd7eB535a4C829c486fc2B9b9FD05c8958e47E50e",
        DST_CHAIN_ID: 0,
      },
      TOKENS: {
        SKY: {
          key: "SKY",
          name: "SKY",
          id: "HE",
          contract: "0x4D8c1AEa665624ee71c8d25e85bf738e4135ebE0",
        },
        USDT: {
          key: "USDT",
          name: "USDT",
          id: "USDT",
          contract: "",
        },
        WBNB: {
          key: "WBNB",
          name: "Wrap BNB",
          id: "BNB",
          contract: "0x5b74D1A144c2262c0f11cEe511faaF829232a58E",
        },
      },
    },
  },
};
export default configs;
