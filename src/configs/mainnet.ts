import { Configs } from "configs";
import Web3 from "web3";

const configs: Configs = {
  HE_CLAIM_PRIVATE_CONTRACT: "0xEFDF31969593EC4eA65195599FAcA9985DE95D70",
  HE_CONTRACT: "0x20D39a5130F799b95B55a930E5b7eBC589eA9Ed8",
  PROVIDER: "https://bsc-dataseed.binance.org/",
  HE_CLAIM_PRIVATE_CONTRACT_V2: "",
  HE_STAKE_CONTRACT: "0x4f9A4E9Ec99A3300ba5576A2c6D3742dF3caFd23",
  NETWORK: {
    chainId: Web3.utils.numberToHex(56),
    rpcUrls: ["https://bsc-dataseed.binance.org"],
    chainName: "Binance Smart Chain",
    blockExplorerUrls: ["https://bscscan.com"],
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
  },
  COMMUNITY_AIRDROP_CONTRACT: "0x131c4EdF315225B1f8cEd4a0734Ccce338713763",
};
export default configs;
