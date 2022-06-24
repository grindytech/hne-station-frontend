import { ProposalStatus } from "services/types/ProposalStatus";

const PROPOSAL_STATUS_COLORS: any = {};
PROPOSAL_STATUS_COLORS[ProposalStatus.Passed] = "green.400";
PROPOSAL_STATUS_COLORS[ProposalStatus.Deposit] = "primary.400";
PROPOSAL_STATUS_COLORS[ProposalStatus.Voting] = "primary.400";
PROPOSAL_STATUS_COLORS[ProposalStatus.Pending] = "gray";
PROPOSAL_STATUS_COLORS[ProposalStatus.Failed] = "red.500";
PROPOSAL_STATUS_COLORS[ProposalStatus.Rejected] = "orange.400";
PROPOSAL_STATUS_COLORS[ProposalStatus.RejectedByAdmin] = "orange.400";
PROPOSAL_STATUS_COLORS[ProposalStatus.Veto] = "orange.400";

// eslint-disable-next-line import/no-anonymous-default-export
export default { PROPOSAL_STATUS_COLORS };
