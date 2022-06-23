import { BaseDocumentDto } from "./BaseDocument";
import { ProposalStatus } from "./ProposalStatus";

export interface Proposal extends BaseDocumentDto {
  proposalID: string;

  proposer: string;

  title: string;

  description: string;

  //init amount
  initial: string;

  deposit: string;

  status: ProposalStatus;

  votesPassed: string;

  votesFail: string;

  votesVeto: string;

  blockTime: Date;

  start: Date;

  endDeposit: Date;

  endVote: Date;

  block: number;

  txHash: string;

  amount?: number;
  userAddress?: string;
}
