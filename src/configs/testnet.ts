import { Configs } from "configs";
import Web3 from "web3";

const configs: Configs = {
  HE_CLAIM_PRIVATE_CONTRACT: "0x0a1A377e61f69F84916e1Ff14a50Ce6C9168e4Db",
  HE_CONTRACT: "0xf4a904478dB17d9145877bCF95F47C92FeC5eA8d",
  PROVIDER: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  HE_CLAIM_PRIVATE_CONTRACT_V2: "0xAc0e209b0Fb0A1b73b7358E04C18ba3D86ec8b40",
  HE_STAKE_CONTRACT: "0x33707798e5118EED72766afE566423BCBeaf937b",
  NETWORK: {
    chainId: Web3.utils.numberToHex(97),
    rpcUrls: ["https://data-seed-prebsc-2-s1.binance.org:8545/"],
    chainName: "BSC Test Net",
    blockExplorerUrls: ["https://testnet.bscscan.com"],
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
  },
  COMMUNITY_AIRDROP_CONTRACT: "",
  BUSD_CONTRACT: "0x1DEC50e5531452B1168962f40EAd44Da45C380DC",
  WBNB_CONTRACT: "",
  FACTORY_V2_CONTRACT: "",
  ROUTER_V2_CONTRACT: "",
  GOVERNANCE_CONTRACT: "0x22600f0EAc28A97aa59380B429ee75a2BAa46F7B",
  API_URI: "https://mpapi-testnet.heroesempires.com/station/",
  BSC_SCAN: "https://testnet.bscscan.com",
  GOVERNANCE_CONTRACT_V2: "0xec71D5D5060f7E495C47f7e28fe8b07b3aa88e8b",
  BEGIN_V2_ID: 16,
};
export default configs;
