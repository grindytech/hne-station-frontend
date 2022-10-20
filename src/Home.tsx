import {
  Box,
  Container,
  Drawer,
  DrawerContent,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import MobileNav from "components/station/MobileNav";
import SidebarContent from "components/station/SidebarContent";
import BridgePage from "pages/BridgePage";
import Dashboard from "pages/Dashboard";
import Stake from "pages/Stake";
import SwapPage from "pages/SwapPage";
import { IconType } from "react-icons";
import { AiOutlineSwap } from "react-icons/ai";
import { FiTrendingUp } from "react-icons/fi";
import { Route, Routes } from "react-router-dom";
interface LinkItemProps {
  name: string;
  icon: IconType;
  key: string;
}
const LinkItems: Array<LinkItemProps> = [
  { key: "/stake", name: "Stake", icon: FiTrendingUp },
  // { key: "/swap", name: "Swap", icon: AiOutlineSwap },
  { key: "/bridge", name: "Bridge", icon: AiOutlineSwap },
];

export default function Station() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        LinkItems={LinkItems}
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
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
          <SidebarContent LinkItems={LinkItems} onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Container maxW="container.lg" mb={3}>
          <Routes>
            <Route path="/stake" element={<Stake />} />
            <Route path="/swap" element={<SwapPage />} />
            <Route path="/bridge" element={<BridgePage />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}
