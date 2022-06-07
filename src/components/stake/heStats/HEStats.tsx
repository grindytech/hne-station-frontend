import React from "react";
import { HStack, VStack, Text, Wrap, Icon, Skeleton } from "@chakra-ui/react";
import useCustomToast from "hooks/useCustomToast";
import { useQuery } from "react-query";

import Card from "components/card/Card";
import CardHeader from "components/card/CardHeader";
import CONFIGS from "configs";
import { formatNumber } from "utils/utils";
import { ReactComponent as HEIcon } from "assets/he_coin.svg";

interface Props {
  isLoadingDailyReward: boolean;
  dailyReward: number;
}

const HEStats: React.FC<Props> = ({ dailyReward }) => {
  const toast = useCustomToast();

  const { data: heInfo = {}, isLoading: isLoadingHEPrice } = useQuery(
    "getHEPrice",
    async () => (await fetch(`${CONFIGS.DASHBOARD_API_URL}/api/v1/hePrice`)).json(),
    {
      onError: (error) => {
        toast.error("Cannot connect to server!");
      },
    }
  );

  const { data: heExternalStats, isLoading: isLoadingHEExternalStats } = useQuery(
    "getHEExternalStats",
    async () =>
      (
        await fetch("https://api.coingecko.com/api/v3/coins/heroes-empires?localization=false")
      ).json(),
    {
      onError: (error) => {
        toast.error("Cannot connect to server!");
      },
    }
  );
  const { circulating_supply } = heExternalStats?.market_data || {};

  return (
    <Card>
      <CardHeader mb={[3, 4]}>
        <Text fontWeight="bold" fontSize="xl" color="primary.500">
          HE Stats
        </Text>
      </CardHeader>
      <Wrap w="100%">
        <VStack flex={1} alignItems="flex-start">
          <Text fontWeight="semibold" color="gray.500" fontSize="sm">
            HE Price
          </Text>
          <Skeleton isLoaded={!isLoadingHEPrice}>
            <Text fontWeight="bold" w="100%">
              {heInfo.price && `$${formatNumber(heInfo.price)}`}
            </Text>
          </Skeleton>
        </VStack>
        <VStack flex={1} alignItems="flex-start">
          <Text fontWeight="semibold" color="gray.500" fontSize="sm" whiteSpace="nowrap">
            Daily rewards
          </Text>
          <HStack>
            <Icon w="1.2em" h="1.2em">
              <HEIcon />
            </Icon>
            <Text fontWeight="bold" w="100%">
              {dailyReward ? formatNumber(dailyReward, 1) : "--"}
            </Text>
          </HStack>
        </VStack>
        <VStack flex={1} alignItems="flex-start">
          <Text fontWeight="semibold" color="gray.500" fontSize="sm">
            Circulating Supply
          </Text>
          <Skeleton isLoaded={!isLoadingHEExternalStats}>
            <HStack>
              <Icon w="1.2em" h="1.2em">
                <HEIcon />
              </Icon>
              <Text fontWeight="bold" w="100%">
                {circulating_supply && formatNumber(circulating_supply)}
              </Text>
            </HStack>
          </Skeleton>
        </VStack>
      </Wrap>
    </Card>
  );
};

export default HEStats;
