import { BaseQueryParams } from "./BaseQueyParams";

export class GetTransfer extends BaseQueryParams {
  sourceToken?: string;
  sourceNetwork?: string;
  destinationToken?: string;
  destinationNetwork?: string;
  txHash?: string;
  getFull?: boolean;
  from?: string;
}
