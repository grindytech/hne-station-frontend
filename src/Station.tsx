import {
  Box,
  BoxProps,
  CloseButton,
  Container,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { SidebarContent as NavbarContent } from "components/Sidebar";
import WrongNetworkPopup from "components/wrongNetwork/WrongNetworkPopup";
import configs from "configs";
import { web3 } from "contracts/contracts";
import Airdrop from "pages/Airdrop";
import HomePage from "pages/Home";
import PrivateClaim from "pages/PrivateClaim";
import Stake from "pages/Stake";
import SwapPage from "pages/SwapPage";
import React, { ReactText, useCallback, useEffect, useState } from "react";
import { IconType } from "react-icons";
import { FiArrowDownCircle, FiCompass, FiGift, FiHome, FiMenu, FiTrendingUp } from "react-icons/fi";
import { useWallet } from "use-wallet";
import Web3 from "web3";
interface LinkItemProps {
  name: string;
  icon: IconType;
  key: string;
}
const LinkItems: Array<LinkItemProps> = [
  { key: "home", name: "Home", icon: FiHome },
  { key: "stake", name: "Stake", icon: FiTrendingUp },
  { key: "private-claim", name: "Strategic Partnerships", icon: FiCompass },
  { key: "airdrop", name: "Airdrop", icon: FiGift },
  { key: "swap", name: "Swap", icon: FiArrowDownCircle },
];

export default function Station() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tab, setTab] = useState("home");
  const wallet = useWallet();

  const {
    isOpen: isOpenSwitchNetwork,
    onOpen: onOpenSwitchNetwork,
    onClose: onCloseSwitchNetwork,
  } = useDisclosure();
  const switchChain = useCallback(() => {
    if (wallet.chainId !== Web3.utils.hexToNumber(configs.NETWORK.chainId) && wallet.ethereum) {
      onOpenSwitchNetwork();
    }
  }, [onOpenSwitchNetwork, wallet]);
  useEffect(switchChain, [switchChain]);
  useEffect(() => {
    if (wallet.ethereum) {
      web3.setProvider(wallet.ethereum);
    }
    window.addEventListener("error", switchChain);
    return () => {
      window.removeEventListener("error", switchChain);
    };
  }, [switchChain, wallet]);
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onLinkClick={(key) => setTab(key)}
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
        activeKey={tab}
      />
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
          <SidebarContent
            activeKey={tab}
            onLinkClick={(key) => {
              setTab(key);
              onClose();
            }}
            onClose={onClose}
          />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Container maxW="container.lg" mb={3}>
          <WrongNetworkPopup isOpen={isOpenSwitchNetwork} onClose={onCloseSwitchNetwork} />
          {tab === "stake" ? (
            <Stake />
          ) : tab === "private-claim" ? (
            <PrivateClaim />
          ) : tab === "airdrop" ? (
            <Airdrop />
          ) : tab === "swap" ? (
            <SwapPage />
          ) : (
            <HomePage />
          )}
        </Container>
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  onLinkClick: (key: string) => void;
  activeKey?: string;
}

const SidebarContent = ({ onLinkClick, onClose, activeKey, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("primary.600", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text color={"white"} fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          HE Station
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          key={link.key}
          icon={link.icon}
          onClick={() => {
            onLinkClick(link.key);
          }}
          isActive={activeKey === link.key}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  isActive?: boolean;
}
const NavItem = ({ icon, children, isActive = false, ...rest }: NavItemProps) => {
  return (
    <Link
      href="#"
      style={{ textDecoration: "none" }}
      // fontFamily="sans-serif"
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        color={"gray.100"}
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "primary.500",
          color: "white",
        }}
        __css={isActive ? { fontWeight: "bold" } : {}}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        HE Station
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        {/* <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />} /> */}
        <Flex alignItems={"center"}>
          <Menu>
            <NavbarContent onClick={() => {}} />
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
