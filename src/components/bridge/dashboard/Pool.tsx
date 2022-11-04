import {
  Box, HStack,
  Icon,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import Card from "components/card/Card";
import EmptyState from "components/state/EmptyState";
import Loading from "components/state/Loading";
import configs from "configs";
import { getErc20Balance } from "contracts/bridge";
import numeral from "numeral";
import { useQuery } from "react-query";
import bridgeService from "services/bridge.service";
import { CHAIN_COLOR_SCHEMA } from "utils/colors";
import { getSgvIcon } from "utils/icons";



const PoolBalance = ({ token, chain }: { token: string; chain: string }) => {
  const account = configs.BRIDGE[chain].CONTRACTS.POOL;
  const { data: balance,isLoading } = useQuery(
    ["PoolBalance", token, chain, account],
    async () => {
      if (!account) return 0;
      const tokenConfig = configs.BRIDGE[chain.toUpperCase()].TOKENS[token];
      const balance = await getErc20Balance(
        account,
        tokenConfig.contract,
        chain,
        tokenConfig.decimal
      );
      return balance;
    },
    { enabled: !!account }
  );
  return (
    <Skeleton isLoaded={!isLoading}>
      <Box>{numeral(balance).format("0,0.[00]a")}</Box>
    </Skeleton>
  );
};

export default function BridgePool() {
  const { data, isLoading } = useQuery("BridgePool", async () => {
    const rsp = await bridgeService.getToken24HVolume();
    return rsp.items;
  });
  const textColor = useColorModeValue("gray.600", "gray.300");
  return (
    <Card w="full">
      <VStack w="full" spacing={5}>
        <Stack
          direction={{ base: "column", md: "row" }}
          w="full"
          justifyContent="space-between"
          alignItems="start"
          spacing={2}
        >
          <Text fontSize="sm" color="primary.500">
            Pools
          </Text>
        </Stack>
        <VStack w="full">
          {isLoading ? (
            <Loading />
          ) : Number(data?.length) > 0 ? (
            <TableContainer w="full">
              <Table variant="simple" w="full">
                <Thead>
                  <Tr>
                    <Th color="primary.500">Token</Th>
                    <Th color="primary.500">Network</Th>
                    <Th color="primary.500">Balance</Th>
                    <Th color="primary.500">24H Volume</Th>
                  </Tr>
                </Thead>
                <Tbody color={textColor} fontSize="sm">
                  {data
                    ?.filter((i) => !!configs.BRIDGE[i.chainId.toUpperCase()])
                    .map((item) => (
                      <Tr w="full">
                        <Td>
                          <HStack alignItems="center" spacing={1}>
                            <Icon w={4} h={4}>
                              {getSgvIcon(item.symbol)}
                            </Icon>
                            <Text>{item.symbol}</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <Tag
                            colorScheme={
                              CHAIN_COLOR_SCHEMA[item.chainId] || "cyan"
                            }
                          >
                            <HStack alignItems="center" spacing={1}>
                              <Icon w={4} h={4}>
                                {getSgvIcon(item.chainId.toUpperCase())}
                              </Icon>
                              <Text>{item.chainId.toUpperCase()}</Text>
                            </HStack>
                          </Tag>
                        </Td>
                        <Td>
                          <PoolBalance
                            chain={item.chainId.toUpperCase()}
                            token={item.symbol}
                          />
                        </Td>
                        <Td>
                          {item.volume
                            ? "$" + numeral(item.volume).format("0,0.[00]a")
                            : "-"}
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <EmptyState msg="No result found" />
          )}
          {/* <HStack pt={2} pr={2} w="full" justifyContent="flex-end">
            <Paginator
              onChange={(p) => setPage(p)}
              page={page}
              totalPage={totalPages}
            />
          </HStack> */}
        </VStack>
      </VStack>
    </Card>
  );
}
