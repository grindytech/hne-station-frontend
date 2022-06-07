import React from "react";
import { HStack, VStack, Text, Icon, Skeleton } from "@chakra-ui/react";

import Card from "components/card/Card";
import CardHeader from "components/card/CardHeader";
import { useQuery } from "react-query";
import { formatNumber } from "utils/utils";
import useCustomToast from "hooks/useCustomToast";
import CONFIGS from "configs";
import { ReactComponent as HEIcon } from "assets/he_coin.svg";

interface Props {
  isLoadingPoolBalance: boolean;
  poolBalance: number;
}

const PoolInfo: React.FC<Props> = ({ isLoadingPoolBalance, poolBalance }) => {
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

  return (
    <Card>
      <CardHeader mb={[3, 4]}>
        <Text fontWeight="bold" fontSize="xl" color="primary.500">
          Total Staked
        </Text>
      </CardHeader>
      <HStack w="100%">
        <VStack alignItems="flex-start">
          <Skeleton isLoaded={!isLoadingPoolBalance}>
            <HStack>
              <Icon w="24px" h="24px">
                <HEIcon />
              </Icon>
              <Text fontWeight="bold" fontSize="2xl">
                {poolBalance ? formatNumber(poolBalance, 1) : "--"}
              </Text>
            </HStack>
          </Skeleton>
          <Skeleton isLoaded={!isLoadingPoolBalance && !isLoadingHEPrice}>
            <Text color="gray.500" fontSize="sm">{`~$${formatNumber(
              poolBalance * heInfo.price,
              1
            )}`}</Text>
          </Skeleton>
        </VStack>
      </HStack>
    </Card>
  );
};

export default PoolInfo;
