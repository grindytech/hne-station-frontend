import {
  Heading,
  HStack,
  Icon,
  IconButton,
  Link,
  Stack,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { mdiGithub } from "@mdi/js";
import Card from "components/card/Card";
import CardHeader from "components/card/CardHeader";
import Claim from "components/claim/Claim";
import ClaimV2 from "components/claim/ClaimV2";
import SwitchVersion from "components/SwitchVersion";
import React, { useState } from "react";

const PrivateClaim = () => {
  const [version, setVersion] = useState(2);
  return (
    <>
      <Heading as="h3" mt={[10, 5]} color="primary.500">
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
                <Text fontWeight="bold" fontSize="xl" color="primary.500">
                  Heroes & Empires’s Milestones:
                </Text>
                <IconButton
                  background="white"
                  color="primary.500"
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
        {version === 1 && (
          <Claim
            switchVersion={
              <SwitchVersion
                onClick={() => {
                  console.log("v1 clicked");
                  setVersion(2);
                }}
                isV2={false}
              />
            }
          />
        )}
        {version === 2 && (
          <ClaimV2
            switchVersion={
              <SwitchVersion
                onClick={() => {
                  console.log("v2 clicked");
                  setVersion(1);
                }}
                isV2={true}
              />
            }
          />
        )}
      </Stack>
    </>
  );
};

export default PrivateClaim;
