import { Configs } from "configs";
import Web3 from "web3";

const configs: Configs = {
  HE_CLAIM_PRIVATE_CONTRACT: "0xEFDF31969593EC4eA65195599FAcA9985DE95D70",
  HE_CONTRACT: "0x20D39a5130F799b95B55a930E5b7eBC589eA9Ed8",
  PROVIDER: "https://bsc-dataseed.binance.org/",
  CHAIN_ID: 56,
  HE_CLAIM_PRIVATE_CONTRACT_V2: "0x3F15F7d4d25EC8Cb58aE5F51Ad1939Ae74AcF6a6",
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
  BUSD_CONTRACT: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  WBNB_CONTRACT: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  FACTORY_V2_CONTRACT: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
  ROUTER_V2_CONTRACT: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  GOVERNANCE_CONTRACT: "0xa1a49A5E20583708F9a3D43a8CbBfeb77B610840",
  API_URI: "https://station-api.heroesempires.com/",
  BSC_SCAN: "https://bscscan.com",
  GOVERNANCE_CONTRACT_V2: "0x6e7930206bcC0678964943a9099EC685AB10C7D2",
  BEGIN_V2_ID: 6,
};
export default configs;
