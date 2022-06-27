import { Heading, VStack } from "@chakra-ui/react";
import HeChart from "components/dashboard/HeChart";
import HeStats from "components/dashboard/HeStats";

export default function Dashboard() {
  return (
    <VStack spacing={5}>
      <Heading w="full" as="h3" mt={[10, 5]} color="primary.500">
        Dashboard
      </Heading>
      <HeStats />
      <HeChart />
    </VStack>
  );
}
