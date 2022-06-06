import CONFIGS from "configs";

interface TokenInfo {
  address: string;
  decimal: number;
}

export const MAX_INT = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

export const DEX_ADDRESS = "0xaa7a55254eeA416EB0772696AB01127bacbEA235";
export const BSC_RPC = "https://bsc-dataseed1.defibit.io/";
export const BUSD_ADDRESS = "0x1DEC50e5531452B1168962f40EAd44Da45C380DC";

// MAINNET
// export const NETWORK = 97;
export const NETWORK = 56;
export const TOKENS_INFO: { [key: string]: TokenInfo } = {
  USDT: { address: "0x501a2716bbe5871a0292e3427157cbfc92d9f43b", decimal: 6 },
  AUR: { address: "0xe47121ffd3b65265d86de004aff3a3ae1c3c18be", decimal: 18 },
  BUSD: { address: BUSD_ADDRESS, decimal: 18 },
  HE: { address: CONFIGS.HE_CONTRACT, decimal: 18 }
};

export const TOTAL_SECONDS_IN_DAY = 60 * 60 * 24;
export const DATE_TIME_FORMAT = "dd MMM yyyy HH:mm:ss";
export const CLAIMED_STATUS = 1;
