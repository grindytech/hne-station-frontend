import { Box, HStack, Icon, Progress, Spinner, Stack, Text, VStack } from "@chakra-ui/react";
import Card from "components/card/Card";
import CardBody from "components/card/CardBody";
import CardHeader from "components/card/CardHeader";
import { formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineInbox } from "react-icons/ai";
import { useQuery } from "react-query";
import { governanceService } from "services/governance";
import { Pagination } from "services/types/Pagination";
import { Proposal } from "services/types/Proposal";
import { ProposalStatus } from "services/types/ProposalStatus";

function ProposalItem({ proposal }: { proposal: Proposal }) {
  return (
    <Card borderWidth={1} _hover={{ borderColor: "primary.300", cursor: "pointer" }}>
      <CardHeader>
        <HStack mb={2} justifyContent="space-between" w="full">
          <Text fontSize="sm" color="primary.500" colorScheme="primary">
            {proposal.proposalID}
          </Text>
          <Text fontSize="sm" fontWeight="semibold" color="primary.300">
            {ProposalStatus[proposal.status]}
          </Text>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack w="full" align="start">
          <Text fontSize="lg" color="primary.600">
            {proposal.title}
          </Text>
          <Text fontSize="sm" color="primary.500" colorScheme="primary">
            {formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })}
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
}

export function Proposals({ status, needRefresh }: { status: ProposalStatus; needRefresh?: any }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Pagination<Proposal>>();
  const [loading, setLoading] = useState(false);
  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await governanceService.getProposals({
        status:
          status === ProposalStatus.Failed
            ? [ProposalStatus.Failed, ProposalStatus.DepositNotEnough, ProposalStatus.Veto]
            : [status],
        page,
        orderBy: "createdAt",
        desc: "desc",
      });
      setData(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [page, status, needRefresh]);
  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <Stack>
      {loading ? (
        <Card w="full">
          <CardBody>
            <VStack justifyContent="center" w="full" height="200">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
                justifyContent="center"
              />
            </VStack>
          </CardBody>
        </Card>
      ) : data?.total === 0 ? (
        <Card w="full">
          <CardBody>
            <VStack justifyContent="center" w="full" height="200">
              <Icon as={AiOutlineInbox} w={24} h={24} color="primary.500" />
              <Text textAlign="center" color="primary.500">
                No proposals in{" "}
                {status === ProposalStatus.Voting
                  ? "voting"
                  : status === ProposalStatus.Deposit
                  ? "deposit"
                  : status === ProposalStatus.Passed
                  ? "passed"
                  : "rejected"}
                &nbsp; period
              </Text>
            </VStack>
          </CardBody>
        </Card>
      ) : (
        <Stack direction={["column", "row"]} w="full">
          {data?.items?.map((proposal) => (
            <Box w={["full", data?.total === 1 ? "full" : "50%"]}>
              <ProposalItem key={proposal.proposalID} proposal={proposal} />
            </Box>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
