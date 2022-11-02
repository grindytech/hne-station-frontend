import {
  Badge,
  Button,
  HStack,
  Icon,
  Link,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import Paginator from "components/paging/Paginator";
import ChooseTokenButton from "components/swap/ChooseTokenButton";
import configs from "configs";
import { formatDistance } from "date-fns";
import numeral from "numeral";
import { useState } from "react";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { useQuery } from "react-query";
import bridgeService from "services/bridge.service";
import { getSgvIcon } from "utils/icons";
import { formatDate, shorten } from "utils/utils";
const TOKENS = ["USDT", "BUSD", "WBNB", "HE", "SKY"];
const CHAINS = ["BSC", "DOS", "AVAX"];
export default function BridgeTransfer() {
  const [sourceToken, setSourceToken] = useState<string>();
  const [sourceChain, setSourceChain] = useState<string>();
  const [desToken, setDesToken] = useState<string>();
  const [desChain, setDesChain] = useState<string>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const size = 10;
  const { data: dataTransfer } = useQuery(
    ["BridgeTransfer", sourceToken, sourceChain, desToken, desChain, page],
    async () => {
      const rsp = await bridgeService.getTransfer({
        destinationNetwork: desChain ? desChain.toLowerCase() : undefined,
        destinationToken: desToken,
        sourceNetwork: sourceChain ? sourceChain.toLowerCase() : undefined,
        sourceToken: sourceToken,
        page,
        size,
        orderBy: "timeStamp",
        desc: "desc",
      });
      setTotalPages(rsp.pages);
      return rsp.items;
    }
  );
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
            Transfer
          </Text>
          <HStack spacing={2} flexWrap="wrap" justify="space-evenly">
            <VStack align="start" spacing={1}>
              <Text fontSize="xs" color="gray.400">
                Source Token
              </Text>
              <ChooseTokenButton
                onChange={(token) => {
                  if (token === "All Tokens") {
                    setSourceToken(undefined);
                  } else setSourceToken(token);
                }}
                buttonProps={{
                  padding: 1,
                  borderRadius: 10,
                }}
                token={sourceToken || "All Tokens"}
                tokens={[
                  { key: "All Tokens" },
                  ...TOKENS.map((t) => ({
                    key: t,
                    icon: getSgvIcon(t),
                  })),
                ]}
              />
            </VStack>
            <VStack align="start" spacing={1}>
              <Text fontSize="xs" color="gray.400">
                Source Network
              </Text>
              <ChooseTokenButton
                onChange={(token) => {
                  if (token === "All Chains") {
                    setSourceChain(undefined);
                  } else setSourceChain(token);
                }}
                buttonProps={{
                  padding: 1,
                  borderRadius: 10,
                }}
                token={sourceChain || "All Chains"}
                tokens={[
                  { key: "All Chains" },
                  ...CHAINS.map((t) => ({
                    key: t,
                    icon: getSgvIcon(t),
                  })),
                ]}
              />
            </VStack>
            <VStack align="start" spacing={1}>
              <Text fontSize="xs" color="gray.400">
                Destination Token
              </Text>
              <ChooseTokenButton
                onChange={(token) => {
                  if (token === "All Tokens") {
                    setDesToken(undefined);
                  } else setDesToken(token);
                }}
                buttonProps={{
                  padding: 1,
                  borderRadius: 10,
                }}
                token={desToken || "All Tokens"}
                tokens={[
                  { key: "All Tokens" },
                  ...TOKENS.map((t) => ({
                    key: t,
                    icon: getSgvIcon(t),
                  })),
                ]}
              />
            </VStack>
            <VStack align="start" spacing={1}>
              <Text fontSize="xs" color="gray.400">
                Destination Network
              </Text>
              <ChooseTokenButton
                onChange={(token) => {
                  if (token === "All Chains") {
                    setDesChain(undefined);
                  } else setDesChain(token);
                }}
                buttonProps={{
                  padding: 1,
                  borderRadius: 10,
                }}
                token={desChain || "All Chains"}
                tokens={[
                  { key: "All Chains" },
                  ...CHAINS.map((t) => ({
                    key: t,
                    icon: getSgvIcon(t),
                  })),
                ]}
              />
            </VStack>
          </HStack>
        </Stack>

        <VStack w="full">
          <TableContainer w="full">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th color="primary.500">Action</Th>
                  <Th color="primary.500">From</Th>
                  <Th color="primary.500">To</Th>
                  <Th color="primary.500">Amount</Th>
                  <Th color="primary.500">Value</Th>
                  <Th color="primary.500">Receiver</Th>
                  <Th color="primary.500">Time</Th>
                </Tr>
              </Thead>
              <Tbody
                color={useColorModeValue("gray.600", "gray.300")}
                fontSize="sm"
              >
                {dataTransfer?.map((item) => (
                  <Tr w="full">
                    <Td>
                      <HStack alignItems="center">
                        <HStack spacing={1}>
                          {/* <Icon w={4} h={4}>
                            {getSgvIcon(item.tokenFromSymbol.toUpperCase())}
                          </Icon> */}
                          <Text>{item.tokenFromSymbol.toUpperCase()}</Text>
                        </HStack>
                        <Icon as={FiArrowRight} />
                        <HStack spacing={1}>
                          {/* <Icon w={4} h={4}>
                            {getSgvIcon(item.tokenToSymbol.toUpperCase())}
                          </Icon> */}
                          <Text>{item.tokenToSymbol.toUpperCase()}</Text>
                        </HStack>
                      </HStack>
                    </Td>
                    <Td>
                      <Button
                        size="xs"
                        onClick={() => {
                          window.open(
                            `${
                              configs.NETWORKS[item.chainFrom.toUpperCase()]
                                ?.blockExplorerUrls[0]
                            }/tx/${item.txFrom}`,
                            "_blank"
                          );
                        }}
                      >
                        <HStack alignItems="center" spacing={1}>
                          <Icon w={4} h={4}>
                            {getSgvIcon(item.chainFrom.toUpperCase())}
                          </Icon>
                          <Text>{item.chainFrom.toUpperCase()}</Text>
                        </HStack>
                      </Button>
                    </Td>
                    <Td>
                      <Button
                        size="xs"
                        onClick={() => {
                          window.open(
                            `${
                              configs.NETWORKS[item.chainTo.toUpperCase()]
                                ?.blockExplorerUrls[0]
                            }/tx/${item.txTo}`,
                            "_blank"
                          );
                        }}
                      >
                        <HStack alignItems="center" spacing={1}>
                          <Icon w={4} h={4}>
                            {getSgvIcon(item.chainTo.toUpperCase())}
                          </Icon>
                          <Text>{item.chainTo.toUpperCase()}</Text>
                        </HStack>
                      </Button>
                    </Td>
                    <Td>{numeral(item.amount).format("0,0.[0000]a")}</Td>
                    <Td>${numeral(item.value).format("0,0.[00]a")}</Td>
                    <Td>
                      <Link
                        target="_blank"
                        href={`${
                          configs.NETWORKS[item.chainTo.toUpperCase()]
                            ?.blockExplorerUrls[0]
                        }/address/${item.to}`}
                      >
                        {shorten(item.to)}
                        <Icon as={FiArrowUpRight} />
                      </Link>
                    </Td>
                    <Td>
                      <Tooltip label={formatDate(new Date(item.timeStamp))}>
                        {formatDistance(new Date(item.timeStamp), Date.now(), {
                          includeSeconds: false,
                          addSuffix: true,
                        })}
                      </Tooltip>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <HStack pt={2} pr={2} w="full" justifyContent="flex-end">
            <Paginator
              onChange={(p) => setPage(p)}
              page={page}
              totalPage={totalPages}
            />
          </HStack>
        </VStack>
      </VStack>
    </Card>
  );
}
