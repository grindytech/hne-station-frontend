import { HStack, Stack, Text, Tooltip, VStack } from "@chakra-ui/react";
import Card from "components/card/Card";
import CardBody from "components/card/CardBody";
import CardHeader from "components/card/CardHeader";
import { MultiProgress } from "components/progressMultiBar/MultiProgress";
import { ProgressBar } from "components/progressMultiBar/ProgressBar";
import { ProgressLabel } from "components/progressMultiBar/ProgressLabel";
import { governanceContractV2 } from "contracts/contracts";
import { getThresholdPassed, ProposalOnchain } from "contracts/governance";
import { getPoolInfo } from "contracts/stake";
import { formatDistanceToNow } from "date-fns";
import { useCallback } from "react";
import { useQuery } from "react-query";
import { formatDate, numeralFormat } from "utils/utils";

type Props = {
  proposal: ProposalOnchain;
};

export function Vote({ proposal }: Props) {
  const totalVotes = useCallback(
    () =>
      Number(proposal.votesFail) / 1e18 +
      Number(proposal.votesPassed) / 1e18 +
      Number(proposal.votesVeto) / 1e18,
    [proposal]
  );
  const { data: totalStake, isLoading: isLoadingPoolInfo } = useQuery(
    ["getTotalStake"],
    async () => {
      if (Number(proposal.totalStake) > 0) return proposal.totalStake / 1e18;
      const pool = await getPoolInfo(0);
      return pool.balancePool;
    },
    {}
  );
  const { data: thresholdPassed, isFetching: thresholdPassedFetching } = useQuery(
    "thresholdPassed",
    async () => getThresholdPassed(governanceContractV2())
  );
  return (
    <Card w="full">
      <CardHeader>
        <Text mb={5} fontSize="lg" fontWeight="semibold" color="primary.500">
          Votes
        </Text>
      </CardHeader>
      <CardBody>
        <VStack w="full" spacing={[10, 10]}>
          <Stack w="full" spacing={5} direction={{ md: "row", base: "column" }}>
            <VStack w={{ base: "full", md: "25%" }} alignItems="start">
              <Text fontSize="sm" fontWeight="semibold" color="primary.500">
                Total voted
              </Text>
              <Text fontSize="sm" color="primary.400">
                {numeralFormat(totalVotes())}(
                {numeralFormat((totalVotes() / Number(totalStake)) * 100)}%)
              </Text>
            </VStack>
            <HStack w="full" spacing={5}>
              <VStack
                w="full"
                h="full"
                padding={[2, 5]}
                borderRadius="15"
                border="1px"
                borderColor="blue.500"
              >
                <Text fontSize="sm" fontWeight="semibold" color="primary.500">
                  Yes
                </Text>
                <Text fontSize="md" color="primary.400">
                  {numeralFormat((proposal.votesPassed / 1e18 / (totalVotes() || 1)) * 100)}%
                </Text>
                <Text fontSize="sm" color="primary.500">
                  {numeralFormat(proposal.votesPassed / 1e18)}
                </Text>
              </VStack>
              <VStack
                w="full"
                h="full"
                padding={[2, 5]}
                borderRadius="15"
                border="1px"
                borderColor="red.500"
              >
                <Text fontSize="sm" fontWeight="semibold" color="primary.500">
                  No
                </Text>
                <Text fontSize="md" color="primary.400">
                  {numeralFormat((proposal.votesFail / 1e18 / (totalVotes() || 1)) * 100)}%
                </Text>
                <Text fontSize="sm" color="primary.500">
                  {numeralFormat(proposal.votesFail / 1e18)}
                </Text>
              </VStack>
              <VStack
                w="full"
                h="full"
                padding={[2, 5]}
                borderRadius="15"
                border="1px"
                borderColor="orange.500"
              >
                <Text fontSize="sm" fontWeight="semibold" color="primary.500">
                  No with veto
                </Text>
                <Text fontSize="md" color="primary.400">
                  {numeralFormat((proposal.votesVeto / 1e18 / (totalVotes() || 1)) * 100)}%
                </Text>
                <Text fontSize="sm" color="primary.500">
                  {numeralFormat(proposal.votesVeto / 1e18)}
                </Text>
              </VStack>
            </HStack>
          </Stack>
          <VStack w="full">
            <MultiProgress mt={10} bgColor="gray.100" h="10px" w="full">
              <ProgressBar
                color="blue.400"
                value={(proposal.votesPassed / 1e18 / totalVotes()) * 100}
              />
              <ProgressBar
                color="red.400"
                value={(proposal.votesFail / 1e18 / totalVotes()) * 100}
              />
              <ProgressBar
                color="orange.400"
                value={(proposal.votesVeto / 1e18 / totalVotes()) * 100}
              />
              <ProgressLabel color="blue.500" label="Pass threshold" left={thresholdPassed / 10} />
            </MultiProgress>
          </VStack>
          <VStack w="full">
            <HStack w="full">
              <Text fontSize="sm" fontWeight="semibold" color="primary.500">
                Total voted
              </Text>
              <Text fontSize="sm" color="primary.400">
                {numeralFormat(totalVotes())}/{numeralFormat(Number(totalStake))}
              </Text>
            </HStack>
            {Number(proposal?.endVote) && (
              <HStack w="full">
                <Tooltip label={formatDate(Number(proposal.endVote) * 1000)}>
                  <Text fontSize="sm" color="primary.500">
                    Ended{" "}
                    {formatDistanceToNow(proposal.endVote * 1e3, {
                      includeSeconds: false,
                      addSuffix: true,
                    })}
                  </Text>
                </Tooltip>
              </HStack>
            )}
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
}
