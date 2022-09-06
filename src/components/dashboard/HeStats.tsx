import { Box, HStack, Icon, Skeleton, Stack, Tag, Text, Tooltip, VStack } from "@chakra-ui/react";
import Card from "components/card/Card";
import { MultiProgress } from "components/progressMultiBar/MultiProgress";
import { ProgressBar } from "components/progressMultiBar/ProgressBar";
import { getDailyReward, getDailyRewardTime, getPoolInfo } from "contracts/stake";
import useCustomToast from "hooks/useCustomToast";
import { useQuery } from "react-query";
import { heStatsService } from "services/heStats";
import { governanceService } from "services/governance";
import { useWallet } from "use-wallet";
import { formatNumber, numeralFormat } from "utils/utils";
import { BsCircleFill } from "react-icons/bs";

export default function HeStats() {
  const { account } = useWallet();
  const toast = useCustomToast();
  const { data: poolInfo, isLoading: isLoadingPoolInfo } = useQuery(
    ["getPollInfo", account],
    () => getPoolInfo(0),
    {}
  );
  const { data: dailyReward = 0, isLoading: isLoadingDailyReward } = useQuery(
    ["getDailyReward", account],
    () => getDailyRewardTime(),
    {}
  );
  const estimatedRewards = poolInfo
    ? ((dailyReward * 365) / (poolInfo?.balancePool || 1)) * 100
    : 0;

  const { data: heExternalStats, isLoading: isLoadingHEExternalStats } = useQuery(
    "getHEExternalStats",
    async () => await heStatsService.heStats(),
    {
      onError: (error) => {
        toast.error("Cannot connect to server!");
      },
    }
  );
  const { data: heInfo = {}, isLoading: isLoadingHEPrice } = useQuery(
    "getHEPrice",
    async () => await heStatsService.hePrice(),
    {
      onError: (error) => {
        toast.error("Cannot connect to server!");
      },
    }
  );
  const { data: heBurned = {}, isLoading: isLoadingHEBurned } = useQuery(
    "getHEBurned",
    async () => await governanceService.getHEBurned(),
    {
      onError: (error) => {
        toast.error("Cannot connect to server!");
      },
    }
  );
  const { circulating_supply } = heExternalStats?.market_data || {};
  const totalSupply = 1e9;
  return (
    <Stack direction={{ base: "column", md: "row" }} spacing={5} w="100%">
      <Card>
        <VStack w="full" alignItems="start">
          <Text color="primary.500" fontWeight="semibold">
            Total Supply
          </Text>
          <Text color="primary.600" fontSize="xl" fontWeight="bold">
            {numeralFormat(totalSupply)} HE
          </Text>
          <Skeleton isLoaded={!isLoadingHEPrice}>
            <Text fontSize="sm" fontWeight="semibold" color="gray.400" w="100%">
              {heInfo.price && `$${formatNumber(heInfo.price)}`}
            </Text>
          </Skeleton>
        </VStack>
      </Card>
      <Card position="relative" overflow="hidden">
        <VStack w="full" alignItems="start">
          <Text color="primary.500" fontWeight="semibold">
            Circle Supply
          </Text>
          <Skeleton isLoaded={!isLoadingHEExternalStats}>
            <Text color="primary.600" fontSize="xl" fontWeight="bold">
              {circulating_supply ? numeralFormat(circulating_supply) : "--"} HE
            </Text>
          </Skeleton>
          <HStack fontSize="xs" color="gray.400">
            <Tooltip label={String(numeralFormat(Number(heBurned)))}>
              <HStack>
                <Icon color="red.400" as={BsCircleFill} />
                <Text>Burned</Text>
              </HStack>
            </Tooltip>
            <Tooltip label={String(numeralFormat(Number(poolInfo?.balancePool)))}>
              <HStack>
                <Icon color="green.400" as={BsCircleFill} />
                <Text>Stake</Text>
              </HStack>
            </Tooltip>
            <Tooltip label={String(numeralFormat(Number(circulating_supply)))}>
              <HStack>
                <Icon color="blue.400" as={BsCircleFill} />
                <Text>Circle Supply</Text>
              </HStack>
            </Tooltip>
            <Tooltip label={String(numeralFormat(Number(totalSupply)))}>
              <HStack>
                <Icon color="gray.200" as={BsCircleFill} />
                <Text>Total Supply</Text>
              </HStack>
            </Tooltip>
          </HStack>
        </VStack>
        <Box
          position="absolute"
          __css={{ left: 0, bottom: 1 }}
          paddingX={2}
          width="full"
          height="5px"
        >
          <MultiProgress overflow="hidden" borderRadius={15} width="full" height="full">
            <ProgressBar color="red.400" value={(Number(heBurned) / totalSupply) * 100} />
            <ProgressBar
              color="green.400"
              value={(Number(poolInfo?.balancePool) / totalSupply) * 100}
            />
            <ProgressBar
              color="blue.400"
              value={
                ((Number(circulating_supply) - Number(poolInfo?.balancePool)) / totalSupply) * 100
              }
            />
            <ProgressBar
              color="gray.200"
              value={
                100 -
                (Number(poolInfo?.balancePool) / totalSupply) * 100 -
                ((Number(circulating_supply) - Number(poolInfo?.balancePool)) / totalSupply) * 100 -
                (Number(heBurned) / totalSupply) * 100
              }
            />
          </MultiProgress>
        </Box>
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
