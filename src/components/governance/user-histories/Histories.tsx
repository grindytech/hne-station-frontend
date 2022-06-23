import {
  Badge,
  Button,
  ButtonGroup,
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
import configs from "configs";
import { formatDistance } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { governanceService } from "services/governance";
import { Deposit } from "services/types/Deposit";
import { Pagination } from "services/types/Pagination";
import { ProposalStatus } from "services/types/ProposalStatus";
import { Vote } from "services/types/Vote";
import { VoteType } from "services/types/VoteType";
import { useWallet } from "use-wallet";
import { formatDate, numeralFormat, shorten } from "utils/utils";

function HistoryRow({ item, type }: { item: Deposit | Vote; type: "vote" | "deposit" }) {
  return (
    <Tr w="full">
      <Td>
        <Link target="_blank" href={`${configs.BSC_SCAN}/tx/${item.txHash}`}>
          {shorten(item.txHash)}
          <Icon as={FiArrowUpRight} />
        </Link>
      </Td>
      <Td>
        <Link target="_blank" href={`/proposal/${item.proposalID}`}>
          {item.proposal?.title}
          <Icon as={FiArrowUpRight} />
        </Link>
      </Td>
      <Td>{numeralFormat(Number(item.amount))}</Td>
      {type === "vote" && (
        <Td color="primary.500">
          <Badge
            borderRadius={25}
            colorScheme={
              (item as Vote).type === VoteType.Pass
                ? "green"
                : (item as Vote).type === VoteType.Fail
                ? "red"
                : "orange"
            }
          >
            {ProposalStatus[(item as Vote).type]}
          </Badge>
        </Td>
      )}
      <Td>
        {item?.createdAt && (
          <Tooltip label={formatDate(new Date(item?.createdAt))}>
            {formatDistance(new Date(item?.createdAt), Date.now(), {
              includeSeconds: false,
              addSuffix: true,
            })}
          </Tooltip>
        )}
      </Td>
    </Tr>
  );
}

export default function Histories() {
  const { account } = useWallet();
  const [type, setType] = useState<"vote" | "deposit">("vote");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Pagination<Deposit | Vote>>();
  const [loading, setLoading] = useState(false);
  const fetchData = useCallback(async () => {
    try {
      if (!account) return;
      setLoading(true);
      const d =
        type === "deposit"
          ? await governanceService.getDeposits({
              userAddress: String(account),
              page,
              size: 5,
              desc: "desc",
            })
          : await governanceService.getVotes({
              userAddress: String(account),
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
  }, [account, type, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <Card>
      <CardHeader>
        <Text mb={5} fontSize="lg" fontWeight="semibold" color="primary.500">
          Histories
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
                  if (type === "deposit") {
                    setPage(1);
                  }
                  setType("vote");
                }}
                variant={type === "vote" ? "solid" : "ghost"}
              >
                Votes
              </Button>
              <Button
                fontFamily="mono"
                colorScheme="primary"
                size="sm"
                onClick={() => {
                  if (type === "vote") {
                    setPage(1);
                  }
                  setType("deposit");
                }}
                variant={type === "deposit" ? "solid" : "ghost"}
              >
                Deposits
              </Button>
            </ButtonGroup>
          </HStack>
          {loading ? (
            <Loading />
          ) : !data || data?.total === 0 ? (
            <EmptyState msg="No results found" />
          ) : (
            <VStack w="full">
              <TableContainer w="full">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th color="primary.500">Tx hash</Th>
                      <Th color="primary.500">Proposal</Th>
                      <Th color="primary.500">{type === "vote" ? "Power voting" : "Amount(HE)"}</Th>
                      {type === "vote" && <Th color="primary.500">Vote option</Th>}
                      <Th color="primary.500">Time</Th>
                    </Tr>
                  </Thead>
                  <Tbody color="primary.400" fontSize="sm">
                    {data?.items.map((item) => (
                      <HistoryRow item={item} type={type} />
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
