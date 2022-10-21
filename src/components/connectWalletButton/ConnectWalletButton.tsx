import {
  Button,
  ButtonProps,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { ReactComponent as Metamask } from "assets/metamask.svg";
import { ReactComponent as Walletconnect } from "assets/walletconnect.svg";
import RequireWalletPopup from "components/requireWalletPopup/RequireWalletPopup";
import { useConnectWallet, Wallet } from "connectWallet/useWallet";
import React from "react";

const ConnectWalletButton: React.FC<ButtonProps> = (props) => {
  const { connect } = useConnectWallet();
  const { ...rest } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenRequireWallet,
    onOpen: onOpenRequireWallet,
    onClose: onCloseRequireWallet,
  } = useDisclosure();
  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme="primary"
        variant="outline"
        {...rest}
      >
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
                  await connect(Wallet.METAMASK);
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
                  await connect(Wallet.WALLET_CONNECT);
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
      <RequireWalletPopup
        isOpen={isOpenRequireWallet}
        onClose={onCloseRequireWallet}
      />
    </>
  );
};

export default ConnectWalletButton;
