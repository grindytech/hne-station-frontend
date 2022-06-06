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
            Strategic Partnerships
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
        <Route path="/" element={<ClaimPage ClaimElement={ClaimV2} />} />
      </Routes>
      <Routes>
        <Route path="/v1" element={<ClaimPage ClaimElement={Claim} />} />
      </Routes>
    </>
  );
};

const ClaimPage = ({ ClaimElement }: { ClaimElement: any }) => {
  return (
    <Container maxW="container.xl" mb={3}>
      <Heading as="h3" textAlign="center" mt={[5, 10]} color="primary">
        Strategic Partnerships
      </Heading>
      <Stack
        direction={["column-reverse", "column-reverse", "column-reverse", "row"]}
        spacing={["0.5rem", 5]}
        pt={5}
        alignItems="stretch"
      >
        <Stack flex={1} minH="100%">
          <Card height="100%">
            <CardHeader mb={[3, 4]}>
              <HStack justifyContent="space-between" w="full">
                <Text fontWeight="bold" fontSize="xl" color="primary">
                  Heroes & Empires’s Milestones:
                </Text>
                <IconButton
                  background="white"
                  color="primary"
                  aria-label="github link"
                  icon={
                    <Icon w={8} h={8}>
                      <path fill="currentColor" d={mdiGithub} />
                    </Icon>
                  }
                  onClick={() =>
                    window.open(
                      "https://github.com/w3f/Grants-Program/blob/master/docs/accepted_grant_applications.md#surfing_woman-wave-13---first-quarter-2022",
                      "_blank"
                    )
                  }
                />
              </HStack>
            </CardHeader>
            <Wrap w="100%">
              <VStack flex={1} gap={1} alignItems="flex-start">
                <Text as="div" w="100%">
                  <Text fontWeight="bold" as="span">
                    I.
                  </Text>{" "}
                  Completely changed the game's model, from Play-2-Earn to Skill-2-Earn. We are
                  completely focused on the game experience/graphics, in addition to taking care of
                  the real players, through PvP battles and Clan battles against each other.
                </Text>
                <Text as="div" w="100%">
                  <Text fontWeight="bold" as="span">
                    II.
                  </Text>{" "}
                  A free-to-play version for new players to try out before shifting on to the
                  official version.
                </Text>
                <Text as="div" w="100%">
                  <Text fontWeight="bold" as="span">
                    III.
                  </Text>{" "}
                  Launching the official mobile version on the App Store and the Google Play in
                  order to transfer the number of gamers from traditional games to GameFi (from I Am
                  Hero to Heroes & Empires).
                </Text>
                <Text as="div" w="100%">
                  <Text fontWeight="bold" as="span">
                    IV.
                  </Text>{" "}
                  The introduction of numerous new Heroes and game features.
                </Text>
                <Text as="div" w="100%">
                  <Text fontWeight="bold" as="span">
                    V.
                  </Text>{" "}
                  Combine two available games that use the same HE Token and NFTs: Archer Hunter and
                  Auto Chess Legends NFTs.
                </Text>
                <Text as="div" w="100%">
                  <Text fontWeight="bold" as="span">
                    VI.
                  </Text>{" "}
                  Create your own H&E Ecosystem Chain. The project has been on the list of Accepted
                  Grant Applications, and a demo version was released in May (Gafi Network - The
                  Network of Game Finance)
                </Text>
                <Text>
                  If you have any questions, please email:{" "}
                  <Link href="mailto:contact@heroesempires.com">contact@heroesempires.com</Link>
                </Text>
              </VStack>
            </Wrap>
          </Card>
          {/* <HEStats /> */}
        </Stack>
        {React.cloneElement(<ClaimElement />)}
      </Stack>
    </Container>
  );
};

export default Home;
