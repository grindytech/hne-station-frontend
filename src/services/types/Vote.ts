import { BaseDocumentDto } from "./BaseDocument";
import { VoteType } from "./VoteType";

export interface Vote  extends BaseDocumentDto {
  proposalID: string;

  userAddress: string;

  amount: number;

  txHash: string;

  block: number;

  type: VoteType;
}
