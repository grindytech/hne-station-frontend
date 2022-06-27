import { Box, HStack, Stack, Text, Tooltip, VStack } from "@chakra-ui/react";
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
import { colorsUtil, formatDate } from "utils/utils";

export function ProposalItem({ proposal }: { proposal: Proposal }) {
  return (
    <Link to={`/proposal/${proposal.proposalID}`}>
      <Card
        width="full"
        h="full"
        borderWidth={1}
        _hover={{ borderColor: "primary.300", cursor: "pointer" }}
      >
        <CardHeader>
          <HStack mb={2} justifyContent="space-between" w="full">
            <Text fontSize="sm" color="primary.500" colorScheme="primary">
              {proposal.proposalID}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color={colorsUtil.PROPOSAL_STATUS_COLORS[proposal.status]}
            >
              {ProposalStatus[proposal.status]}
            </Text>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack w="full" align="start">
            <Text fontSize="lg" color="primary.600">
              {proposal.title}
            </Text>
            <Tooltip label={formatDate(new Date(proposal.createdAt))}>
              <Text fontSize="sm" color="primary.500" colorScheme="primary">
                Submitted {formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })}
              </Text>
            </Tooltip>
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
            : status === ProposalStatus.AdminRejected
            ? [ProposalStatus.AdminRejected, ProposalStatus.AdminRejectAndBurn]
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
      ) : !data || data?.total === 0 ? (
        <Card>
          <EmptyState
            msg={`No proposals in ${
              status === ProposalStatus.Voting
                ? "voting"
                : status === ProposalStatus.Deposit
                ? "deposit"
                : status === ProposalStatus.Passed
                ? "passed"
                : status === ProposalStatus.Failed
                ? "rejected"
                : status === ProposalStatus.Pending
                ? "pending"
                : ""
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
                w={{ base: "full", md: data?.total === 1 ? "full" : "50%" }}
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
