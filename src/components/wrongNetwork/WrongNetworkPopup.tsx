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
  const wallet = useWallet<any>();
  const network = configs.DEFAULT_NETWORK();
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
    switchEthereumChain(String(network.chainId))
      .then(() => {
        // @ts-ignore
        wallet.connect();
      })
      .catch((err: any) => {
        if (err.code === 4902) {
          addEthereumChain([network]).then(() => {
            // @ts-ignore
            wallet.connect();
          });
        }
      });
  }
  useEffect(() => {
    if (
      wallet.ethereum &&
      wallet.chainId === Web3.utils.hexToNumber(network.chainId)
    ) {
      onClose();
    }
  }, [onClose, wallet]);
  return (
    <>
      {wallet.ethereum &&
        wallet.chainId !== Web3.utils.hexToNumber(network.chainId) && (
          <Alert status="warning">
            <AlertIcon />
            <AlertTitle>Wrong network!</AlertTitle>
            <AlertDescription>
              Please connect to{" "}
              <Button
                variant="link"
                colorScheme="primary"
                onClick={changeNetwork}
              >
                {network.chainName}
              </Button>
            </AlertDescription>
          </Alert>
        )}
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent textAlign="center">
          <ModalHeader>Wrong network</ModalHeader>
          <ModalCloseButton _focus={{}} />
          <ModalBody py="5">
            <Text>Please switch to {network.chainName}</Text>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button
              onClick={changeNetwork}
              colorScheme="teal"
              leftIcon={<img width={32} height={32} src={BSC} alt="BSC logo" />}
            >
              {network.chainName}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WrongNetworkPopup;
