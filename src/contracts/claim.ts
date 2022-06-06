import { secondsToMilliseconds } from "date-fns";

import CONFIGS from "configs";
import { MAX_INT, TOTAL_SECONDS_IN_DAY } from "constant";
import { claimPrivateContract, erc20Contract, safeAmount } from "./contracts";

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

export const claimHE = async ({ address }: { address: string }): Promise<void> => {
  await claimPrivateContract().methods.claim().send({ from: address });
};

export const getClaimableAmount = async (address: string): Promise<number> => {
  const data = await claimPrivateContract().methods.getAvaiableAmount(address).call();

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
