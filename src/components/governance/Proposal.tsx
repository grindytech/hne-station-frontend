import { Box, Button, Heading, HStack, Stack, Text, Tooltip, VStack } from "@chakra-ui/react";
import Card from "components/card/Card";
import CardBody from "components/card/CardBody";
import Loading from "components/state/Loading";
import { getProposal } from "contracts/governance";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { ProposalStatus } from "services/types/ProposalStatus";
import { colorsUtil, formatDate } from "utils/utils";
import { ConfigVoteInfo } from "./ConfigVoteInfo";
import Deposit from "./Deposit";
import Depositors from "./Depositors";
import { Voters } from "./Voters";
import { Vote } from "./Votes";
import linkifyStr from "linkify-string";
import { useIsAdmin } from "hooks/useIsAdmin";
import { useWallet } from "use-wallet";
import AdminAction from "./admin/AdminAction";
import EmptyState from "components/state/EmptyState";

export default function ProposalDetail() {
  const { proposalId } = useParams();

  const { account, isConnected } = useWallet();
  const { admin, adminLoading } = useIsAdmin({ enabled: isConnected(), key: String(account) });

  const { data: proposal, isFetching: proposalRefetching } = useQuery(
    ["getProposal", proposalId],
    async () => {
      // const proposals = await governanceService.getProposals({ proposalId: proposalId });
      // if (proposals && proposals?.items.length > 0) {
      //   return proposals.items[0];
      // }
      return await getProposal(String(proposalId));
    },
    { enabled: !!proposalId }
  );
  return (
    <>
      <HStack mt={[10, 5]} justifyContent="space-between" w="full">
        <Heading as="h3" color="primary.500">
          Proposal details
        </Heading>
        {Number(proposal?.status) === Number(ProposalStatus.Deposit) && (
          <Button to={`/proposal/${proposalId}/deposit`} as={Link} colorScheme="primary">
            Deposit
          </Button>
        )}
        {Number(proposal?.status) === Number(ProposalStatus.Voting) && (
          <Button to={`/proposal/${proposalId}/vote`} as={Link} colorScheme="primary">
            Vote
          </Button>
        )}
        {Number(proposal?.status) === Number(ProposalStatus.Pending) && admin && (
          <AdminAction
            onSuccess={() => {
              window.location.reload();
            }}
            proposalId={String(proposalId)}
          />
        )}
      </HStack>
      <Stack spacing={[10, 5]} w="100%" mt={[10, 5]}>
        {proposalRefetching ? (
          <Loading />
        ) : (Number(proposal?.status) === Number(ProposalStatus.Pending) ||
            Number(proposal?.status) === Number(ProposalStatus.RejectedByAdmin)) &&
          proposal?.proposer !== account &&
          !admin ? (
          <Card>
            <EmptyState msg="Item not found" />
          </Card>
        ) : (
          <VStack w="full" spacing={5}>
            <Card width="full" borderWidth={1}>
              <CardBody>
                <VStack spacing={3} w="full" align="start">
                  <HStack justifyContent="space-between" w="full">
                    <Text fontSize="sm" color="primary.500" colorScheme="primary">
                      {proposalId}
                    </Text>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color={
                        colorsUtil.PROPOSAL_STATUS_COLORS[proposal?.status ?? ProposalStatus.Voting]
                      }
                    >
                      {proposal?.status && ProposalStatus[proposal?.status]}
                    </Text>
                  </HStack>
                  <VStack spacing={0} w="full" align="start">
                    <Text fontSize="lg" color="primary.600">
                      {proposal?.title}
                    </Text>
                    {Number(proposal?.blockTime) && (
                      <Tooltip label={formatDate(Number(proposal?.blockTime) * 1e3)}>
                        <Text fontSize="sm" color="primary.500" colorScheme="primary">
                          Submitted{" "}
                          {proposal?.blockTime &&
                            formatDistanceToNow(new Date(proposal.blockTime * 1e3), {
                              addSuffix: true,
                            })}
                        </Text>
                      </Tooltip>
                    )}
                  </VStack>
                  {proposal?.description && (
                    <Box
                      dangerouslySetInnerHTML={{ __html: linkifyStr(proposal?.description) }}
                      fontSize="md"
                      color="primary.500"
                    ></Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
            {Number(proposal?.status) === Number(ProposalStatus.Deposit) ||
            Number(proposal?.status) === Number(ProposalStatus.Pending) ? (
              <Stack direction={{ md: "row", sm: "column" }} spacing={5} w="full">
                <Box minW={300}>
                  <Deposit
                    loading={proposalRefetching}
                    endDeposit={
                      Number(proposal?.endDeposit) && Number(proposal?.endDeposit) > 0
                        ? new Date(Number(proposal?.endDeposit ?? 0) * 1e3)
                        : undefined
                    }
                    deposited={Number(proposal?.deposit) / 1e18}
                  />
                </Box>
                <Depositors proposalId={proposalId} />
              </Stack>
            ) : (
              <VStack spacing={[10, 5]} w="full">
                {proposal && <Vote proposal={proposal} />}
                <Voters proposalId={String(proposalId)} />
              </VStack>
            )}
            <ConfigVoteInfo />
          </VStack>
        )}
      </Stack>
    </>
  );
}
