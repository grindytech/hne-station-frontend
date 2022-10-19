const connectors = [
  {
    id: "injected",
    properties: {
      chainId: [
        1, 5, 137, 80001, 1666600000, 1666700000, 97, 56, 588, 1088, 43113, 686,
      ],
    },
  },
  {
    id: "frame",
    properties: {
      chainId: 1,
    },
  },
  {
    id: "walletconnect",
    properties: {
      chainId: [
        1, 5, 137, 80001, 1666600000, 1666700000, 97, 56, 588, 1088, 43113, 686,
      ],
      rpc: {
        "1": "https://mainnet.eth.aragon.network",
        "5": "https://goerli.eth.aragon.network",
        "137": "https://polygon-rpc.com",
        "80001": "https://rpc-mumbai.maticvigil.com",
        "1666600000": "https://api.harmony.one/",
        "1666700000": "https://api.s0.b.hmny.io/",
        "97": "https://data-seed-prebsc-1-s1.binance.org:8545/",
        "56": "https://bsc-dataseed.binance.org/",
        "588": "https://stardust.metis.io/?owner=588",
        "1088": "https://andromeda.metis.io/?owner=1088",
        "43113": "https://api.avax-test.network/ext/bc/C/rpc",
        "686": "https://eth-rpc-karura.aca-api.network/eth/http",
      },
    },
  },
].filter((p) => p);
export const chainName: { [n: string]: string } = {
  "1": "Ethereum",
  "137": "Polygon",
  "97": "BSC testnet",
  "56": "BSC",
  "43113": "AVAX testnet",
  "686":"Karura"
};
// the final data that we pass to use-wallet package.
export const useWalletConnectors = connectors.reduce(
  (current: any, connector) => {
    current[connector.id] = connector.properties || {};
    return current;
  },
  {}
);
