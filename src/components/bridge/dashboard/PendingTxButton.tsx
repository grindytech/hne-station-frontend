import {
  Badge,
  Button,
  HStack,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Progress,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import configs from "configs";
import { formatDistance } from "date-fns";
import {
  Transaction,
  useSessionTxHistories,
} from "hooks/bridge/useSessionTxHistories";
import { FiArrowUpRight } from "react-icons/fi";
export default function PendingTxButton() {
  const { pendingTransactions } = useSessionTxHistories();
  return (
    <>
      <Menu isLazy>
        <MenuButton as={Button} size="sm" variant="outline" colorScheme="cyan">
          {pendingTransactions.length} Pending&nbsp;
          <Spinner size="sm" />
        </MenuButton>
        <MenuList background={useColorModeValue("gray.100", "gray.700")} p={2}>
          <PendingTx />
        </MenuList>
      </Menu>
    </>
  );
}
export function TxInfo({
  tx,
  title,
  msg,
}: {
  tx: Transaction;
  title?: string;
  msg?: string;
}) {
  return (
    <VStack w="full" p={1} spacing={1} align="start">
      {title && (
        <Text
          w="full"
          align="left"
          fontWeight="semibold"
          colorScheme="primary"
          fontSize="md"
        >
          {title}
        </Text>
      )}
      <VStack spacing={0} w="full">
        <HStack w="full" justifyContent="space-between" alignItems="start">
          <Text w="full" fontSize="sm">
            {`${tx.type === "approve" ? "Approve" : "Transfer"} ${tx.amount} ${
              tx.token1
            } from `}
            <Link
              fontWeight="semibold"
              target="_blank"
              href={
                tx.txHash
                  ? `${
                      configs.NETWORKS[tx.chainFrom.toUpperCase()]
                        ?.blockExplorerUrls[0]
                    }/tx/${tx.txHash}`
                  : undefined
              }
            >
              {tx.chainFrom.toUpperCase()}
            </Link>{" "}
            chain{" "}
            {tx.chainTo && (
              <>
                to{" "}
                <Link
                  fontWeight="semibold"
                  target="_blank"
                  href={
                    tx.txHash
                      ? `${
                          configs.NETWORKS[tx.chainTo.toUpperCase()]
                            ?.blockExplorerUrls[0]
                        }/tx/${tx.txHash}`
                      : undefined
                  }
                >
                  {tx.chainTo.toUpperCase()}
                </Link>{" "}
                chain
              </>
            )}
          </Text>
          <Badge
            colorScheme={
              tx.status === "fail" || tx.status === "rejected"
                ? "red"
                : tx.status === "success"
                ? "green"
                : "cyan"
            }
            size="sm"
            fontSize="xs"
          >
            {tx.status}
          </Badge>
        </HStack>
        <HStack w="full" justifyContent="space-between">
          <Link
            fontSize="sm"
            color="gray.400"
            target="_blank"
            href={
              tx.txHash
                ? `${
                    configs.NETWORKS[tx.chainFrom.toUpperCase()]
                      ?.blockExplorerUrls[0]
                  }/tx/${tx.txHash}`
                : undefined
            }
          >
            View transaction
            <Icon as={FiArrowUpRight} />
          </Link>
          <Text fontSize="xs" color="gray.400">
            {formatDistance(new Date(tx.time), Date.now(), {
              includeSeconds: false,
              addSuffix: true,
            })}
          </Text>
        </HStack>
      </VStack>
      {msg && (
        <Text colorScheme="red" fontSize="sm">
          {msg}
        </Text>
      )}
      {(tx.status === "pending" || tx.status === "confirming") && (
        <Progress
          colorScheme="gray"
          w="full"
          size="xs"
          isIndeterminate
          borderRadius={10}
        />
      )}
    </VStack>
  );
}
function PendingTx() {
  const { pendingTransactions } = useSessionTxHistories();
  return (
    <>
      {pendingTransactions.map((tx) => (
        <TxInfo tx={tx} />
      ))}
    </>
  );
}
