import { BaseDocumentDto } from "./BaseDocument";
import { Proposal } from "./Proposal";

export interface Deposit extends BaseDocumentDto {
  proposalID: string;

  userAddress: string;

  amount: number;

  txHash: string;

  block: number;

  proposal?: Proposal;
}
