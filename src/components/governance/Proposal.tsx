import { Box, Heading, HStack, Stack, Text, Tooltip, VStack } from "@chakra-ui/react";
import Card from "components/card/Card";
import CardBody from "components/card/CardBody";
import Loading from "components/state/Loading";
import { getProposal } from "contracts/governance";
import { format, formatDistanceToNow } from "date-fns";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { ProposalStatus } from "services/types/ProposalStatus";
import { formatDate } from "utils/utils";
import { ConfigVoteInfo } from "./ConfigVoteInfo";
import Deposit from "./Deposit";
import Depositors from "./Depositors";
import { Vote } from "./Votes";

export default function ProposalDetail() {
  const { proposalId } = useParams();

  const { data: proposal, isRefetching: proposalRefetching } = useQuery(
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
      <Heading as="h3" mt={[10, 5]} color="primary.500">
        Proposal details
      </Heading>
      <Stack spacing={[10, 5]} w="100%" mt={[10, 5]}>
        {proposalRefetching ? (
          <Loading />
        ) : (
          <VStack w="full" spacing={5}>
            <Card width="full" borderWidth={1}>
              <CardBody>
                <VStack spacing={3} w="full" align="start">
                  <HStack justifyContent="space-between" w="full">
                    <Text fontSize="sm" color="primary.500" colorScheme="primary">
                      {proposalId}
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold" color="primary.300">
                      {proposal?.status && ProposalStatus[proposal?.status]}
                    </Text>
                  </HStack>
                  <VStack spacing={0} w="full" align="start">
                    <Text fontSize="lg" color="primary.600">
                      {proposal?.title}
                    </Text>
                    <Tooltip label={formatDate(Number(proposal?.blockTime) * 1e3)}>
                      <Text fontSize="sm" color="primary.500" colorScheme="primary">
                        {proposal?.blockTime &&
                          formatDistanceToNow(new Date(proposal.blockTime * 1e3), {
                            addSuffix: true,
                          })}
                      </Text>
                    </Tooltip>
                  </VStack>
                  <Text fontSize="md" color="primary.500">
                    {proposal?.description}
                  </Text>
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
                      proposal?.endDeposit && Number(proposal?.endDeposit) > 0
                        ? new Date(proposal?.endDeposit)
                        : undefined
                    }
                    deposited={Number(proposal?.deposit) / 1e18}
                  />
                </Box>
                <Box w="full" h="full">
                  <Depositors proposalId={proposalId} />
                </Box>
              </Stack>
            ) : (
              <VStack w="full">{proposal && <Vote proposal={proposal} />}</VStack>
            )}
            <ConfigVoteInfo />
          </VStack>
        )}
      </Stack>
    </>
  );
}
