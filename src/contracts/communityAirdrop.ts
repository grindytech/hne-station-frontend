import { communityAirdropContract } from "./contracts";

export const whitelistAddress = async (section: string, address: string): Promise<string> =>
  await communityAirdropContract().methods.whitelistAddress(section, address).call();

export const claimed = async (section: string, address: string): Promise<string> =>
  await communityAirdropContract().methods.claimed(section, address).call();

export const start = async (section: string): Promise<string> =>
  await communityAirdropContract().methods.start(section).call();

export const airdropAmount = async (section: string, address: string): Promise<string> =>
  await communityAirdropContract().methods.amount(section, address).call();

export const claim = async (section: string, address: string) =>
  await communityAirdropContract().methods.claimHe(section).send({ from: address });
