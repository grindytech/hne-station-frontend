import { ProposalStatus } from "services/types/ProposalStatus";
import { governanceContract } from "./contracts";

export type ProposalOnchain = {
  proposer: string;
  title: string;
  description: string;
  initial: number;
  deposit: number;
  status: ProposalStatus;
  votesPassed: number;
  votesFail: number;
  votesVeto: number;
  start: number;
  endDeposit: number;
  endVote: number;
  blockTime: number;
  totalStake: number;
};

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

export async function initialProposal() {
  return await governanceContract().methods.initialProposal().call();
}

export async function getQuorum() {
  return await governanceContract().methods.quorum().call();
}

export async function getThresholdPassed() {
  return await governanceContract().methods.thresholdPassed().call();
}

export async function getThresholdVeto() {
  return await governanceContract().methods.thresholdVeto().call();
}

export async function createProposal(title: string, description: string, account: string) {
  // const id = `GV-${shortid.generate()}`;
  await governanceContract().methods.createProposal(title, description).send({ from: account });
  // return id;
}

export async function getProposal(proposalId: string): Promise<ProposalOnchain> {
  return await governanceContract().methods.proposal(proposalId).call();
}
