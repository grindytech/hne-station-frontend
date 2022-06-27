import { ProposalStatus } from "services/types/ProposalStatus";
import { VoteType } from "services/types/VoteType";
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

export async function depositProposal(proposalId: string, amount: string, account: string) {
  await governanceContract().methods.deposit(proposalId, amount).send({ from: account });
}

export async function getVoted(proposalId: string, account: string): Promise<ProposalOnchain> {
  const voted = await governanceContract().methods.mapVotes(account, proposalId).call();
  return voted;
}

export async function vote(proposalId: string, amount: string, vote: VoteType, account: string) {
  await governanceContract().methods.vote(proposalId, amount, vote).send({ from: account });
}

export async function activeDeposit(proposalId: string, status: ProposalStatus, account: string) {
  await governanceContract().methods.activeDeposit(proposalId, status).send({ from: account });
}
export async function hasWithdrawn(proposalId: string, account: string): Promise<Boolean> {
  const hasWithdrawn = await governanceContract().methods.withdrawID(account, proposalId).call();
  console.log("hasWithdrawn");
  console.log(hasWithdrawn);
  return hasWithdrawn;
}

export async function withdrawal(proposalId: string, account: string) {
  await governanceContract().methods.withdrawal(proposalId).send({ from: account });
}
