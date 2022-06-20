import {
  HStack,
  Stack,
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
import { useCallback, useEffect, useState } from "react";
import { governanceService } from "services/governance";
import { Deposit } from "services/types/Deposit";
import { Pagination } from "services/types/Pagination";

export default function Depositors({ proposalId }: { proposalId?: string }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Pagination<Deposit>>();
  const [loading, setLoading] = useState(false);
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const d = await governanceService.getDeposits({ proposalId });
      setData(d);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [proposalId, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Card>
      <CardHeader>
        <Text mb={5} fontSize="lg" fontWeight="semibold" color="primary.500">
          Depositors
        </Text>
      </CardHeader>
      <CardBody>
        <Stack w="full">
          {loading ? (
            <Loading />
          ) : !data || data?.total === 0 ? (
            <EmptyState msg="There are no proposer" />
          ) : (
            <VStack w="full">
              <Card>
                <CardBody>
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Depositor</Th>
                          <Th>Amount</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          {data?.items.map((item) => (
                            <>
                              <Td>{item.userAddress}</Td>
                              <Td>{item.amount} HE</Td>
                            </>
                          ))}
                        </Tr>
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
                </CardBody>
              </Card>
            </VStack>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
}
