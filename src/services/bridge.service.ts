import { client } from "./client";
import { ChartData } from "./types/ChartData";
import { GetChartData } from "./types/GetChartData";
import { GetTransfer } from "./types/GetTransfer";
import { Pagination } from "./types/Pagination";
import { TokenVolume } from "./types/TokenVolumeDto";
import { TransferDto } from "./types/TransferDto";

const getChartData = async (
  params: GetChartData
): Promise<Pagination<ChartData>> =>
  await client.get("/chart/data", { params });

const getTransfer = async (
  params: GetTransfer
): Promise<Pagination<TransferDto>> =>
  await client.get("/explore/transfer", { params });

const getToken24HVolume = async (): Promise<Pagination<TokenVolume>> =>
  await client.get("/explore/tokens/volume24h");

export default { getChartData, getTransfer, getToken24HVolume };
