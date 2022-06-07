import React, { useCallback, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  VStack,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import { useWallet, ChainUnsupportedError } from "use-wallet";
import RequireWalletPopup from "components/requireWalletPopup/RequireWalletPopup";

import { ReactComponent as Metamask } from "assets/metamask.svg";
import { ReactComponent as Walletconnect } from "assets/walletconnect.svg";
import configs from "configs";

const ConnectWalletButton: React.FC = () => {
  const wallet = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenRequireWallet,
    onOpen: onOpenRequireWallet,
    onClose: onCloseRequireWallet,
  } = useDisclosure();
  useEffect(() => {
    if (wallet.error) {
      onOpenRequireWallet();
      onClose();
    }
  }, [onClose, onOpenRequireWallet, wallet.error]);
  return (
    <>
      <Button onClick={onOpen} colorScheme="primary" variant="outline">
        Connect to wallet
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent mx={3} textAlign="center">
          <ModalHeader>Connect wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody py="5">
            <VStack>
              <Button
                colorScheme="primary"
                variant="outline"
                onClick={async () => {
                  // @ts-ignore
                  await wallet.connect();
                  onClose();
                }}
                w="full"
                leftIcon={
                  <Icon w="32px" h="32px">
                    <Metamask />
                  </Icon>
                }
              >
                Metamask
              </Button>
              <Button
                colorScheme="primary"
                variant="outline"
                onClick={async () => {
                  await wallet.connect("walletconnect");
                  onClose();
                }}
                w="full"
                leftIcon={
                  <Icon w="32px" h="32px">
                    <Walletconnect />
                  </Icon>
                }
              >
                Walletconnect
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      <RequireWalletPopup isOpen={isOpenRequireWallet} onClose={onCloseRequireWallet} />
    </>
  );
};

export default ConnectWalletButton;
