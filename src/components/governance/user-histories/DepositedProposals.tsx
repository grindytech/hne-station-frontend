import {
  Button,
  ButtonGroup,
  HStack,
  Icon,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import CardBody from "components/card/CardBody";
import CardHeader from "components/card/CardHeader";
import Paginator from "components/paging/Paginator";
import EmptyState from "components/state/EmptyState";
import Loading from "components/state/Loading";
import { hasWithdrawn, withdrawal } from "contracts/governance";
import { formatDistance } from "date-fns";
import useCustomToast from "hooks/useCustomToast";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineFire } from "react-icons/ai";
import { FiArrowUpRight } from "react-icons/fi";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { governanceService } from "services/governance";
import { Pagination } from "services/types/Pagination";
import { Proposal } from "services/types/Proposal";
import { ProposalStatus } from "services/types/ProposalStatus";
import { useWallet } from "use-wallet";
import { formatDate, numeralFormat } from "utils/utils";

function HistoryRow({ proposal }: { proposal: Proposal }) {
  const [loading, setLoading] = useState(false);
  const toast = useCustomToast();
  const {
    data: isClaimed,
    refetch: hasWithdrawnFetch,
    isRefetching: hasWithdrawnFetching,
  } = useQuery(
    ["hasWithdrawn", proposal.proposalID, proposal.userAddress, proposal.status],
    async () => hasWithdrawn(String(proposal.userAddress), proposal.proposalID),
    {
      enabled:
        proposal.status === ProposalStatus.Passed || proposal.status === ProposalStatus.Failed,
    }
  );
  const claim = async () => {
    try {
      setLoading(true);
      await withdrawal(proposal.proposalID, String(proposal.userAddress));
      toast.error("Transaction successfully");
      hasWithdrawnFetch();
    } catch (error) {
      console.error(error);
      toast.error("Transaction fail");
    } finally {
      setLoading(true);
    }
  };
  return (
    <Tr>
      <Td>{proposal.proposalID}</Td>
      <Td>
        <Link target="_blank" to={`/proposal/${proposal.proposalID}`}>
          {proposal.title}
          <Icon as={FiArrowUpRight} />
        </Link>
      </Td>
      <Td>
        {proposal?.blockTime && (
          <Tooltip label={formatDate(new Date(proposal?.blockTime))}>
            {formatDistance(new Date(proposal?.blockTime), Date.now(), {
              includeSeconds: false,
              addSuffix: true,
            })}
          </Tooltip>
        )}
      </Td>
      <Td>{numeralFormat(Number(proposal.amount))}</Td>

      {(proposal.status === ProposalStatus.Passed || proposal.status === ProposalStatus.Failed) && (
        <Td>
          <Skeleton isLoaded={!hasWithdrawnFetching}>
            <Button
              onClick={claim}
              colorScheme="primary"
              disabled={!!isClaimed || loading}
              isLoading={loading}
              size="xs"
            >
              {isClaimed ? "Claimed" : "Claim"}
            </Button>
          </Skeleton>
        </Td>
      )}
      {(proposal.status === ProposalStatus.Rejected || proposal.status === ProposalStatus.Veto) && (
        <Td>
          <Button
            _hover={{}}
            _focus={{}}
            _active={{}}
            cursor="default"
            size="xs"
            colorScheme="orange"
            variant="outline"
            leftIcon={<Icon as={AiOutlineFire} />}
          >
            {ProposalStatus[proposal.status]}
          </Button>
        </Td>
      )}
    </Tr>
  );
}

export default function DepositedProposals() {
  const { account } = useWallet();
  const [status, setStatus] = useState<ProposalStatus>(ProposalStatus.Passed);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Pagination<Proposal>>();
  const [loading, setLoading] = useState(false);
  const fetchData = useCallback(async () => {
    try {
      if (!account) return;
      setLoading(true);
      const d = await governanceService.getDepositedProposals({
        userAddress: String(account),
        status:
          status === ProposalStatus.Rejected
            ? [ProposalStatus.Rejected, ProposalStatus.Veto]
            : [status],
        page,
        size: 5,
        desc: "desc",
      });
      setData(d);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [account, status, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Card>
      <CardHeader>
        <Text mb={5} fontSize="lg" fontWeight="semibold" color="primary.500">
          Deposited proposals
        </Text>
      </CardHeader>
      <CardBody>
        <VStack w="full" spacing={5}>
          <HStack padding={5} overflow="auto" spacing={5} w="full">
            <ButtonGroup>
              <Button
                fontFamily="mono"
                colorScheme="primary"
                size="sm"
                onClick={() => {
                  setStatus(ProposalStatus.Passed);
                }}
                variant={status === ProposalStatus.Passed ? "solid" : "ghost"}
              >
                Passed
              </Button>
              <Button
                fontFamily="mono"
                colorScheme="primary"
                size="sm"
                onClick={() => {
                  setStatus(ProposalStatus.Failed);
                }}
                variant={status === ProposalStatus.Failed ? "solid" : "ghost"}
              >
                Failed
              </Button>
              <Button
                fontFamily="mono"
                colorScheme="primary"
                size="sm"
                onClick={() => {
                  setStatus(ProposalStatus.Voting);
                }}
                variant={status === ProposalStatus.Voting ? "solid" : "ghost"}
              >
                Voting
              </Button>
              <Button
                fontFamily="mono"
                colorScheme="primary"
                size="sm"
                onClick={() => {
                  setStatus(ProposalStatus.Deposit);
                }}
                variant={status === ProposalStatus.Deposit ? "solid" : "ghost"}
              >
                Deposit
              </Button>
              <Button
                fontFamily="mono"
                colorScheme="primary"
                size="sm"
                onClick={() => {
                  setStatus(ProposalStatus.Rejected);
                }}
                variant={status === ProposalStatus.Rejected ? "solid" : "ghost"}
              >
                Rejected
              </Button>
            </ButtonGroup>
          </HStack>
          {loading ? (
            <Loading />
          ) : !data || data?.total === 0 ? (
            <EmptyState msg="No results found" />
          ) : (
            <VStack w="full" overflow="auto">
              <TableContainer w="full">
                <Table w="full" overflow="visible" variant="simple">
                  <Thead>
                    <Tr>
                      <Th color="primary.500">Id</Th>
                      <Th color="primary.500">Proposal</Th>
                      <Th color="primary.500">Submitted</Th>
                      <Th color="primary.500">Total deposit(HE)</Th>
                      {(status === ProposalStatus.Passed ||
                        status === ProposalStatus.Failed ||
                        status === ProposalStatus.Rejected) && <Th color="primary.500"></Th>}
                    </Tr>
                  </Thead>
                  <Tbody color="primary.400" fontSize="sm">
                    {data?.items.map((item) => (
                      <HistoryRow proposal={item} />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              <HStack pt={2} pr={2} w="full" justifyContent="flex-end">
                <Paginator
                  onChange={(p) => setPage(p)}
                  page={page}
                  totalPage={Math.ceil(Number(data?.total) / Number(data?.size))}
                />
              </HStack>
            </VStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
