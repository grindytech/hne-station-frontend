import { Box, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import Card from "components/card/Card";
import CardBody from "components/card/CardBody";
import CardHeader from "components/card/CardHeader";
import Paginator from "components/paging/Paginator";
import EmptyState from "components/state/EmptyState";
import Loading from "components/state/Loading";
import { formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { governanceService } from "services/governance";
import { Pagination } from "services/types/Pagination";
import { Proposal } from "services/types/Proposal";
import { ProposalStatus } from "services/types/ProposalStatus";
import { SystemInfo } from "./SystemInfo";

function ProposalItem({ proposal }: { proposal: Proposal }) {
  return (
    <Link to={`/proposal/${proposal.proposalID}`}>
      <Card width="full" borderWidth={1} _hover={{ borderColor: "primary.300", cursor: "pointer" }}>
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
    </Link>
  );
}

export function Proposals({ status }: { status: ProposalStatus }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Pagination<Proposal>>();
  const [loading, setLoading] = useState(false);
  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await governanceService.getProposals({
        status:
          status === ProposalStatus.Failed
            ? [ProposalStatus.Failed, ProposalStatus.Rejected, ProposalStatus.Veto]
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
  }, [page, status]);
  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <Stack>
      {loading ? (
        <Card>
          <Loading />
        </Card>
      ) : data?.total === 0 ? (
        <Card>
          <EmptyState
            msg={`No proposals in ${
              status === ProposalStatus.Voting
                ? "voting"
                : status === ProposalStatus.Deposit
                ? "deposit"
                : status === ProposalStatus.Passed
                ? "passed"
                : "rejected"
            } period`}
          />
        </Card>
      ) : (
        <VStack>
          <div
            style={{
              display: "flex",
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            {data?.items?.map((proposal, i) => (
              <Box
                w={{ sm: "full", md: data?.total === 1 ? "full" : "50%" }}
                pr={i % 2 === 0 ? 2 : 0}
                pb={2}
              >
                <ProposalItem key={proposal.proposalID} proposal={proposal} />
              </Box>
            ))}
          </div>
          <HStack pt={2} pr={2} w="full" justifyContent="flex-end">
            <Paginator
              onChange={(p) => setPage(p)}
              page={page}
              totalPage={Math.ceil(Number(data?.total) / Number(data?.size))}
            />
          </HStack>
        </VStack>
      )}
    </Stack>
  );
}