import {
  Box,
  Drawer,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerContent,
  Stack,
  Image,
  Link,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tag,
  Avatar,
  Divider
} from "@chakra-ui/react";

import HELogo from "assets/heroes_empires_fa.png";
import { useWallet } from "use-wallet";
import ConnectWalletButton from "components/connectWalletButton/ConnectWalletButton";
import useCustomToast from "hooks/useCustomToast";
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
  const { isConnected, account, reset } = useWallet();
  const toast = useCustomToast();

  return (
    <Stack
      spacing={[0, 5]}
      direction={["column", "row"]}
      justifyContent="center"
      alignItems="center"
      fontWeight="semibold"
    >
      {isConnected() && account ? (
        <Menu>
          <MenuButton as={Avatar} cursor="pointer" size="sm" display={["none", "block"]} />
          <MenuList>
            <MenuItem
              flexDirection="column"
              alignItems="flex-start"
              onClick={() => {
                navigator.clipboard.writeText(account);
                toast.success("Copied!");
              }}
            >
              <Text as="div">Your wallet:</Text>
              <Tag size="sm" bg="primary.100">
                {account}
              </Tag>
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
          <>
            <Divider display={["block", "none"]} />
            <Box display={["block", "none"]} textAlign="center">
              <Link
                pt={4}
                pb={10}
                variant="no-underline"
                display="flex"
                flexDirection="column"
                alignItems="center"
                onClick={() => {
                  navigator.clipboard.writeText(account);
                  toast.success("Copied!");
                }}
              >
                <Text as="div">Your wallet:</Text>
                <Tag size="sm" bg="primary.100">
                  {shorten(account)}
                </Tag>
              </Link>
              <Link
                variant="no-underline"
                height="64px"
                onClick={() => {
                  localStorage.removeItem("walletconnect");
                  reset();
                }}
              >
                Disconnect
              </Link>
            </Box>
          </>
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
              <Image src={HELogo} width={{ sm: "73px", lg: "93px" }} height={{ sm: "60px", lg: "76px" }} />
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
