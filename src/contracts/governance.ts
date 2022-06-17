import { governanceContract } from "./contracts";

export async function isAdmin(address: string) {
  return await governanceContract().methods.admin(address).call();
}
export async function minDeposit() {
  return await governanceContract().methods.minDeposit().call();
}

export async function durationDeposit() {
  return await governanceContract().methods.durationDeposit().call();
}

export async function durationVote() {
  return await governanceContract().methods.durationVote().call();
}
