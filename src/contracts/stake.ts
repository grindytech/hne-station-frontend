import { secondsToMilliseconds } from "date-fns";

import CONFIGS from "configs";
import { MAX_INT, TOTAL_SECONDS_IN_DAY } from "constant";
import { covertToContractValue } from "utils/utils";
import { erc20Contract, safeAmount, stakeContract } from "./contracts";

interface UserInfo {
  stakeAmount: number;
  rewardDebt: number;
}

interface PoolInfo {
  heToken: string;
  allocPoint: number;
  lastRewardBlock: number;
  accHePerShare: number;
  balancePool: number;
}

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

export const getUserInfo = async (poolId: number, address: string): Promise<UserInfo> => {
  const { amount, rewardDebt } = await stakeContract().methods.userInfo(poolId, address).call();

  return { stakeAmount: safeAmount({ str: amount || "" }), rewardDebt: safeAmount({ str: rewardDebt || "" }) };
};

export const getPoolInfo = async (poolId: number): Promise<PoolInfo> => {
  const { heToken, allocPoint, lastRewardBlock, accHePerShare, balancePool } = await stakeContract()
    .methods.poolInfo(poolId)
    .call();

  return {
    heToken,
    allocPoint,
    lastRewardBlock,
    accHePerShare: safeAmount({ str: accHePerShare || "" }),
    balancePool: safeAmount({ str: balancePool || "" })
  };
};

export const getDailyReward = async (): Promise<number> => {
  const data = await stakeContract().methods.HePerBlock().call();
  const dailyReward = (safeAmount({ str: data }) * TOTAL_SECONDS_IN_DAY) / 3;

  return dailyReward;
};

export const stakeHE = async ({
  poolId,
  amount,
  address
}: {
  poolId: number;
  amount: number;
  address: string;
}): Promise<void> => {
  const approvePrice = covertToContractValue({ amount });

  const allowance = await erc20Contract(CONFIGS.HE_CONTRACT)
    .methods.allowance(address, CONFIGS.HE_STAKE_CONTRACT)
    .call();

  if (Number(allowance) < Number(approvePrice)) {
    await erc20Contract(CONFIGS.HE_CONTRACT)
      .methods.approve(CONFIGS.HE_STAKE_CONTRACT, MAX_INT)
      .send({ from: address });
  }

  await stakeContract().methods.deposit(poolId, approvePrice).send({ from: address });
};

export const getUserPendingWithdraw = async (poolId: number, address: string): Promise<WithdrawInfo[]> => {
  const data = await stakeContract().methods.getWithdrawByAddress(poolId, address).call();
  const withdrawInfo = data.map((item: any) => ({
    amount: safeAmount({ str: item.amount }),
    blockTime: secondsToMilliseconds(item.blockTime),
    withdrawTime: secondsToMilliseconds(item.withdrawTime),
    status: Number(item.status)
  }));
  return withdrawInfo;
};

export const getUserPendingClaim = async (poolId: number, address: string): Promise<ClaimInfo[]> => {
  const data = await stakeContract().methods.getClaimByAddress(poolId, address).call();
  const claimInfo = data.map((item: any) => ({
    amount: safeAmount({ str: item.amount }),
    blockTime: secondsToMilliseconds(item.blockTime),
    claimTime: secondsToMilliseconds(item.claimTime),
    status: Number(item.status)
  }));
  return claimInfo;
};

export const pendingWithdrawHE = async ({
  poolId,
  amount,
  address
}: {
  poolId: number;
  amount: number;
  address: string;
}): Promise<void> => {
  const approvePrice = covertToContractValue({ amount });

  const allowance = await erc20Contract(CONFIGS.HE_CONTRACT)
    .methods.allowance(address, CONFIGS.HE_STAKE_CONTRACT)
    .call();

  if (Number(allowance) < Number(approvePrice)) {
    await erc20Contract(CONFIGS.HE_CONTRACT)
      .methods.approve(CONFIGS.HE_STAKE_CONTRACT, MAX_INT)
      .send({ from: address });
  }

  await stakeContract().methods.pendingWithdraw(poolId, approvePrice).send({ from: address });
};

export const withdrawHE = async ({
  poolId,
  withdrawId,
  address
}: {
  poolId: number;
  withdrawId: number;
  address: string;
}): Promise<void> => {
  await stakeContract().methods.withdraw(poolId, withdrawId).send({ from: address });
};

export const pendingClaimHE = async ({
  poolId,
  amount,
  address
}: {
  poolId: number;
  amount: number;
  address: string;
}): Promise<void> => {
  const approvePrice = covertToContractValue({ amount });

  const allowance = await erc20Contract(CONFIGS.HE_CONTRACT)
    .methods.allowance(address, CONFIGS.HE_STAKE_CONTRACT)
    .call();

  if (Number(allowance) < Number(approvePrice)) {
    await erc20Contract(CONFIGS.HE_CONTRACT)
      .methods.approve(CONFIGS.HE_STAKE_CONTRACT, MAX_INT)
      .send({ from: address });
  }

  await stakeContract().methods.pendingClaim(poolId, approvePrice).send({ from: address });
};

export const claimHE = async ({
  poolId,
  claimId,
  address
}: {
  poolId: number;
  claimId: number;
  address: string;
}): Promise<void> => {
  await stakeContract().methods.claim(poolId, claimId).send({ from: address });
};

export const restake = async ({
  poolId,
  amount,
  address
}: {
  poolId: number;
  amount: number;
  address: string;
}): Promise<void> => {
  const approvePrice = covertToContractValue({ amount });

  const allowance = await erc20Contract(CONFIGS.HE_CONTRACT)
    .methods.allowance(address, CONFIGS.HE_STAKE_CONTRACT)
    .call();

  if (Number(allowance) < Number(approvePrice)) {
    await erc20Contract(CONFIGS.HE_CONTRACT)
      .methods.approve(CONFIGS.HE_STAKE_CONTRACT, MAX_INT)
      .send({ from: address });
  }

  await stakeContract().methods.reInvestment(poolId, approvePrice).send({ from: address });
};

export const getStakingRewardAmount = async (poolId: number, address: string): Promise<number> => {
  const data = await stakeContract().methods.pendingToken(poolId, address).call();

  return safeAmount({ str: data });
};

export const getTimeLockWithdraw = async (): Promise<number> => {
  return stakeContract().methods.timeLockWithdraw().call();
};

export const getTimeLockClaim = async (): Promise<number> => {
  return stakeContract().methods.timeLockClaim().call();
};
