import React, { useEffect } from "react";
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
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

import { ReactComponent as Metamask } from "assets/metamask.svg";
import BSC from "assets/bsc.png";
import { useWallet } from "use-wallet";
import configs from "configs";
import Web3 from "web3";
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const WrongNetworkPopup: React.FC<Props> = ({ isOpen, onClose }) => {
  const wallet = useWallet();
  function switchEthereumChain(chainId: string) {
    return wallet.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainId }],
    });
  }
  function addEthereumChain(params: any) {
    return wallet.ethereum.request({
      method: "wallet_addEthereumChain",
      params: params,
    });
  }
  function changeNetwork() {
    switchEthereumChain(String(configs.NETWORK.chainId))
      .then(() => {
        // @ts-ignore
        wallet.connect();
      })
      .catch((err: any) => {
        if (err.code === 4902) {
          addEthereumChain([configs.NETWORK]).then(() => {
            // @ts-ignore
            wallet.connect();
          });
        }
      });
  }
  useEffect(() => {
    if (wallet.ethereum && wallet.chainId === Web3.utils.hexToNumber(configs.NETWORK.chainId)) {
      onClose();
    }
  }, [onClose, wallet]);
  return (
    <>
      {wallet.ethereum && wallet.chainId !== Web3.utils.hexToNumber(configs.NETWORK.chainId) && (
        <Alert status="warning">
          <AlertIcon />
          <AlertTitle>Wrong network!</AlertTitle>
          <AlertDescription>
            Please connect to{" "}
            <Button variant="link" colorScheme="primary" onClick={changeNetwork}>
              Binance Smart Chain
            </Button>
            .
          </AlertDescription>
        </Alert>
      )}
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent textAlign="center">
          <ModalHeader>Wrong network</ModalHeader>
          <ModalCloseButton />
          <ModalBody py="5">
            <Text>Please switch to Binance Smart Chain</Text>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button
              onClick={changeNetwork}
              colorScheme="teal"
              leftIcon={<img width={32} height={32} src={BSC} alt="BSC logo" />}
            >
              Binance Smart Chain
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WrongNetworkPopup;
