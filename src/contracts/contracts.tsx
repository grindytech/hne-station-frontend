import Web3 from "web3";
import { AbiItem } from "web3-utils";

import CONFIGS from "configs";

import erc20 from "./ERC20.json";
import claimPrivate from "./claimPrivate.json";
import claimPrivateV2 from "./claimPrivateV2.json";
import { TOKENS_INFO } from "constant";
import stake from "./stake.json";
import communityAirdrop from "./communityAirdropAbi.json";

export const web3 = new Web3(new Web3.providers.HttpProvider(CONFIGS.PROVIDER));
export const httpWeb3 = new Web3(new Web3.providers.HttpProvider(CONFIGS.PROVIDER));

interface SafeAmountParams {
  str: string;
  decimal?: number;
  significant?: number;
}

export const heContract = () => {
  return new web3.eth.Contract(erc20 as AbiItem[], CONFIGS.HE_CONTRACT);
};
export const claimPrivateContract = () => {
  return new web3.eth.Contract(claimPrivate as AbiItem[], CONFIGS.HE_CLAIM_PRIVATE_CONTRACT);
};
export const claimPrivateContractV2 = () => {
  return new web3.eth.Contract(claimPrivateV2 as AbiItem[], CONFIGS.HE_CLAIM_PRIVATE_CONTRACT_V2);
};
export const erc20Contract = (address: string) => {
  return new web3.eth.Contract(erc20 as AbiItem[], address);
};
export const safeAmount = ({ str, decimal = 18, significant = 6 }: SafeAmountParams) => {
  //* cut string to 6
  significant = significant || 6;
  //* cut string to
  if (significant === -1) {
    significant = decimal - 1;
  }
  if (str.length <= decimal - significant) return 0;
  const trimmedStr = str.slice(0, str.length - decimal + significant);
  return parseInt(trimmedStr) / 10 ** significant;
};
export const stakeContract = () => {
  return new web3.eth.Contract(stake as AbiItem[], CONFIGS.HE_STAKE_CONTRACT);
};

export const getHEAccountBalance = async (token: string, account: string) => {
  const { address, decimal } = TOKENS_INFO[token];
  let balance = await erc20Contract(address).methods.balanceOf(account).call();
  return safeAmount({ str: balance, decimal });
};

export const communityAirdropContract = () => {
  return new web3.eth.Contract(communityAirdrop as AbiItem[], CONFIGS.COMMUNITY_AIRDROP_CONTRACT);
};
