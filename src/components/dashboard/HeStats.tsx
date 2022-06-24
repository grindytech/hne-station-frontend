import { Skeleton, Stack, Tag, Text, VStack } from "@chakra-ui/react";
import Card from "components/card/Card";
import { getDailyReward, getPoolInfo } from "contracts/stake";
import { useQuery } from "react-query";
import { useWallet } from "use-wallet";
import { formatNumber } from "utils/utils";

export default function HeStats() {
  const { account } = useWallet();
  const { data: poolInfo, isLoading: isLoadingPoolInfo } = useQuery(
    ["getPollInfo", account],
    () => getPoolInfo(0),
    {}
  );
  const { data: dailyReward = 0, isLoading: isLoadingDailyReward } = useQuery(
    ["getDailyReward", account],
    () => getDailyReward(),
    {}
  );
  const estimatedRewards = poolInfo
    ? ((dailyReward * 365) / (poolInfo?.balancePool || 1)) * 100
    : 0;
  return (
    <Stack direction={["column", "row"]} spacing={5} w="100%">
      <Card>
        <VStack w="full" alignItems="start">
          <Text color="primary.500" fontWeight="semibold">
            Total Supply
          </Text>
          <Text color="primary.600" fontSize="xl" fontWeight="bold">
            1,000,000,000 HE
          </Text>
        </VStack>
      </Card>
      <Card>
        <VStack w="full" alignItems="start">
          <Text color="primary.500" fontWeight="semibold">
            Circle Supply
          </Text>
          <Text color="primary.600" fontSize="xl" fontWeight="bold">
            1,000,000 HE
          </Text>
        </VStack>
      </Card>
      <Card>
        <VStack w="full" alignItems="start">
          <Text color="primary.500" fontWeight="semibold">
            Total Staking
          </Text>
          <Skeleton isLoaded={!isLoadingPoolInfo}>
            <Text color="primary.600" fontSize="xl" fontWeight="bold">
              {poolInfo?.balancePool ? formatNumber(poolInfo?.balancePool, 1) : "--"} HE
            </Text>
          </Skeleton>

          <Tag color="primary.400">
            APR {estimatedRewards ? formatNumber(estimatedRewards, 1) : "--"} %
          </Tag>
        </VStack>
      </Card>
    </Stack>
  );
}
