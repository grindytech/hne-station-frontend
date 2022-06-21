import { Button, Heading, HStack, Stack } from "@chakra-ui/react";
import Governance from "components/governance/Governance";
import NewProposal from "components/governance/NewProposal";
import { Link } from "react-router-dom";

export default function GovernancePage() {
  return (
    <>
      <HStack mt={[10, 5]} justifyContent="space-between" alignItems="center">
        <Heading as="h3" color="primary.500">
          Governance
        </Heading>
        <Button as={Link} to="/proposal/new" colorScheme="primary">
          New proposal
        </Button>
      </HStack>
      <Stack spacing={[10, 5]} w="100%" mt={[10, 5]}>
        <Governance />
      </Stack>
    </>
  );
}
