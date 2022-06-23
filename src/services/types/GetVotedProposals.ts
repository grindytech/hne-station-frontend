import { BaseQueryParams } from "./BaseQueyParams";
import { ProposalStatus } from "./ProposalStatus";

export interface GetVotedProposals extends BaseQueryParams {
  userAddress?: string;
  status?: ProposalStatus[];
}
