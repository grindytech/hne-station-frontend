import {
  Button,
  HStack,
  Icon,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import CardBody from "components/card/CardBody";
import CardHeader from "components/card/CardHeader";
import Paginator from "components/paging/Paginator";
import EmptyState from "components/state/EmptyState";
import Loading from "components/state/Loading";
import configs from "configs";
import { getDAOContract } from "contracts/contracts";
import { getProposal, ProposalOnchain } from "contracts/governance";
import { useCallback, useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { useQuery } from "react-query";
import { governanceService } from "services/governance";
import { Pagination } from "services/types/Pagination";
import { Vote } from "services/types/Vote";
import { VoteType } from "services/types/VoteType";
import { numeralFormat, shorten } from "utils/utils";

export function Voters({ proposalId }: { proposalId: string }) {
  const [voteType, setVoteType] = useState<VoteType>(VoteType.Pass);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Pagination<Vote>>();
  const [loading, setLoading] = useState(false);
  const { data: proposal } = useQuery(
    ["getProposal1", proposalId],
    async () => {
      return await getProposal(getDAOContract(Number(proposalId)), String(proposalId));
    },
    { enabled: !!proposalId }
  );
  const totalVotes = useCallback(
    () =>
      Number(proposal?.votesFail) / 1e18 +
      Number(proposal?.votesPassed) / 1e18 +
      Number(proposal?.votesVeto) / 1e18,
    [proposal]
  );
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const d = await governanceService.getVoters({ proposalId, type: voteType, page, size: 5 });
      setData(d);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [proposalId, page, voteType]);

  const { data: countYes } = useQuery(
    ["countYes", proposalId],
    async () => {
      const d = await governanceService.getVoters({ proposalId, type: VoteType.Pass, size: 0 });
      return d.total;
    },
    {
      enabled: !!proposalId,
    }
  );
  const { data: countNo } = useQuery(
    ["countNo", proposalId],
    async () => {
      const d = await governanceService.getVoters({ proposalId, type: VoteType.Fail, size: 0 });
      return d.total;
    },
    {
      enabled: !!proposalId,
    }
  );
  const { data: countVeto } = useQuery(
    ["countVeto", proposalId],
    async () => {
      const d = await governanceService.getVoters({ proposalId, type: VoteType.Veto, size: 0 });
      return d.total;
    },
    {
      enabled: !!proposalId,
    }
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Card>
      <CardHeader>
        <Text mb={5} fontSize="lg" fontWeight="semibold" color="primary.500">
          Voters
        </Text>
      </CardHeader>
      <CardBody>
        <VStack w="full" spacing={5}>
          <HStack w="full" px={5}>
            <Button
              // fontFamily="mono"
              colorScheme="primary"
              size="sm"
              onClick={() => {
                setVoteType(VoteType.Pass);
              }}
              variant={voteType === VoteType.Pass ? "solid" : "ghost"}
            >
              Yes({countYes})
            </Button>
            <Button
              // fontFamily="mono"
              colorScheme="primary"
              size="sm"
              onClick={() => {
                setVoteType(VoteType.Fail);
              }}
              variant={voteType === VoteType.Fail ? "solid" : "ghost"}
            >
              No({countNo})
            </Button>
            <Button
              colorScheme="primary"
              size="sm"
              onClick={() => {
                setVoteType(VoteType.Veto);
              }}
              variant={voteType === VoteType.Veto ? "solid" : "ghost"}
            >
              No with veto({countVeto})
            </Button>
          </HStack>
          {loading ? (
            <Loading />
          ) : !data || data?.total === 0 ? (
            <EmptyState msg="There are no voters" />
          ) : (
            <VStack w="full">
              <TableContainer w="full">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th color="primary.500">Voter</Th>
                      <Th color="primary.500">Voting power</Th>
                    </Tr>
                  </Thead>
                  <Tbody color="primary.400" fontSize="sm">
                    {data?.items.map((item) => (
                      <Tr>
                        <Td>
                          <Link
                            target="_blank"
                            href={`${configs.BSC_SCAN}/address/${item.userAddress}`}
                          >
                            {shorten(item.userAddress)}
                            <Icon as={FiArrowUpRight} />
                          </Link>
                        </Td>
                        <Td>{numeralFormat((item.amount / totalVotes()) * 100)}%</Td>
                      </Tr>
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
