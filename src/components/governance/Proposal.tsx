import { Box, Heading, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import Card from "components/card/Card";
import CardBody from "components/card/CardBody";
import Loading from "components/state/Loading";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { governanceService } from "services/governance";
import { ProposalStatus } from "services/types/ProposalStatus";
import Deposit from "./Deposit";
import Depositors from "./Depositors";

export default function ProposalDetail() {
  const { proposalId } = useParams();

  const { data: proposal, isRefetching: proposalRefetching } = useQuery(
    ["getProposal", proposalId],
    async () => {
      const proposals = await governanceService.getProposals({ proposalId: proposalId });
      if (proposals && proposals?.items.length > 0) {
        return proposals.items[0];
      }
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
                      {proposal?.proposalID}
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold" color="primary.300">
                      {proposal?.status && ProposalStatus[proposal?.status]}
                    </Text>
                  </HStack>
                  <VStack spacing={0} w="full" align="start">
                    <Text fontSize="lg" color="primary.600">
                      {proposal?.title}
                    </Text>
                    <Text fontSize="sm" color="primary.500" colorScheme="primary">
                      {proposal?.createdAt &&
                        formatDistanceToNow(new Date(proposal?.createdAt), {
                          addSuffix: true,
                        })}
                    </Text>
                  </VStack>
                  <Text fontSize="md" color="primary.500">
                    {proposal?.description}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
            {Number(proposal?.status) === Number(ProposalStatus.Deposit) && (
              <Stack direction={{ md: "row", sm: "column" }} spacing={5} w="full">
                <Box minW={300}>
                  <Deposit
                    loading={proposalRefetching}
                    endDeposit={new Date(proposal?.endDeposit ?? 0)}
                    deposited={Number(proposal?.deposit)}
                  />
                </Box>
                <Box w="full" h="full">
                  <Depositors proposalId={proposal?.proposalID} />
                </Box>
              </Stack>
            )}
            {Number(proposal?.status) !== Number(ProposalStatus.Deposit) && <>x</>}
          </VStack>
        )}
      </Stack>
    </>
  );
}
