import { Heading, Stack, VStack } from "@chakra-ui/react";
import BridgePool from "components/bridge/dashboard/Pool";
import BridgeTransfer from "components/bridge/dashboard/Transfer";
import BridgeTransferChart from "components/bridge/dashboard/TransferChart";
import BridgeVolumeChart from "components/bridge/dashboard/VolumeChart";

export default function Dashboard() {
  return (
    <VStack spacing={4}>
      <Heading w="full" as="h3" color="primary.500">
        Dashboard
      </Heading>
      <Stack spacing={4} direction={{ base: "column", md: "row" }} w="full">
        <BridgeTransferChart w="full" h={200} />
        <BridgeVolumeChart w="full" h={200} />
      </Stack>
      <BridgeTransfer />
      <BridgePool/>
    </VStack>
  );
}
