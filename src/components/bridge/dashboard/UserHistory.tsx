import {
  Box,
  Divider,
  HStack,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import Paginator from "components/paging/Paginator";
import EmptyState from "components/state/EmptyState";
import Loading from "components/state/Loading";
import { useConnectWallet } from "connectWallet/useWallet";
import { useSessionTxHistories } from "hooks/bridge/useSessionTxHistories";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import bridgeService from "services/bridge.service";
import { TxInfo } from "./PendingTxButton";

export default function UserHistory({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { account } = useConnectWallet();
  const size = 7;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { transactions } = useSessionTxHistories();
  const recentTransactions = useMemo(
    () => transactions.filter((tx) => tx.type !== "approve").reverse(),
    [transactions]
  );
  const {
    data: histories,
    refetch,
    isLoading,
  } = useQuery(
    ["UserHistory", account, page],
    async () => {
      const rsp = await bridgeService.getTransfer({
        page,
        size,
        orderBy: "timeStamp",
        desc: "desc",
        from: account,
        getFull: true,
      });
      setTotalPages(rsp.pages);
      return rsp.items;
    },
    {
      enabled: !!account,
    }
  );
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10 * 1e3);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Transactions</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflow="auto">
            <VStack spacing={3} pb={2} w="full" maxH="full" h={600}>
              <VStack w="full">
                {recentTransactions.length > 0 && (
                  <>
                    <Text
                      w="full"
                      align="left"
                      fontSize="md"
                      fontWeight="semibold"
                      padding={1}
                    >
                      Recent Transaction
                    </Text>
                    <List w="full" spacing={3}>
                      {recentTransactions.map((tx, index) => (
                        <>
                          {index !== 0 && <Divider />}
                          <ListItem>
                            <TxInfo tx={tx} />
                          </ListItem>
                        </>
                      ))}
                    </List>
                  </>
                )}
              </VStack>

              <VStack w="full" h="full">
                <Box w="full">
                  {isLoading ? (
                    <Loading />
                  ) : Number(histories?.length) > 0 ? (
                    <>
                      <Text
                        w="full"
                        align="left"
                        fontSize="md"
                        fontWeight="semibold"
                        padding={1}
                      >
                        Transaction
                      </Text>
                      <List w="full" spacing={3} h="full">
                        {histories?.map((tx, index) => (
                          <>
                            {index !== 0 && <Divider />}
                            <ListItem>
                              <TxInfo
                                tx={{
                                  amount: Number(tx.amount),
                                  chainFrom: tx.chainFrom,
                                  chainTo: tx.chainTo || "",
                                  nonce: String(Date.now()),
                                  status: tx.txTo ? "success" : "pending",
                                  time: new Date(tx.timeStamp).getTime(),
                                  token1: tx.tokenFromSymbol,
                                  token2: tx.tokenToSymbol,
                                  txHash: tx.txFrom,
                                  type: "bridge",
                                  // msg: tx.msg
                                  txHashTo: tx.txTo,
                                }}
                              />
                            </ListItem>
                          </>
                        ))}
                      </List>
                    </>
                  ) : (
                    <EmptyState msg="No transaction" />
                  )}
                </Box>
                <HStack p={2} w="full" justifyContent="end">
                  <Paginator
                    onChange={(p) => {
                      setPage(p);
                    }}
                    page={page}
                    totalPage={totalPages}
                  />
                </HStack>
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
