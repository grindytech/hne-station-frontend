import { BaseQueryParams } from "./BaseQueyParams";
import { ProposalStatus } from "./ProposalStatus";

export interface GetProposals extends BaseQueryParams {
  proposer?: string;
  proposalId?: string;
  status?: ProposalStatus[];
}
