import React, { useMemo } from "react";
import { Box, HStack, Icon, Tag, Text, VStack } from "@chakra-ui/react";

import Card from "components/card/Card";
import CardHeader from "components/card/CardHeader";
import { useQuery } from "react-query";
import { getUserPendingClaim, getUserPendingWithdraw } from "contracts/stake";
import { useWallet } from "use-wallet";
import {
  pendingClaimQueryKey,
  pendingWithdrawQueryKey,
} from "components/stake/withdrawal/Withdrawal";
import { isEmpty } from "lodash";
import { ReactComponent as HEIcon } from "assets/he_coin.svg";
import { formatNumber } from "utils/utils";
import { formatDistanceToNow } from "date-fns/esm";

interface Props {
  isHideNumbers: boolean;
}

const History: React.FC<Props> = ({ isHideNumbers }) => {
  const { isConnected, account } = useWallet();
  const { data: pendingWithdraws, isLoading } = useQuery(
    pendingWithdrawQueryKey,
    () => getUserPendingWithdraw(0, account || ""),
    {
      enabled: isConnected(),
    }
  );

  const { data: pendingClaims, isLoading: isLoadingClaims } = useQuery(
    [pendingClaimQueryKey, account],
    () => getUserPendingClaim(0, account || ""),
    {
      enabled: isConnected(),
    }
  );

  const historyWithdrawData = useMemo(
    () =>
      pendingWithdraws
        ?.filter(({ status }) => status === 1)
        .map((data) => ({ ...data, withdrawTime: data.withdrawTime, type: 0 })) || [],
    [pendingWithdraws]
  );

  const historyClaimData = useMemo(
    () =>
      pendingClaims
        ?.filter(({ status }) => status === 1)
        .map((data) => ({ ...data, withdrawTime: data.claimTime, type: 1 })) || [],
    [pendingClaims]
  );

  const historyData = useMemo(
    () =>
      [...historyWithdrawData, ...historyClaimData].sort(
        (dataA, dataB) => dataA.blockTime - dataB.blockTime
      ),
    [historyClaimData, historyWithdrawData]
  );

  const isShow =
    !isEmpty(pendingWithdraws?.filter(({ status }) => status === 1)) ||
    !isEmpty(pendingClaims?.filter(({ status }) => status === 1));

  return pendingWithdraws && pendingClaims && isShow ? (
    <Card>
      <CardHeader mb={[3, 4]}>
        <Text fontWeight="bold" fontSize="xl" color="primary.500">
          Withdraw History
        </Text>
      </CardHeader>
      <VStack alignItems="stretch">
        {historyData?.map(({ withdrawTime, amount, type }, index) => (
          <HStack key={index} gap={1}>
            <HStack flex={1}>
              <Icon w="1em" h="1em">
                <HEIcon />
              </Icon>
              <Text fontWeight="bold">{isHideNumbers ? "**" : formatNumber(amount)}</Text>
            </HStack>
            <Box>
              <Tag colorScheme="primary" flex={1} borderRadius="full">
                {type === 0 ? "withdraw" : "claim"}
              </Tag>
            </Box>
            <Text flex={1} fontSize="sm" color="gray.500" textAlign="right">
              {formatDistanceToNow(withdrawTime, { addSuffix: true })}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Card>
  ) : (
    <></>
  );
};

export default History;
