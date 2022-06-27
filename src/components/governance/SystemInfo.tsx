import { HStack, Skeleton, Text, VStack } from "@chakra-ui/react";
import Card from "components/card/Card";
import CardBody from "components/card/CardBody";
import { durationDeposit, durationVote, minDeposit } from "contracts/governance";
import { formatDistance } from "date-fns";
import { useQuery } from "react-query";
import { formatNumber } from "utils/utils";

export function SystemInfo() {
  const { data: minimumDeposit, isFetching: minDepositFetching } = useQuery(
    "minDeposit",
    async () => minDeposit()
  );
  const { data: depositPeriod, isFetching: durationDepositFetching } = useQuery(
    "durationDeposit",
    async () => durationDeposit()
  );
  const { data: votePeriod, isFetching: durationVoteFetching } = useQuery(
    "durationVote",
    async () => durationVote()
  );
  return (
    <Card>
      <CardBody>
        <HStack justifyContent="space-evenly" w="full">
          <VStack>
            <Text fontSize="sm" fontWeight="semibold" color="primary.500">
              Minimum deposit
            </Text>
            <Text fontSize="sm" color="primary.500">
              <Skeleton isLoaded={!minDepositFetching}>
                {minimumDeposit ? formatNumber(Number(minimumDeposit) / 1e18) : "--"} HE
              </Skeleton>
            </Text>
          </VStack>
          <VStack>
            <Text fontSize="sm" fontWeight="semibold" color="primary.500">
              Maximum deposit period
            </Text>
            <Text fontSize="sm" color="primary.500">
              <Skeleton isLoaded={!durationDepositFetching}>
                {depositPeriod
                  ? formatDistance(0, Number(depositPeriod) * 1000, {
                      includeSeconds: false,
                    })
                  : "--"}
              </Skeleton>
            </Text>
          </VStack>
          <VStack>
            <Text fontSize="sm" fontWeight="semibold" color="primary.500">
              Voting period
            </Text>
            <Text fontSize="sm" color="primary.500">
              <Skeleton isLoaded={!durationVoteFetching}>
                {votePeriod
                  ? formatDistance(0, Number(votePeriod) * 1000, {
                      includeSeconds: false,
                    })
                  : "--"}
              </Skeleton>
            </Text>
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
}
