import React, { useEffect, useState } from "react";
import {
  HStack,
  VStack,
  Text,
  Button,
  Skeleton,
  Icon,
  Stack,
  useDisclosure,
  Image,
  ButtonGroup,
  Box,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { mdiEye, mdiEyeOff } from "@mdi/js";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useWallet } from "use-wallet";

import Card from "components/card/Card";

import ClaimInputPopup from "components/claimInputPopup/ClaimInputPopup";
import {
  claimOption1,
  claimOption2,
  getClaimableAmount,
  getClaimableOption2Amount,
  getStartTime,
  getUserTotalAmount,
  getUserWithdrawnAmount,
} from "contracts/claimV2";

import { formatNumber, shorten } from "utils/utils";

import CONFIGS from "configs";
import useCustomToast from "hooks/useCustomToast";
import ClaimPopup from "components/claimPopup/ClaimPopup";
import { ReactComponent as HEIcon } from "assets/he_coin.svg";
import MilestoneBanner from "assets/milestone_banner.png";
import ConnectWalletButton from "components/connectWalletButton/ConnectWalletButton";
import ClaimableAmount, {
  getClaimableAmountQueryKey,
} from "components/claimableAmount/ClaimableAmount";
import { ErrorContract } from "types";
import Countdown from "react-countdown";
import { Link } from "react-router-dom";
import { heStatsService } from "services/heStats";
import configs from "configs";

const ClaimV2: React.FC<{ switchVersion: any }> = ({ switchVersion }) => {
  const { ethereum, account } = useWallet();
  const [now, setNow] = useState(Date.now());
  const [option, setOption] = useState<1 | 2>(2);
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const toast = useCustomToast();
  const queryClient = useQueryClient();

  const { isOpen: isOpenClaim, onClose: onCloseClaim, onOpen: onOpenClaim } = useDisclosure();

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
    data: userInfo,
    isLoading: isLoadingUserInfo,
    refetch: refetchUserInfo,
  } = useQuery(["getUserTotalAmount2", account], () => getUserTotalAmount(account || ""), {
    enabled: !! ethereum,
  });

  const {
    data: userWithdrawnAmount,
    isLoading: isLoadingUserWithdrawnAmount,
    refetch: refetchUserWithdrawnAmount,
  } = useQuery(
    ["getUserTotalWithdrawnAmount2", account],
    () => getUserWithdrawnAmount(account || ""),
    {
      enabled: !! ethereum,
    }
  );

  const {
    data: claimableAmount = 0,
    refetch: refetchClaimableAmount,
    isLoading: isLoadingClaimableAmount,
  } = useQuery(["getClaimOption1", account], () => getClaimableAmount(account || ""), {
    enabled: !! ethereum,
  });
  const {
    data: claimableAmount2 = 0,
    refetch: refetchClaimableAmount2,
    isLoading: isLoadingClaimableAmount2,
  } = useQuery(["getClaimOption2", account], () => getClaimableOption2Amount(account || ""), {
    enabled: !! ethereum,
  });

  const { data: startTime = 0, isLoading: isLoadingStartTime } = useQuery(
    "getStartTime",
    () => getStartTime(),
    {
      enabled: !! ethereum,
    }
  );

  const { mutate, isLoading: isClaiming } = useMutation(claimOption1, {
    onSuccess: () => {
      toast.success(`Claim ${formatNumber(claimableAmount)} ${configs.TOKEN_SYMBOL} successfully!`);
      onSuccess();
    },
    onError: (error: ErrorContract) => {
      if (error.code === 4001) toast.error("Please allow transaction!");
    },
  });
  const { mutate: mutateOption2, isLoading: isOption2Claiming } = useMutation(claimOption2, {
    onSuccess: () => {
      toast.success(
        `Claim ${formatNumber(claimableAmount2)} ${
          configs.TOKEN_SYMBOL
        } successfully!`
      );
      onSuccess();
    },
    onError: (error: ErrorContract) => {
      if (error.code === 4001) toast.error("Please allow transaction!");
    },
  });

  const onClick = () => {
    if (!! ethereum) {
      if (option === 1) {
        mutate({ address: account || "" });
      } else {
        mutateOption2({ address: account || "" });
      }
    }
  };

  const onSuccess = () => {
    refetchUserInfo();
    refetchHEPrice();
    refetchUserWithdrawnAmount();
    refetchClaimableAmount();
    refetchClaimableAmount2();
  };

  return (
    <VStack flex={1}>
      <Card flex={{ lg: 1 }}>
        <VStack mb={4} alignItems="flex-start">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Text fontWeight="bold" fontSize="xl" color="primary.500">
              My {configs.TOKEN_SYMBOL} Claiming
            </Text>
            {React.cloneElement(switchVersion)}
          </Box>
          {account && (
            <Text fontSize="sm" color="gray.500">
              {shorten(account)}
            </Text>
          )}
        </VStack>
        <Stack mb={5} direction={["column", "row"]} flexWrap="wrap">
          <VStack flex={1} alignItems="flex-start">
            <Text fontWeight="semibold" color="gray.500" fontSize="sm">
              Withdrawn amount
            </Text>
            <Skeleton isLoaded={!isLoadingUserWithdrawnAmount}>
              {!!ethereum && userWithdrawnAmount !== undefined ? (
                <HStack alignItems="baseline">
                  <Icon w="24px" h="24px" alignSelf={"center"}>
                    <HEIcon />
                  </Icon>
                  <Text fontWeight="bold" fontSize="xl">
                    {formatNumber(userWithdrawnAmount)}
                  </Text>

                  <Text fontSize="sm" color="gray.500">
                    {`~$${formatNumber(userWithdrawnAmount * heInfo.price, 2)}`}
                  </Text>
                </HStack>
              ) : (
                "--"
              )}
            </Skeleton>
          </VStack>
          <ClaimableAmount
            isLoading={isLoadingClaimableAmount || isLoadingClaimableAmount2}
            claimableAmount={
              option === 1
                ? claimableAmount
                : claimableAmount > 0
                ? claimableAmount2
                : 0
            }
          />
        </Stack>
        {!!ethereum && (
          <Stack mb={5} direction={["column", "row"]} flexWrap="wrap">
            <VStack flex={1} alignItems="flex-start">
              <Text fontWeight="semibold" color="gray.500" fontSize="sm">
                Choose an option
              </Text>

              <RadioGroup
                onChange={(val) => {
                  setOption(Number(val) as any);
                }}
                value={option}
              >
                <Stack spacing={5} direction="column">
                  <Radio size="md" colorScheme="primary" value={1}>
                    <Stack spacing={5} alignItems="center" direction="row">
                      <Text
                        color="gray.500"
                        fontSize="sm"
                        fontWeight="semibold"
                      >
                        Option&nbsp;1:
                      </Text>
                      <Text color="gray.500" fontSize="sm">
                        Old vesting mechanism, 5% per month - receive every
                        month. The requirement under SAFT terms is that you
                        support H&E promotion.
                      </Text>
                    </Stack>
                  </Radio>
                  <Radio size="md" colorScheme="primary" value={2}>
                    <Stack spacing={5} alignItems="center" direction="row">
                      <Text
                        color="gray.500"
                        fontSize="sm"
                        fontWeight="semibold"
                      >
                        Option&nbsp;2:
                      </Text>
                      <Text color="gray.500" fontSize="sm">
                        New Vesting mechanism, pay all tokens at once, but you
                        only get 50% of total tokens, and the remaining 50% of
                        tokens are burned.
                      </Text>
                    </Stack>
                  </Radio>
                </Stack>
              </RadioGroup>
            </VStack>
          </Stack>
        )}
        {!!ethereum ? (
          <HStack>
            <Button as={Link} flex={1} colorScheme="primary" to="/stake">
              Join Stake
            </Button>
            <Button
              flex={1}
              colorScheme="primary"
              variant="outline"
              onClick={onClick}
              disabled={
                // (claimableAmount <= 0 && option === 1) ||
                // (claimableAmount2 <= 0 && option === 2) ||
                claimableAmount <= 0 || !!(startTime && now < startTime)
              }
              isLoading={isClaiming || isOption2Claiming}
            >
              {startTime && now < startTime ? (
                <Countdown date={startTime} daysInHours />
              ) : (
                "Claim"
              )}
            </Button>
          </HStack>
        ) : (
          <ConnectWalletButton />
        )}
      </Card>
      <Card p={0}>
        <Image
          src={MilestoneBanner}
          alt="milestone banner"
          borderRadius="10px"
        />
      </Card>
    </VStack>
  );
};

export default ClaimV2;
