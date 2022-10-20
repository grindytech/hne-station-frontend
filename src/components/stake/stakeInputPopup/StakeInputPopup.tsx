import {
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useMutation } from "react-query";

import { ReactComponent as HEIcon } from "assets/he_coin.svg";
import NumberInput from "components/numberInput/NumberInput";
import configs from "configs";
import { stakeHE } from "contracts/stake";
import useCustomToast from "hooks/useCustomToast";
import { useConnectWallet } from "hooks/useWallet";
import { ErrorContract } from "types";
import { formatNumber } from "utils/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  stakeableAmount: number;
}

const StakeInputPopup: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  stakeableAmount,
}) => {
  const { ethereum, account } = useConnectWallet();
  const toast = useCustomToast();
  const [value, setValue] = useState<number | string>("");
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate, isLoading } = useMutation(stakeHE, {
    onSuccess: () => {
      toast.success(
        `Stake ${formatNumber(Number(value))} ${
          configs.TOKEN_SYMBOL
        } successfully!`
      );
      setValue("");
      if (errorMsg) {
        setErrorMsg("");
      }
      onSuccess();
      onClose();
    },
    onError: (error: ErrorContract) => {
      if (error.code === 4001) setErrorMsg("Please allow transaction!");
    },
  });

  const onClick = () => {
    if (Number(value) > 0 && !!ethereum) {
      mutate({ poolId: 0, amount: Number(value), address: account || "" });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent mx={3} textAlign="center">
        <ModalHeader>Stake</ModalHeader>
        <ModalCloseButton disabled={isLoading} />
        <ModalBody py="5">
          <FormControl isInvalid={!!errorMsg}>
            <HStack
              color="gray.500"
              fontSize="sm"
              justifyContent="space-between"
              mb="3"
            >
              <Text>Amount</Text>
              <HStack>
                <Text>{formatNumber(stakeableAmount)}</Text>
                <Icon w="20px" h="20px">
                  <HEIcon />
                </Icon>
              </HStack>
            </HStack>
            <NumberInput
              value={value}
              onChange={(value) => setValue(value)}
              max={stakeableAmount}
            />

            <FormErrorMessage mt="0">{errorMsg}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button colorScheme="primary" onClick={onClick} isLoading={isLoading}>
            Stake
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StakeInputPopup;
