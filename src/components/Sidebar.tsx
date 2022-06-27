import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";

import HELogo from "assets/heroes_empires_fa.png";
import ConnectWalletButton from "components/connectWalletButton/ConnectWalletButton";
import { getHEAccountBalance } from "contracts/contracts";
import useCustomToast from "hooks/useCustomToast";
import { FiChevronDown } from "react-icons/fi";
import { useQuery } from "react-query";
import { useWallet } from "use-wallet";
import { numeralFormat, shorten } from "utils/utils";

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
  const { data: heBalance = 0, isRefetching: heBalanceFetching } = useQuery(
    ["getHEAccountBalance", account],
    async () => {
      const balance = await getHEAccountBalance("HE", account || "");
      return parseInt(String(balance ?? 0));
    },
    {
      enabled: isConnected(),
    }
  );
  return (
    <Stack justifyContent="center" alignItems="center" fontWeight="semibold">
      {isConnected() && account ? (
        <Menu>
          <ButtonGroup color="primary.500" isAttached>
            <Button size="sm">{numeralFormat(heBalance)} HE</Button>
            <MenuButton as={Button} rightIcon={<FiChevronDown />} size="sm">
              {shorten(account, 7, 5)}
            </MenuButton>
          </ButtonGroup>
          <MenuList color="primary.500">
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
