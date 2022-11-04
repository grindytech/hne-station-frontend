import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Tag,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react";

import HELogo from "assets/heroes_empires_fa.png";
import ConnectWalletButton from "components/connectWalletButton/ConnectWalletButton";
import { useConnectWallet } from "connectWallet/useWallet";
import useCustomToast from "hooks/useCustomToast";
import { FaMoon, FaQuestion, FaSun } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { getSgvIcon } from "utils/icons";
import { shorten } from "utils/utils";

export type SidebarVariant = "drawer" | "sidebar";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  variant?: SidebarVariant;
}

interface SidebarContentProps {
  onClick: () => void;
}

export const SidebarContent = ({ onClick }: SidebarContentProps) => {
  const { account, reset, networkTextId } = useConnectWallet();
  const toast = useCustomToast();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      fontWeight="semibold"
    >
      {account ? (
        <Menu>
          <MenuButton
            variant="outline"
            colorScheme="primary"
            as={Button}
            leftIcon={
              networkTextId ? (
                <Icon>{getSgvIcon(networkTextId)}</Icon>
              ) : (
                <FaQuestion />
              )
            }
            rightIcon={<FiChevronDown />}
            size="sm"
          >
            {shorten(account, 7, 5)}
          </MenuButton>
          <MenuList p={1} color="primary.500">
            <MenuItem
              onClick={() => {
                navigator.clipboard.writeText(account);
                toast.success("Copied!");
              }}
            >
              <VStack w="full" align="start" spacing={0}>
                <Text as="div">Your wallet:</Text>
                <Tag size="sm">{shorten(account, 8, 5)}</Tag>
              </VStack>
            </MenuItem>
            <MenuItem
              onClick={() => {
                localStorage.removeItem("walletconnect");
                reset();
              }}
            >
              Disconnect
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <ConnectWalletButton />
      )}
      <Button
        _focus={{ border: "none" }}
        variant="ghost"
        onClick={toggleColorMode}
        size="sm"
      >
        {colorMode === "light" ? <Icon as={FaMoon} /> : <Icon as={FaSun} />}
      </Button>
    </Stack>
  );
};

const Sidebar = ({ isOpen, variant = "drawer", onClose }: Props) => {
  return variant === "sidebar" ? (
    <SidebarContent onClick={onClose} />
  ) : (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Box>
              <Image
                src={HELogo}
                width={{ base: "73px", lg: "93px" }}
                height={{ base: "60px", lg: "76px" }}
              />
            </Box>
          </DrawerHeader>
          <DrawerBody>
            <SidebarContent onClick={onClose} />
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default Sidebar;
