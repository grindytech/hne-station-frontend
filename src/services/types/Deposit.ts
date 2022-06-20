import { BaseDocumentDto } from "./BaseDocument";

export interface Deposit extends BaseDocumentDto {
  proposalID: string;

  userAddress: string;

  amount: number;

  txHash: string;

  block: number;
}
