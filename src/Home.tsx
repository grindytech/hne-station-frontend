import {
  HStack,
  Image,
  VStack,
  IconButton,
  useBreakpointValue,
  Link,
  Icon,
  Text,
  Stack,
  Heading,
  Skeleton,
  Container,
  Wrap,
  Button,
} from "@chakra-ui/react";
import { mdiGithub, mdiMenu } from "@mdi/js";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { getDaysInMonth } from "date-fns";

import Sidebar, { SidebarVariant } from "components/Sidebar";
import Claim from "components/claim/Claim";
import HEStats from "components/heStats/HEStats";

import HELogo from "assets/heroes_empires_fa.png";
import { formatNumber } from "utils/utils";
import { useWallet } from "use-wallet";
import { web3 } from "contracts/contracts";
import Card from "components/card/Card";
import CardHeader from "components/card/CardHeader";
import ClaimV2 from "components/claim/ClaimV2";
import PrivateClaim from "pages/PrivateClaim";
import Stake from "pages/Stake";

interface VariantConfig {
  navigation: SidebarVariant;
  navigationButton: boolean;
}

const smVariant: VariantConfig = {
  navigation: "drawer",
  navigationButton: true,
};
const mdVariant: VariantConfig = {
  navigation: "sidebar",
  navigationButton: false,
};

const Home = () => {
  const wallet = useWallet();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isHideNumbers, setIsHideNumbers] = useState(false);
  const variants = useBreakpointValue({ base: smVariant, md: mdVariant });

  const showNumbers = () => setIsHideNumbers(false);
  const hideNumbers = () => setIsHideNumbers(true);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    if (wallet.ethereum) {
      web3.setProvider(wallet.ethereum);
    }
  }, [wallet.ethereum]);

  return (
    <>
      <HStack bg="white" justifyContent="space-between" px={5} boxShadow="base">
        <HStack>
          <Image src={HELogo} width={["67px", "67px"]} height={["55px", "55px"]} />
          <Text fontWeight="bold" fontSize="2xl">
            HE Station
          </Text>
        </HStack>
        <Sidebar variant={variants?.navigation} isOpen={isSidebarOpen} onClose={closeSidebar} />
        {variants?.navigationButton && (
          <IconButton
            aria-label="sidebar button"
            icon={
              <Icon w={8} h={8}>
                <path fill="currentColor" d={mdiMenu} />
              </Icon>
            }
            colorScheme="blackAlpha"
            variant="ghost"
            onClick={openSidebar}
          />
        )}
      </HStack>
      <Routes>
        <Route path="/" element={<PrivateClaim />} />
      </Routes>
      <Routes>
        <Route path="/v1" element={<PrivateClaim />} />
      </Routes>
      <Routes>
        <Route path="/stake" element={<Stake />} />
      </Routes>
    </>
  );
};

export default Home;
