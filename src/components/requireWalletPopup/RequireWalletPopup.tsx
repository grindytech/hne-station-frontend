import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Icon,
  Text
} from "@chakra-ui/react";

import { ReactComponent as Metamask } from "assets/metamask.svg";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const RequireWalletPopup: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent textAlign="center">
        <ModalHeader>No Wallet detected</ModalHeader>
        <ModalCloseButton />
        <ModalBody py="5">
          <Text>You should consider to use MetaMask</Text>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button
            colorScheme="teal"
            leftIcon={
              <Icon w="32px" h="32px">
                <Metamask />
              </Icon>
            }
          >
            Get Metamask
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RequireWalletPopup;
