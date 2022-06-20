import { client } from "./client";
import { Deposit } from "./types/Deposit";
import { GetDeposits } from "./types/GetDeposits";
import { GetProposals } from "./types/GetProposals";
import { GetVotes } from "./types/GetVotes";
import { Pagination } from "./types/Pagination";
import { Proposal } from "./types/Proposal";
import { Vote } from "./types/Vote";

const getProposals = async (params: GetProposals): Promise<Pagination<Proposal>> =>
  (await client.get("/proposal/proposals", { params })) as any;

const getDeposits = async (params: GetDeposits): Promise<Pagination<Deposit>> =>
  (await client.get("/proposal/deposits", { params })) as any;

const getDepositors = async (params: GetDeposits): Promise<Pagination<Deposit>> =>
  (await client.get("/proposal/depositors", { params })) as any;

const getVotes = async (params: GetVotes): Promise<Pagination<Vote>> =>
  (await client.get("/proposal/votes", { params })) as any;

const getVoters = async (params: GetVotes): Promise<Pagination<Vote>> =>
  (await client.get("/proposal/voters", { params })) as any;

export const governanceService = { getProposals, getDeposits, getDepositors, getVotes, getVoters };
