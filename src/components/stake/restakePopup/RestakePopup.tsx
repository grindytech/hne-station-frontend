import React, { useEffect, useState } from "react";
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
  Text
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "react-query";

import { ErrorContract } from "types";
import { restake } from "contracts/stake";
import useCustomToast from "hooks/useCustomToast";
import { formatNumber } from "utils/utils";
import NumberInput from "components/numberInput/NumberInput";
import { ReactComponent as HEIcon } from "assets/he_coin.svg";
import { useWallet } from "use-wallet";
import { getStakingRewardAmountQueryKey } from "components/stake/Stake";

interface Props {
  isOpen: boolean;
  stakeableAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

const RestakePopup: React.FC<Props> = ({ isOpen, stakeableAmount, onClose, onSuccess }) => {
  const { isConnected, account } = useWallet();
  const toast = useCustomToast();
  const [value, setValue] = useState<number | string>(0);
  const [errorMsg, setErrorMsg] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(restake, {
    onSuccess: () => {
      toast.success(`Restake ${formatNumber(Number(value))} HE successfully!`);
      setValue(0);
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

  useEffect(() => {
    queryClient.invalidateQueries(getStakingRewardAmountQueryKey);
  }, [queryClient]);

  const onClick = () => {
    if (Number(value) > 0 && isConnected()) {
      mutate({ poolId: 0, amount: Number(value), address: account || "" });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent mx={3} textAlign="center">
        <ModalHeader>Restake</ModalHeader>
        <ModalCloseButton disabled={isLoading} />
        <ModalBody py="5">
          <FormControl isInvalid={!!errorMsg}>
            <HStack color="gray.500" fontSize="sm" justifyContent="space-between" mb="3">
              <Text>Amount</Text>
              <HStack>
                <Text>{formatNumber(stakeableAmount)}</Text>
                <Icon w="20px" h="20px">
                  <HEIcon />
                </Icon>
              </HStack>
            </HStack>
            <NumberInput value={value} onChange={(value) => setValue(value)} max={stakeableAmount} />
            <FormErrorMessage mt="0">{errorMsg}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button colorScheme="primary" onClick={onClick} isLoading={isLoading}>
            Restake
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RestakePopup;
