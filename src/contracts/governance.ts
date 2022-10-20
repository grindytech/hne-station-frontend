import { ProposalStatus } from "services/types/ProposalStatus";
import { VoteType } from "services/types/VoteType";
// import { governanceContract } from "./contracts";

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

export async function isAdmin(contract: any, address: string) {
  return await contract.methods.admin(address).call();
}
export async function minDeposit(contract: any) {
  return await contract.methods.minDeposit().call();
}

export async function durationDeposit(contract: any) {
  return await contract.methods.durationDeposit().call();
}

export async function durationVote(contract: any) {
  return await contract.methods.durationVote().call();
}

export async function initialProposal(contract: any) {
  return await contract.methods.initialProposal().call();
}

export async function getQuorum(contract: any) {
  return await contract.methods.quorum().call();
}

export async function getThresholdPassed(contract: any) {
  return await contract.methods.thresholdPassed().call();
}

export async function getThresholdVeto(contract: any) {
  return await contract.methods.thresholdVeto().call();
}

export async function createProposal(
  contract: any,
  title: string,
  description: string,
  account: string
) {
  await contract.methods
    .createProposal(title, description)
    .send({ from: account });
}

export async function getProposal(
  contract: any,
  proposalId: string
): Promise<ProposalOnchain> {
  return await contract.methods.proposal(proposalId).call();
}

export async function depositProposal(
  contract: any,
  proposalId: string,
  amount: string,
  account: string
) {
  await contract.methods.deposit(proposalId, amount).send({ from: account });
}

export async function getVoted(
  contract: any,
  proposalId: string,
  account: string
): Promise<ProposalOnchain> {
  const voted = await contract.methods.mapVotes(account, proposalId).call();
  return voted;
}

export async function vote(
  contract: any,
  proposalId: string,
  amount: string,
  vote: VoteType,
  account: string
) {
  await contract.methods.vote(proposalId, amount, vote).send({ from: account });
}

export async function activeDeposit(
  contract: any,
  proposalId: string,
  status: ProposalStatus,
  account: string
) {
  await contract.methods.activeDeposit(proposalId, status).send({ from: account });
}
export async function hasWithdrawn(
  contract: any,
  proposalId: string,
  account: string
): Promise<Boolean> {
  const hasWithdrawn = await contract.methods
    .withdrawID(account, proposalId)
    .call();
  return hasWithdrawn;
}

export async function withdrawal(contract: any, proposalId: string, account: string) {
  await contract.methods.withdrawal(proposalId).send({ from: account });
}
