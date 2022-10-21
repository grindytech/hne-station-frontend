import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";

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
  useDisclosure,
} from "@chakra-ui/react";

import { ReactComponent as HEIcon } from "assets/he_coin.svg";
import NumberInput from "components/numberInput/NumberInput";
import { getStakingRewardAmountQueryKey } from "components/stake/Stake";
import configs from "configs";
import { pendingClaimHE } from "contracts/stake";
import useCustomToast from "hooks/useCustomToast";
import { useConnectWallet } from "connectWallet/useWallet";
import { ErrorContract } from "types";
import { formatNumber } from "utils/utils";

interface Props {
  isOpen: boolean;
  claimableAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

const ClaimPopup: React.FC<Props> = ({
  isOpen,
  claimableAmount,
  onClose,
  onSuccess,
}) => {
  const { ethereum, account } = useConnectWallet();
  const toast = useCustomToast();
  const [value, setValue] = useState<number | string>("");
  const [errorMsg, setErrorMsg] = useState("");
  const {
    isOpen: isOpenInfo,
    onOpen: onOpenInfo,
    onClose: onCloseInfo,
  } = useDisclosure();

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(pendingClaimHE, {
    onSuccess: () => {
      toast.success(
        `Submit claim ${formatNumber(Number(value))} ${
          configs.TOKEN_SYMBOL
        } successfully!`
      );
      setValue(0);
      if (errorMsg) {
        setErrorMsg("");
      }
      onSuccess();
      onOpenInfo();
    },
    onError: (error: ErrorContract) => {
      if (error.code === 4001) setErrorMsg("Please allow transaction!");
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries(getStakingRewardAmountQueryKey);
  }, [queryClient]);

  const onClick = () => {
    if (Number(value) > 0 && !!ethereum) {
      mutate({ poolId: 0, amount: Number(value), address: account || "" });
    }
  };

  const onCloseAll = () => {
    onCloseInfo();
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent mx={3} textAlign="center">
          <ModalHeader>Submit Claim</ModalHeader>
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
                  <Icon w="1em" h="1em">
                    <HEIcon />
                  </Icon>
                  <Text>{formatNumber(claimableAmount)}</Text>
                </HStack>
              </HStack>
              <NumberInput
                value={value}
                onChange={(value) => setValue(value)}
                max={claimableAmount}
              />
              <FormErrorMessage mt="0">{errorMsg}</FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button
              colorScheme="primary"
              onClick={onClick}
              isLoading={isLoading}
            >
              Submit Claim
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpenInfo}
        onClose={onCloseAll}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit Claim</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Please wait 3 days before claiming {configs.TOKEN_SYMBOL}. After
              that period, you can withdraw {configs.TOKEN_SYMBOL} to your
              wallet.
            </Text>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button colorScheme="teal" mr={3} onClick={onCloseAll}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ClaimPopup;
