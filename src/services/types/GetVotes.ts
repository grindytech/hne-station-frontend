import { BaseQueryParams } from "./BaseQueyParams";
import { VoteType } from "./VoteType";

export interface GetVotes extends BaseQueryParams {
  userAddress?: string;
  proposalId?: string;
  type?: VoteType;
}
