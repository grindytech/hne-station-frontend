import { secondsToMilliseconds } from "date-fns";

import CONFIGS from "configs";
import { MAX_INT, TOTAL_SECONDS_IN_DAY } from "constant";
import {
  claimPrivateContractV2 as claimPrivateContract,
  erc20Contract,
  safeAmount,
} from "./contracts";

export interface WithdrawInfo {
  amount: number;
  blockTime: number;
  withdrawTime: number;
  status: number;
}

export interface ClaimInfo {
  amount: number;
  blockTime: number;
  claimTime: number;
  status: number;
}

// TODO: Show total stake by get user info of each pool

export const getPoolInfo = async (): Promise<number> => {
  const totalPool = await claimPrivateContract().methods.totalPool().call();

  return safeAmount({ str: totalPool || "" });
};

// export const claimHE = async ({ address }: { address: string }): Promise<void> => {
//   await claimPrivateContract().methods.claim().send({ from: address });
// };

export const claimOption1 = async ({ address }: { address: string }): Promise<void> => {
  await claimPrivateContract().methods.claimOption1().send({ from: address });
};
export const claimOption2 = async ({ address }: { address: string }): Promise<void> => {
  await claimPrivateContract().methods.claimOption2().send({ from: address });
};

export const getClaimableAmount = async (address: string): Promise<number> => {
  const contract = claimPrivateContract();
  const data = await contract.methods.getAvailableAmount1(address).call();
  return safeAmount({ str: data });
};
export const getClaimableOption2Amount = async (address: string): Promise<number> => {
  const data = await claimPrivateContract().methods.getAvailableAmount2(address).call();
  return safeAmount({ str: data });
};
export const getTotalWithdrawnAmount = async (): Promise<number> => {
  const data = await claimPrivateContract().methods.totalWithdraw().call();

  return safeAmount({ str: data });
};

export const getUserWithdrawnAmount = async (address: string): Promise<number> => {
  const data = await claimPrivateContract().methods.withdrawnAmount(address).call();

  return safeAmount({ str: data });
};

export const getUserTotalAmount = async (address: string): Promise<number> => {
  const data = await claimPrivateContract().methods.totalAmount(address).call();

  return safeAmount({ str: data });
};

export const getStartTime = async (): Promise<number> => {
  const data = await claimPrivateContract().methods.startTime().call();

  return data * 1000;
};
