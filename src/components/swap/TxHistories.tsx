import {
  Badge,
  Button,
  HStack,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import configs from "configs";
import { AiOutlineHistory } from "react-icons/ai";
import { FiArrowUpRight, FiDelete } from "react-icons/fi";

export type Transaction = {
  txHash: string;
  type: "swap" | "approve";
  status: "pending" | "success" | "fail" | "rejected";
  token1: string;
  token2: string;
  amount: number;
};

export default function TxHistories({
  histories,
  onClear,
}: {
  histories: Transaction[];
  onClear: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Link onClick={onOpen} color={"gray.500"} variant="link" _focus={{ border: "none" }}>
        <AiOutlineHistory display="inline-block" />
      </Link>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent textAlign="center">
          <ModalHeader>Recent Transactions</ModalHeader>
          <ModalCloseButton _focus={{ border: "none" }} />
          <ModalBody py="5">
            {histories.length <= 0 ? (
              <Text color="gray.400">No recent transactions</Text>
            ) : (
              <VStack>
                <HStack paddingX={5} w="full" justifyContent="space-between">
                  <Text color="gray" fontSize="sm" fontWeight="semibold">
                    {histories.length} transactions
                  </Text>
                  <Button size="sm" rightIcon={<FiDelete />} onClick={onClear} variant="outline">
                    Clear all
                  </Button>
                </HStack>
                <VStack w="full" padding={5}>
                  {histories.reverse().map((h) => (
                    <HStack key={h.txHash} w="full" justifyContent="space-between">
                      <Link
                        target={h.txHash ? "_blank" : ""}
                        href={
                          h.txHash ? `${configs.NETWORK.blockExplorerUrls}/tx/${h.txHash}` : "#"
                        }
                        display={"flex"}
                      >
                        {h.type === "approve"
                          ? `Approve ${h.token1} token`
                          : `Swap ${h.amount} ${h.token1} to ${h.token2}`}
                        <FiArrowUpRight />
                      </Link>
                      <Badge
                        borderRadius={25}
                        colorScheme={
                          h.status === "pending"
                            ? "green"
                            : h.status === "success"
                            ? "green"
                            : "red"
                        }
                        variant={
                          h.status === "pending"
                            ? "outline"
                            : h.status === "success"
                            ? "solid"
                            : "subtle"
                        }
                      >
                        {h.status}
                      </Badge>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
