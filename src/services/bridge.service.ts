import { client } from "./client";
import { BaseResultPagination } from "./types/BaseResultPagination";
import { ChartData } from "./types/ChartData";
import { GetChartData } from "./types/GetChartData";
import { GetTransfer } from "./types/GetTransfer";
import { Pagination } from "./types/Pagination";
import { TransferDto } from "./types/TransferDto";

const getChartData = async (
  params: GetChartData
): Promise<Pagination<ChartData>> =>
  await client.get("/chart/data", { params });

const getTransfer = async (
  params: GetTransfer
): Promise<Pagination<TransferDto>> =>
  await client.get("/explore/transfer", { params });

export default { getChartData, getTransfer };
