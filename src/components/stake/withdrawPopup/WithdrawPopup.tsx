import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormErrorMessage,
  ModalFooter,
  Button,
  Text,
  HStack,
  Icon,
  useDisclosure
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useMutation } from "react-query";

import { pendingWithdrawHE } from "contracts/stake";
import useCustomToast from "hooks/useCustomToast";
import { ErrorContract } from "types";
import { formatNumber } from "utils/utils";
import NumberInput from "components/numberInput/NumberInput";
import { ReactComponent as HEIcon } from "assets/he_coin.svg";
import { useWallet } from "use-wallet";

interface Props {
  isOpen: boolean;
  withdrawableAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

const WithdrawPopup: React.FC<Props> = ({ isOpen, withdrawableAmount, onClose, onSuccess }) => {
  const { isConnected, account } = useWallet();
  const toast = useCustomToast();
  const [value, setValue] = useState<number | string>("");
  const [errorMsg, setErrorMsg] = useState("");
  const {isOpen: isOpenInfo, onOpen: onOpenInfo, onClose: onCloseInfo } = useDisclosure();

  const { mutate, isLoading } = useMutation(pendingWithdrawHE, {
    onSuccess: () => {
      toast.success(`Submit withdraw ${formatNumber(Number(value))} HE successfully!`);
      setValue(0);
      if (errorMsg) {
        setErrorMsg("");
      }
      onSuccess();
      onOpenInfo();
    },
    onError: (error: ErrorContract) => {
      if (error.code === 4001) setErrorMsg("Please allow transaction!");
    }
  });

  const onClick = () => {
    if (Number(value) > 0 && isConnected()) {
      mutate({ poolId: 0, amount: Number(value), address: account || "" });
    }
  };

  const onCloseAll = () => {
    onCloseInfo();
    onClose();
  }

  return (<>
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent mx={3} textAlign="center">
        <ModalHeader>Submit Withdraw</ModalHeader>
        <ModalCloseButton disabled={isLoading} />
        <ModalBody py="5">
          <FormControl isInvalid={!!errorMsg}>
            <HStack color="gray.500" fontSize="sm" justifyContent="space-between" mb="3">
              <Text>Amount</Text>
              <HStack>
                <Text>{formatNumber(withdrawableAmount)}</Text>
                <Icon w="20px" h="20px">
                  <HEIcon />
                </Icon>
              </HStack>
            </HStack>
            <NumberInput value={value} onChange={(value) => setValue(value)} max={withdrawableAmount} />
            <FormErrorMessage mt="0">{errorMsg}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button colorScheme="teal" onClick={onClick} isLoading={isLoading}>
            Submit Withdraw
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    <Modal isOpen={isOpenInfo} onClose={onCloseAll} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
        <ModalHeader>Submit Withdraw</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Please wait 3 days before withdrawing HE. After that period, you can withdraw HE to your wallet.</Text>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button colorScheme='teal' mr={3} onClick={onCloseAll}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  </>
  );
};

export default WithdrawPopup;
