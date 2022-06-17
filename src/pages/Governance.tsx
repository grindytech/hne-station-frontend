import { Heading, HStack, Stack } from "@chakra-ui/react";
import Governance from "components/governance/Governance";

export default function GovernancePage() {
  return (
    <>
      <Heading as="h3" mt={[10, 5]} color="primary.500">
        Governance
      </Heading>
      <Stack spacing={[10, 5]} w="100%" mt={[10, 5]}>
        <Governance />
      </Stack>
    </>
  );
}
