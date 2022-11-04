import { Configs } from "configs";
import Web3 from "web3";

const configs: Configs = {
  API_URI: "https://mpapi-dos-test.heroesempires.com/bridge", // "https://mpapi-testnet.heroesempires.com/station/",
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
      chainIdNumber: 1311,
      chainId: Web3.utils.numberToHex(1311),
      rpcUrls: ["https://test.doschain.com/jsonrpc"],
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
  },
  DEFAULT_CHAIN: "BSC",
  BRIDGE: {
    BSC: {
      DST_CHAIN_ID: 10102,
      IS_USE_LP: true,
      CONTRACTS: {
        PANCAKE_FACTORY_CONTRACT: "0xB7926C0430Afb07AA7DEfDE6DA862aE0Bde767bc",
        PANCAKE_ROUTER_CONTRACT: "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3",
        ROUTER_CONTRACT: "0xe1066EFB531B0fA21dc974adB54a76e7927f7E09",
        BRIDGE_TOKEN: "0x810c3aeec5Faeb9Ef9f05526Ec8e47fe3c93f1b2", //BUSD
        ISSUE_CONTRACT: "",
        LAYER_0_ENDPOINT: "0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1",
        POOL: "0x169e8C01081Fc33c0c3Ec467df509D18C4d55999",
      },
      TOKENS: {
        HE: {
          key: "HE",
          name: "Heroes & empires",
          id: "HE",
          contract: "0xf4a904478dB17d9145877bCF95F47C92FeC5eA8d",
          decimal: 18,
        },
        BUSD: {
          key: "BUSD",
          name: "BUSD",
          id: "BUSD",
          contract: "0x810c3aeec5Faeb9Ef9f05526Ec8e47fe3c93f1b2",
          decimal: 18,
        },
        USDT: {
          key: "USDT",
          name: "USDT",
          id: "USDT",
          contract: "0x111133b311Fc230278eF44caf4EF90A6c76bc0a5",
          decimal: 18,
        },
        BNB: {
          key: "BNB",
          name: "BNB",
          id: "BNB",
          contract: "",
          native: true,
          decimal: 18,
        },
      },
    },
    DOS: {
      CONTRACTS: {
        BRIDGE_TOKEN: "",
        ISSUE_CONTRACT: "0xFe764009660eDf970e597d30eC1A94A669205cDe",
        LAYER_0_ENDPOINT: "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1",
        PANCAKE_FACTORY_CONTRACT: "",
        PANCAKE_ROUTER_CONTRACT: "",
        ROUTER_CONTRACT: "",
        POOL: "0x763a49a9933D82ec046a72F9287470Fa9F8C5D15",
      },
      DST_CHAIN_ID: 10149,
      IS_USE_LP: false,
      TOKENS: {
        SKY: {
          contract: "0xFa1B43742248440be1f5BA62Dde6656e645A45b6",
          decimal: 18,
          id: "HE",
          key: "SKY",
          name: "SKY",
        },
        USDT: {
          contract: "0xfD9C9A40bd3426c5c95A3EDD7F65F994228619cF",
          decimal: 18,
          id: "USDT",
          key: "USDT",
          name: "USDT",
        },
        WBNB: {
          contract: "0x40CB7C5C94b18062f8299B742b878a03CAF6E7D8",
          decimal: 18,
          id: "BNB",
          key: "WBNB",
          name: "WBNB",
        },
      },
    },
  },
};
export default configs;

//  AVAX: {
//       chainIdNumber: 43113,
//       chainId: Web3.utils.numberToHex(43113),
//       rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
//       chainName: "Avalanche Testnet",
//       blockExplorerUrls: ["https://testnet.snowtrace.io"],
//       nativeCurrency: {
//         name: "AVAX",
//         symbol: "AVAX",
//         decimals: 18,
//       },
//       wrapToken: {
//         contract: "",
//         name: "",
//         symbol: "",
//       },
//     },

