import {
  Container,
  Heading,
  HStack,
  Skeleton,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import CardHeader from "components/card/CardHeader";
import { SidebarVariant } from "components/Sidebar";
import HEStats from "components/stake/heStats/HEStats";
import History from "components/stake/history/History";
import PoolInfo from "components/stake/pool/PoolInfo";
import Stake from "components/stake/Stake";
import { web3 } from "contracts/contracts";
import { getDailyReward, getPoolInfo } from "contracts/stake";
import { useEffect, useState } from "react";
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
  const variants = useBreakpointValue({ base: smVariant, md: mdVariant });

  const showNumbers = () => setIsHideNumbers(false);
  const hideNumbers = () => setIsHideNumbers(true);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

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

  const estimatedRewards = ((dailyReward * 365) / (poolInfo?.balancePool || 1)) * 100;

  useEffect(() => {
    if (wallet.ethereum) {
      web3.setProvider(wallet.ethereum);
    }
  }, [wallet.ethereum]);

  return (
    <Container maxW="container.lg" mb={3}>
      <Heading as="h3" textAlign="center" mt={[5, 10]}>
        HE Staking Dashboard
      </Heading>
      {/* <Container maxW='container.xl'> */}
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
                <Text fontWeight="bold" fontSize="xl" color="gray.500">
                  Estimated Rewards
                </Text>
              </CardHeader>
              <HStack w="100%">
                <VStack flex={1} alignItems="flex-start">
                  <Skeleton isLoaded={!isLoadingDailyReward}>
                    <Text fontWeight="bold" fontSize="2xl">
                      {formatNumber(estimatedRewards, 1)} %
                    </Text>
                  </Skeleton>
                  <Text fontWeight="bold" color="gray.500">
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
      {/* </Container> */}
    </Container>
  );
};

export default Home;
