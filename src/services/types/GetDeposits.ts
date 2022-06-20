import { BaseQueryParams } from "./BaseQueyParams";

export interface GetDeposits extends BaseQueryParams {
  userAddress?: string;
  proposalId?: string;
}
