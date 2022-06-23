import { Heading, Stack } from "@chakra-ui/react";
import Histories from "components/governance/user-histories/Histories";
import DepositedProposals from "../components/governance/user-histories/DepositedProposals";

export default function UserHistories() {
  return (
    <>
      <Heading mt={[10, 5]} as="h3" color="primary.500">
        Histories
      </Heading>
      <Stack spacing={[10, 5]} w="100%" mt={[10, 5]}>
        <DepositedProposals />
        <Histories />
      </Stack>
    </>
  );
}
