import { HStack, Skeleton, Text, VStack } from "@chakra-ui/react";
import Card from "components/card/Card";
import CardBody from "components/card/CardBody";
import { getQuorum, getThresholdPassed, getThresholdVeto } from "contracts/governance";
import { useQuery } from "react-query";

export function ConfigVoteInfo() {
  const { data: quorum, isFetching: quorumFetching } = useQuery("quorum", async () => getQuorum());
  const { data: thresholdPassed, isFetching: thresholdPassedFetching } = useQuery(
    "thresholdPassed",
    async () => getThresholdPassed()
  );
  const { data: thresholdVeto, isFetching: thresholdVetoFetching } = useQuery(
    "thresholdVeto",
    async () => getThresholdVeto()
  );
  return (
    <Card>
      <CardBody>
        <HStack justifyContent="space-evenly" w="full">
          <VStack>
            <Text fontSize="sm" fontWeight="semibold" color="primary.500">
              Quorum
            </Text>
            <Text fontSize="sm" color="primary.500">
              <Skeleton isLoaded={!quorumFetching}>{quorum && Number(quorum) / 10}%</Skeleton>
            </Text>
          </VStack>
          <VStack>
            <Text fontSize="sm" fontWeight="semibold" color="primary.500">
              Pass threshold
            </Text>
            <Text fontSize="sm" color="primary.500">
              <Skeleton isLoaded={!thresholdPassedFetching}>
                {thresholdPassed && Number(thresholdPassed) / 10}%
              </Skeleton>
            </Text>
          </VStack>
          <VStack>
            <Text fontSize="sm" fontWeight="semibold" color="primary.500">
              Veto threshold
            </Text>
            <Text fontSize="sm" color="primary.500">
              <Skeleton isLoaded={!thresholdVetoFetching}>
                {thresholdVeto && Number(thresholdVeto) / 10}%
              </Skeleton>
            </Text>
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
}
