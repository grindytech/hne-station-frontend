import {
  Badge,
  Box,
  Button,
  Flex,
  FlexProps,
  HStack,
  IconButton,
  Menu,
  Spinner,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import PendingTxButton from "components/bridge/dashboard/PendingTxButton";
import { SidebarContent as NavbarContent } from "components/Sidebar";
import { useSessionTxHistories } from "hooks/bridge/useSessionTxHistories";
import { FiMenu } from "react-icons/fi";

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const NavBar = ({ onOpen, ...rest }: MobileProps) => {
  const { pendingTransactions } = useSessionTxHistories();
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="space-between"
      {...rest}
    >
      <HStack>
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
        />
      </HStack>

      <HStack spacing={{ base: "0", md: "6" }}>
        {/* <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />} /> */}
        {pendingTransactions.length > 0 && <PendingTxButton />}
        <Flex alignItems={"center"}>
          <Menu>
            <NavbarContent onClick={() => {}} />
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default NavBar;
