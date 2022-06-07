import React, { useEffect } from "react";
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
} from "@chakra-ui/react";
import { useWallet } from "use-wallet";

import RequireWalletPopup from "components/requireWalletPopup/RequireWalletPopup";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ConnectWalletPopup: React.FC<Props> = ({ isOpen, onClose }) => {
  const wallet = useWallet();
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
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent mx={3} textAlign="center">
          <ModalHeader>Connect wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody py="5">
            <VStack>
              <Button
                colorScheme="primary"
                onClick={() => {
                  // @ts-ignore
                  wallet.connect().then(onClose);
                }}
                w="full"
              >
                Metamask
              </Button>
              <Button
                colorScheme="primary"
                onClick={() => {
                  wallet.connect("walletconnect").then(onClose);
                }}
                w="full"
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

export default ConnectWalletPopup;
