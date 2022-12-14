import {
  Button, Heading,
  HStack,
  Icon,
  Link,
  Skeleton,
  Stack,
  Text, VStack
} from "@chakra-ui/react";
import Card from "components/card/Card";
import CardHeader from "components/card/CardHeader";
import { SidebarVariant } from "components/Sidebar";
import HEStats from "components/stake/heStats/HEStats";
import History from "components/stake/history/History";
import PoolInfo from "components/stake/pool/PoolInfo";
import Stake from "components/stake/Stake";
import { getDailyReward, getPoolInfo } from "contracts/stake";
import { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { useQuery } from "react-query";
import { useWallet } from "use-wallet";
import { formatNumber } from "utils/utils";

interface VariantConfig {
  navigation: SidebarVariant;
  navigationButton: boolean;
}

const smVariant: VariantConfig = {
  navigation: "drawer",
  navigationButton: true,
};
const mdVariant: VariantConfig = {
  navigation: "sidebar",
  navigationButton: false,
};

export const poolInfoQueryKey = "getPoolInfo";

const Home = () => {
  const wallet = useWallet();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isHideNumbers, setIsHideNumbers] = useState(false);

  const { data: dailyReward = 0, isLoading: isLoadingDailyReward } = useQuery(
    ["getDailyReward", wallet.account],
    () => getDailyReward(),
    {}
  );

  const { data: poolInfo, isLoading: isLoadingPoolInfo } = useQuery(
    [poolInfoQueryKey, wallet.account],
    () => getPoolInfo(0),
    {}
  );

  const estimatedRewards = poolInfo
    ? ((dailyReward * 365) / (poolInfo?.balancePool || 1)) * 100
    : 0;

  return (
    <>
      <Stack justifyContent="space-between" direction={{ md: "row", base: "column" }} mt={[10, 5]}>
        <Heading as="h3" color="primary.500">
          Staking Dashboard
        </Heading>
        <HStack>
          <Button
            as={Link}
            target="_blank"
            href="https://cystack.net/projects/heroes-and-empires"
            rightIcon={<Icon as={FiArrowUpRight} />}
            color="primary.500"
          >
            Audit
          </Button>
          <Button
            as={Link}
            target="_blank"
            href="https://support.heroesempires.com/hc/en-us/articles/4414424812057"
            rightIcon={<Icon as={FiArrowUpRight} />}
            color="primary.500"
          >
            Docs
          </Button>
        </HStack>
      </Stack>
      <Stack
        direction={["column", "column", "column", "row"]}
        spacing={["0.5rem", 5]}
        pt={5}
        background=""
      >
        <Stake />
        <Stack flex={2}>
          <Stack direction={["column", "row"]} w="100%">
            <PoolInfo
              poolBalance={poolInfo?.balancePool || 0}
              isLoadingPoolBalance={isLoadingPoolInfo}
            />
            <Card>
              <CardHeader mb={[3, 4]}>
                <Text fontWeight="bold" fontSize="xl" color="primary.500">
                  Estimated Rewards
                </Text>
              </CardHeader>
              <HStack w="100%">
                <VStack flex={1} alignItems="flex-start">
                  <Skeleton isLoaded={!isLoadingDailyReward}>
                    <Text fontWeight="bold" fontSize="2xl">
                      {estimatedRewards ? formatNumber(estimatedRewards, 1) : "--"} %
                    </Text>
                  </Skeleton>
                  <Text fontWeight="bold" color="primary.500">
                    APR
                  </Text>
                </VStack>
              </HStack>
            </Card>
          </Stack>
          <HEStats isLoadingDailyReward={isLoadingDailyReward} dailyReward={dailyReward} />
          <History isHideNumbers={isHideNumbers} />
        </Stack>
      </Stack>
    </>
  );
};

export default Home;
