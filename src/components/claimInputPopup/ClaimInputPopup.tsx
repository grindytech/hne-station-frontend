import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Text,
  FormErrorMessage,
  FormControl,
  HStack,
  Icon
} from "@chakra-ui/react";
import { useMutation } from "react-query";

import { claimHE } from "contracts/claim";
import useCustomToast from "hooks/useCustomToast";
import { ErrorContract } from "types";
import { formatNumber } from "utils/utils";
import NumberInput from "components/numberInput/NumberInput";
import { ReactComponent as HEIcon } from "assets/he_coin.svg";
import { useWallet } from "use-wallet";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  claimableAmount: number;
}

const StakeInputPopup: React.FC<Props> = ({ isOpen, onClose, onSuccess, claimableAmount }) => {
  const { isConnected, account } = useWallet();
  const toast = useCustomToast();
  const [value, setValue] = useState<number | string>("");
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate, isLoading } = useMutation(claimHE, {
    onSuccess: () => {
      toast.success(`Claim ${formatNumber(Number(value))} HE successfully!`);
      setValue("");
      if (errorMsg) {
        setErrorMsg("");
      }
      onSuccess();
      onClose();
    },
    onError: (error: ErrorContract) => {
      if (error.code === 4001) setErrorMsg("Please allow transaction!");
    }
  });

  const onClick = () => {
    if (Number(value) > 0 && isConnected()) {
      mutate({  address: account || "" });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent mx={3} textAlign="center">
        <ModalHeader>Claim</ModalHeader>
        <ModalCloseButton disabled={isLoading} />
        <ModalBody py="5">
          <FormControl isInvalid={!!errorMsg}>
            <HStack color="gray.500" fontSize="sm" justifyContent="space-between" mb="3">
              <Text>Amount</Text>
              <HStack>
                <Text>{formatNumber(claimableAmount)}</Text>
                <Icon w="20px" h="20px">
                  <HEIcon />
                </Icon>
              </HStack>
            </HStack>
            <NumberInput value={value} onChange={(value) => setValue(value)} max={claimableAmount} />

            <FormErrorMessage mt="0">{errorMsg}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button colorScheme="teal" onClick={onClick} isLoading={isLoading}>
            Claim
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StakeInputPopup;
