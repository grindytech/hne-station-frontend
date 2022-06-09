import { Flex, Heading } from "@chakra-ui/react";
import CommunityAirdrop from "components/airdrop/CommunityAirdrop";

export default function Airdrop() {
  return (
    <>
      <Heading as="h3" mt={[10, 5]} color="primary.500">
        Airdrop
      </Heading>
      <Flex wrap="wrap">
        <CommunityAirdrop
          name="Community airdrop"
          section="1"
          total={48000}
          linkWhiteList="https://github.com/HeroesEmpires/Airdrop/blob/master/CommunityAirdrop.csv"
        />
        <CommunityAirdrop
          name="Community tester airdrop"
          section="2"
          total={15000}
          linkWhiteList="https://github.com/HeroesEmpires/Airdrop/blob/master/Lucky-Testnet-Community.csv"
        />
      </Flex>
    </>
  );
}
