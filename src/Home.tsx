import { Box, Container, Drawer, DrawerContent, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { DepositProposal } from "components/governance/DepositProposal";
import NewProposal from "components/governance/NewProposal";
import Proposal from "components/governance/Proposal";
import { VoteProposal } from "components/governance/VoteProposal";
import MobileNav from "components/station/MobileNav";
import SidebarContent from "components/station/SidebarContent";
import WrongNetworkPopup from "components/wrongNetwork/WrongNetworkPopup";
import configs from "configs";
import { web3 } from "contracts/contracts";
import Airdrop from "pages/Airdrop";
import Dashboard from "pages/Dashboard";
import GovernancePage from "pages/Governance";
import PrivateClaim from "pages/PrivateClaim";
import Stake from "pages/Stake";
import SwapPage from "pages/SwapPage";
import UserHistories from "pages/UserHistories";
import { useCallback, useEffect } from "react";
import { IconType } from "react-icons";
import { AiOutlineHistory, AiOutlineSwap } from "react-icons/ai";
import { FiCompass, FiGift, FiTrendingUp } from "react-icons/fi";
import { RiGovernmentLine } from "react-icons/ri";
import { Route, Routes } from "react-router-dom";
import { ChainUnsupportedError, useWallet } from "use-wallet";
import Web3 from "web3";
interface LinkItemProps {
  name: string;
  icon: IconType;
  key: string;
}
const LinkItems: Array<LinkItemProps> = [
  // { key: "/", name: "Home", icon: FiHome },
  { key: "/stake", name: "Stake", icon: FiTrendingUp },
  // { key: "/governance", name: "Governance", icon: RiGovernmentLine },
  // { key: "/histories", name: "Histories", icon: AiOutlineHistory },
  // { key: "/private-claim", name: "Strategic Partnerships", icon: FiCompass },
  // { key: "/airdrop", name: "Airdrop", icon: FiGift },
  // { key: "/swap", name: "Swap", icon: AiOutlineSwap },
];

export default function Station() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const wallet = useWallet<any>();

  const { isOpen: isOpenSwitchNetwork, onOpen: onOpenSwitchNetwork, onClose: onCloseSwitchNetwork } = useDisclosure();

  useEffect(() => {
    if ((window?.ethereum as any)?.isConnected()) {
      //@ts-ignore
      wallet.connect();
    }
  }, []);

  function switchEthereumChain(chainId: string) {
    if (window?.ethereum?.request)
      return window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainId }],
      });
  }
  function addEthereumChain(params: any) {
    if (window?.ethereum?.request)
      return window?.ethereum?.request({
        method: "wallet_addEthereumChain",
        params: params,
      });
  }
  const checkNetwork = useCallback(async () => {
    if (wallet.error instanceof ChainUnsupportedError) {
      switchEthereumChain(Web3.utils.numberToHex(configs.CHAIN_ID))
        ?.then(() => {
          //@ts-ignore
          wallet.connect();
        })
        .catch((err) => {
          if (err.code === 4902) {
            addEthereumChain([configs.NETWORK])?.then(
              //@ts-ignore
              wallet.connect()
            );
          }
        });
    }
    if (wallet.ethereum) {
      web3.setProvider(wallet.ethereum);
    }
  }, [wallet]);

  useEffect(() => {
    checkNetwork();
  }, [checkNetwork]);

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent LinkItems={LinkItems} onClose={() => onClose} display={{ base: "none", md: "block" }} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
        colorScheme="primary"
      >
        <DrawerContent textColor="white">
          <SidebarContent LinkItems={LinkItems} onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Container maxW="container.lg" mb={3}>
          <WrongNetworkPopup isOpen={isOpenSwitchNetwork} onClose={onCloseSwitchNetwork} />
          <Routes>
            <Route path="/stake" element={<Stake />} />
            <Route path="/private-claim" element={<PrivateClaim />} />
            <Route path="/airdrop" element={<Airdrop />} />
            <Route path="/swap" element={<SwapPage />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/governance" element={<GovernancePage />} />
            <Route path="/histories" element={<UserHistories />} />
            <Route path="/proposal/new" element={<NewProposal />} />
            <Route path="/proposal/:proposalId" element={<Proposal />} />
            <Route path="/proposal/:proposalId/deposit" element={<DepositProposal />} />
            <Route path="/proposal/:proposalId/vote" element={<VoteProposal />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}
