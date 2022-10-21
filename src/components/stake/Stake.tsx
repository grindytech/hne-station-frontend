import {
  Button,
  HStack,
  Icon,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { mdiEye, mdiEyeOff } from "@mdi/js";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";

import Card from "components/card/Card";
import CardHeader from "components/card/CardHeader";

import StakeInputPopup from "components/stake/stakeInputPopup/StakeInputPopup";
import { getHEAccountBalance } from "contracts/contracts";
import { getStakingRewardAmount, getUserInfo } from "contracts/stake";

import { formatNumber, numeralFormat, shorten } from "utils/utils";

import { ReactComponent as HEIcon } from "assets/he_coin.svg";
import ConnectWalletButton from "components/connectWalletButton/ConnectWalletButton";
import ClaimPopup from "components/stake/claimPopup/ClaimPopup";
import Withdrawal, {
  pendingClaimQueryKey,
  pendingWithdrawQueryKey,
} from "components/stake/withdrawal/Withdrawal";
import WithdrawPopup from "components/stake/withdrawPopup/WithdrawPopup";
import configs from "configs";
import useCustomToast from "hooks/useCustomToast";
import { useConnectWallet } from "connectWallet/useWallet";
import { poolInfoQueryKey } from "pages/Stake";
import { heStatsService } from "services/heStats";

export const getStakingRewardAmountQueryKey = "getStakingRewardAmount";

const Stake: React.FC = () => {
  const { ethereum, account } = useConnectWallet();

  const toast = useCustomToast();
  const queryClient = useQueryClient();

  const {
    isOpen: isOpenStake,
    onClose: onCloseStake,
    onOpen: onOpenStake,
  } = useDisclosure();
  const {
    isOpen: isOpenWithdraw,
    onClose: onCloseWithdraw,
    onOpen: onOpenWithdraw,
  } = useDisclosure();
  const {
    isOpen: isOpenClaim,
    onClose: onCloseClaim,
    onOpen: onOpenClaim,
  } = useDisclosure();
  const {
    isOpen: isOpenRestake,
    onClose: onCloseRestake,
    onOpen: onOpenRestake,
  } = useDisclosure();
  const [isHideNumbers, setIsHideNumbers] = useState(false);

  const showNumbers = () => setIsHideNumbers(false);
  const hideNumbers = () => setIsHideNumbers(true);

  const { data: heInfo = {}, refetch: refetchHEPrice } = useQuery(
    "getHEPrice",
    async () => await heStatsService.hePrice(),
    {
      onError: (error) => {
        toast.error("Cannot connect to server!");
      },
    }
  );

  const {
    data: accountBalance = 0,
    isLoading,
    refetch,
  } = useQuery(
    ["getHEAccountBalance", account],
    () => getHEAccountBalance("HE", account || ""),
    {
      enabled: !!ethereum,
    }
  );

  const {
    data: userInfo,
    isLoading: isLoadingUserInfo,
    refetch: refetchUserInfo,
  } = useQuery(["getUserInfo", account], () => getUserInfo(0, account || ""), {
    enabled: !!ethereum,
  });

  const { data: rewardAmount, refetch: refetchRewardAmount } = useQuery(
    [getStakingRewardAmountQueryKey, account],
    () => getStakingRewardAmount(0, account || ""),
    {
      enabled: !!ethereum,
    }
  );

  const onSuccess = () => {
    refetch();
    refetchUserInfo();
    queryClient.invalidateQueries(poolInfoQueryKey);
    refetchRewardAmount();
    refetchHEPrice();
    queryClient.invalidateQueries(pendingWithdrawQueryKey);
    queryClient.invalidateQueries(pendingClaimQueryKey);
  };

  return (
    <>
      <VStack minW="300px">
        <Card flex={{ lg: 1 }}>
          <VStack mb={8} alignItems="flex-start">
            <HStack w="100%" justifyContent="space-between">
              <Text fontWeight="bold" fontSize="xl" color="primary.500">
                My {configs.TOKEN_SYMBOL} Staking
              </Text>
              {!!ethereum && (
                <>
                  <Button
                    size="sm"
                    colorScheme="teal"
                    onClick={isHideNumbers ? showNumbers : hideNumbers}
                    variant="ghost"
                    rightIcon={
                      <Icon>
                        <path
                          fill="currentColor"
                          d={isHideNumbers ? mdiEyeOff : mdiEye}
                        />
                      </Icon>
                    }
                  >
                    {isHideNumbers ? "Show" : "Hide"}
                  </Button>
                  {/* <IconButton
                  display={["block", "none"]}
                  aria-label="Hide all number"
                  onClick={isHideNumbers ? showNumbers : hideNumbers}
                >
                  <Icon>
                    <path fill="currentColor" d={isHideNumbers ? mdiEyeOff : mdiEye} />
                  </Icon>
                </IconButton> */}
                </>
              )}
            </HStack>
            {account && (
              <Text fontSize="sm" color="gray.500">
                {shorten(account)}
              </Text>
            )}
          </VStack>
          <Stack mb={5} flexWrap="wrap">
            <VStack flex={1} alignItems="flex-start">
              <Text fontWeight="semibold" color="gray.500" fontSize="sm">
                Total staked
              </Text>
              <Skeleton isLoaded={!isLoadingUserInfo}>
                {!!ethereum && userInfo ? (
                  <HStack alignItems="baseline">
                    <HStack>
                      <Icon w="24px" h="24px">
                        <HEIcon />
                      </Icon>
                      <Text fontWeight="bold" fontSize="2xl">
                        {isHideNumbers
                          ? "**"
                          : numeralFormat(userInfo.stakeAmount)}
                      </Text>
                    </HStack>

                    <Text fontSize="sm" color="gray.500">
                      {isHideNumbers
                        ? ""
                        : `~$${numeralFormat(
                            userInfo.stakeAmount * heInfo.price
                          )}`}
                    </Text>
                  </HStack>
                ) : (
                  "--"
                )}
              </Skeleton>
            </VStack>
            <VStack flex={1} alignItems="flex-start">
              <Text fontWeight="semibold" fontSize="sm" color="gray.500">
                My balance
              </Text>
              <Skeleton isLoaded={!isLoading}>
                {!!ethereum ? (
                  <HStack alignItems="baseline">
                    <HStack>
                      <Icon w="24px" h="24px">
                        <HEIcon />
                      </Icon>
                      <Text fontWeight="bold" fontSize="2xl">
                        {isHideNumbers ? "**" : numeralFormat(accountBalance)}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">
                      {isHideNumbers
                        ? ""
                        : `~$${numeralFormat(accountBalance * heInfo.price)}`}
                    </Text>
                  </HStack>
                ) : (
                  "--"
                )}
              </Skeleton>
            </VStack>
          </Stack>

          {!!ethereum ? (
            <VStack alignItems="stretch">
              <Button
                colorScheme="primary"
                onClick={() => {
                  onOpenStake();
                  refetch();
                }}
              >
                Stake
              </Button>
              <Button
                colorScheme="primary"
                variant="ghost"
                disabled={!userInfo?.stakeAmount}
                onClick={() => {
                  onOpenWithdraw();
                  refetch();
                }}
              >
                Submit Withdraw
              </Button>
            </VStack>
          ) : (
            <ConnectWalletButton />
          )}
        </Card>

        {!!ethereum && rewardAmount && (
          <Card>
            <CardHeader mb={[3, 4]}>
              <Text fontWeight="bold" fontSize="xl" color="primary.500">
                Rewards
              </Text>
            </CardHeader>
            <HStack w="100%" justifyContent="space-between">
              <VStack alignItems="flex-start">
                <HStack>
                  <Icon w="1em" h="1em">
                    <HEIcon />
                  </Icon>
                  <Text fontWeight="bold">
                    {isHideNumbers ? "**" : formatNumber(rewardAmount)}
                  </Text>
                </HStack>
              </VStack>

              {rewardAmount && (
                <Stack direction="column">
                  {/* <Button size="sm" colorScheme="primary" onClick={onOpenRestake}>
                    Restake
                  </Button> */}
                  <Button
                    size="sm"
                    colorScheme="primary"
                    variant="ghost"
                    onClick={onOpenClaim}
                  >
                    Submit Claim
                  </Button>
                </Stack>
              )}
            </HStack>
          </Card>
        )}
        <Withdrawal isHideNumbers={isHideNumbers} onSuccess={onSuccess} />
      </VStack>

      {isOpenStake && (
        <StakeInputPopup
          isOpen={isOpenStake}
          stakeableAmount={accountBalance || 0}
          onClose={onCloseStake}
          onSuccess={onSuccess}
        />
      )}
      {isOpenWithdraw && userInfo && (
        <WithdrawPopup
          isOpen={isOpenWithdraw}
          withdrawableAmount={userInfo.stakeAmount}
          onClose={onCloseWithdraw}
          onSuccess={onSuccess}
        />
      )}
      {isOpenClaim && rewardAmount && (
        <ClaimPopup
          isOpen={isOpenClaim}
          claimableAmount={rewardAmount}
          onClose={onCloseClaim}
          onSuccess={onSuccess}
        />
      )}
      {/* {isOpenRestake && rewardAmount && (
        <RestakePopup
          isOpen={isOpenRestake}
          stakeableAmount={rewardAmount}
          onClose={onCloseRestake}
          onSuccess={onSuccess}
        />
      )} */}
    </>
  );
};

export default Stake;
