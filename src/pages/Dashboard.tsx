import { Heading, Stack, VStack } from "@chakra-ui/react";
import BridgeTransfer from "components/dashboard/BridgeTransfer";
import BridgeTransferChart from "components/dashboard/BridgeTransferChart";
import BridgeVolumeChart from "components/dashboard/BridgeVolumeChart";

export default function Dashboard() {
  return (
    <VStack spacing={5}>
      <Heading w="full" as="h3" color="primary.500">
        Dashboard
      </Heading>
      <Stack direction={{ base: "column", md: "row" }} w="full">
        <BridgeTransferChart w="full" h={200} />
        <BridgeVolumeChart w="full" h={200} />
      </Stack>
      <BridgeTransfer />
    </VStack>
  );
}
