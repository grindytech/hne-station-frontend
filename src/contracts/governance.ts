import { ProposalStatus } from "services/types/ProposalStatus";
import { VoteType } from "services/types/VoteType";
// import { governanceContract } from "./contracts";
import { Contract } from "web3-eth-contract";

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

export async function isAdmin(contract: Contract, address: string) {
  return await contract.methods.admin(address).call();
}
export async function minDeposit(contract: Contract) {
  return await contract.methods.minDeposit().call();
}

export async function durationDeposit(contract: Contract) {
  return await contract.methods.durationDeposit().call();
}

export async function durationVote(contract: Contract) {
  return await contract.methods.durationVote().call();
}

export async function initialProposal(contract: Contract) {
  return await contract.methods.initialProposal().call();
}

export async function getQuorum(contract: Contract) {
  return await contract.methods.quorum().call();
}

export async function getThresholdPassed(contract: Contract) {
  return await contract.methods.thresholdPassed().call();
}

export async function getThresholdVeto(contract: Contract) {
  return await contract.methods.thresholdVeto().call();
}

export async function createProposal(
  contract: Contract,
  title: string,
  description: string,
  account: string
) {
  debugger;
  await contract.methods.createProposal(title, description).send({ from: account });
}

export async function getProposal(
  contract: Contract,
  proposalId: string
): Promise<ProposalOnchain> {
  return await contract.methods.proposal(proposalId).call();
}

export async function depositProposal(
  contract: Contract,
  proposalId: string,
  amount: string,
  account: string
) {
  await contract.methods.deposit(proposalId, amount).send({ from: account });
}

export async function getVoted(
  contract: Contract,
  proposalId: string,
  account: string
): Promise<ProposalOnchain> {
  const voted = await contract.methods.mapVotes(account, proposalId).call();
  return voted;
}

export async function vote(
  contract: Contract,
  proposalId: string,
  amount: string,
  vote: VoteType,
  account: string
) {
  await contract.methods.vote(proposalId, amount, vote).send({ from: account });
}

export async function activeDeposit(
  contract: Contract,
  proposalId: string,
  status: ProposalStatus,
  account: string
) {
  await contract.methods.activeDeposit(proposalId, status).send({ from: account });
}
export async function hasWithdrawn(
  contract: Contract,
  proposalId: string,
  account: string
): Promise<Boolean> {
  const hasWithdrawn = await contract.methods.withdrawID(account, proposalId).call();
  return hasWithdrawn;
}

export async function withdrawal(contract: Contract, proposalId: string, account: string) {
  await contract.methods.withdrawal(proposalId).send({ from: account });
}
