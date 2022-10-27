import {
  Box,
  Button,
  ButtonGroup,
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
} from "@chakra-ui/react";

import HELogo from "assets/heroes_empires_fa.png";
import ConnectWalletButton from "components/connectWalletButton/ConnectWalletButton";
import useCustomToast from "hooks/useCustomToast";
import { useConnectWallet } from "connectWallet/useWallet";
import { useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { shorten } from "utils/utils";
import { FaMoon, FaSun } from "react-icons/fa";

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
  const { account, reset, networkName } = useConnectWallet();
  const toast = useCustomToast();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      fontWeight="semibold"
    >
      <Button
        _focus={{ border: "none" }}
        variant="ghost"
        onClick={toggleColorMode}
      >
        {colorMode === "light" ? <Icon as={FaMoon} /> : <Icon as={FaSun} />}
      </Button>
      {account ? (
        <Menu>
          <ButtonGroup color="primary.500" isAttached>
            <Button size="sm">{networkName}</Button>
            <MenuButton as={Button} rightIcon={<FiChevronDown />} size="sm">
              {shorten(account, 7, 5)}
            </MenuButton>
          </ButtonGroup>
          <MenuList p={1} color="primary.500">
            <MenuItem
              flexDirection="column"
              alignItems="flex-start"
              onClick={() => {
                navigator.clipboard.writeText(account);
                toast.success("Copied!");
              }}
            >
              <Text as="div">Your wallet:</Text>
              <Tag size="sm">{account}</Tag>
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
