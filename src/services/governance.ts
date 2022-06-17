import { client } from "./client";
import { GetProposals } from "./types/GetProposals";
import { Pagination } from "./types/Pagination";
import { Proposal } from "./types/Proposal";

const getProposals = async (params: GetProposals): Promise<Pagination<Proposal>> =>
  (await client.get("/proposal/proposals", { params })) as any;

export const governanceService = { getProposals };
