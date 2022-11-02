import {
  Box,
  Container,
  Drawer,
  DrawerContent,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import NavBar from "components/station/NavBar";
import SidebarContent from "components/station/SidebarContent";
import BridgePage from "pages/BridgePage";
import Dashboard from "pages/Dashboard";
import { IconType } from "react-icons";
import { FiActivity, FiRepeat } from "react-icons/fi";
import { Route, Routes } from "react-router-dom";
interface LinkItemProps {
  name: string;
  icon: IconType;
  key: string;
}
const LinkItems: Array<LinkItemProps> = [
  // { key: "/stake", name: "Stake", icon: FiTrendingUp },
  // { key: "/swap", name: "Swap", icon: AiOutlineSwap },
  { key: "/", name: "Overview", icon: FiActivity },
  { key: "/bridge", name: "Bridge", icon: FiRepeat },
];

export default function Station() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue("bg.light", "gray.800")}>
      <SidebarContent
        background={useColorModeValue("gray.50", "gray.700")}
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
        <DrawerContent>
          <SidebarContent
            transition="3s ease"
            LinkItems={LinkItems}
            onClose={onClose}
          />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <NavBar bg="transparent" borderBottomWidth={0} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Container maxW="container.lg" mb={3}>
          <Routes>
            {/* <Route path="/stake" element={<Stake />} /> */}
            {/* <Route path="/swap" element={<SwapPage />} /> */}
            <Route path="/bridge" element={<BridgePage />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}
