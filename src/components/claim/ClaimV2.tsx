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
import SwitchVersion from "components/SwitchVersion";

const ClaimV2: React.FC = () => {
  const { isConnected, account } = useWallet();
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
    async () => (await fetch(`${CONFIGS.DASHBOARD_API_URL}/api/v1/hePrice`)).json(),
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
  } = useQuery(["getUserTotalAmount", account], () => getUserTotalAmount(account || ""), {
    enabled: isConnected(),
  });

  const {
    data: userWithdrawnAmount,
    isLoading: isLoadingUserWithdrawnAmount,
    refetch: refetchUserWithdrawnAmount,
  } = useQuery(
    ["getUserTotalWithdrawnAmount", account],
    () => getUserWithdrawnAmount(account || ""),
    {
      enabled: isConnected(),
    }
  );

  const {
    data: claimableAmount = 0,
    refetch: refetchClaimableAmount,
    isLoading: isLoadingClaimableAmount,
  } = useQuery(["getClaimOption1", account], () => getClaimableAmount(account || ""), {
    enabled: isConnected(),
  });
  const {
    data: claimableAmount2 = 0,
    refetch: refetchClaimableAmount2,
    isLoading: isLoadingClaimableAmount2,
  } = useQuery(["getClaimOption2", account], () => getClaimableOption2Amount(account || ""), {
    enabled: isConnected(),
  });

  const { data: startTime = 0, isLoading: isLoadingStartTime } = useQuery(
    "getStartTime",
    () => getStartTime(),
    {
      enabled: isConnected(),
    }
  );

  const { mutate, isLoading: isClaiming } = useMutation(claimOption1, {
    onSuccess: () => {
      toast.success(`Claim ${formatNumber(claimableAmount)} HE successfully!`);
      onSuccess();
    },
    onError: (error: ErrorContract) => {
      if (error.code === 4001) toast.error("Please allow transaction!");
    },
  });
  const { mutate: mutateOption2, isLoading: isOption2Claiming } = useMutation(claimOption2, {
    onSuccess: () => {
      toast.success(`Claim ${formatNumber(claimableAmount)} HE successfully!`);
      onSuccess();
    },
    onError: (error: ErrorContract) => {
      if (error.code === 4001) toast.error("Please allow transaction!");
    },
  });

  const onClick = () => {
    if (isConnected()) {
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
          <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Text fontWeight="bold" fontSize="xl" color="primary">
              My HE Claiming
            </Text>
            <SwitchVersion isV2={true} />
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
              {isConnected() && userWithdrawnAmount !== undefined ? (
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
            claimableAmount={option === 1 ? claimableAmount : claimableAmount2}
          />
        </Stack>
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
              <Stack spacing={5} direction="row">
                <Radio size="md" colorScheme="gray" value={1}>
                  Option 1
                </Radio>
                <Radio size="md" colorScheme="gray" value={2}>
                  Option 2
                </Radio>
              </Stack>
            </RadioGroup>
          </VStack>
        </Stack>
        <Stack mb={5} direction={["column", "row"]} flexWrap="wrap">
          <Stack spacing={5} direction="row">
            <Text color="gray.500" as="i" fontSize="sm" fontWeight="semibold">
              Option&nbsp;1:
            </Text>
            <Text color="gray.500" as="i" fontSize="sm">
              Old vesting mechanism, 5% per month - receive every month. The requirement under SAFT
              terms is that you support H&E promotion.
            </Text>
          </Stack>
        </Stack>
        <Stack mb={5} direction={["column", "row"]} flexWrap="wrap">
          <Stack spacing={5} direction="row">
            <Text color="gray.500" as="i" fontSize="sm" fontWeight="semibold">
              Option&nbsp;2:
            </Text>
            <Text color="gray.500" as="i" fontSize="sm">
              New Vesting mechanism, pay all tokens at once, but you only get 50% of total tokens,
              and the remaining 50% of tokens are burned.
            </Text>
          </Stack>
        </Stack>
        {isConnected() ? (
          <HStack>
            <Button
              flex={1}
              background="primary"
              color="white"
              _hover={{ background: "#BF8B02" }}
              onClick={() => {
                window.open("https://stake.heroesempires.com/", "_blank");
              }}
            >
              Join Stake
            </Button>
            <Button
              flex={1}
              color="primary"
              variant="outline"
              borderColor="primary"
              onClick={onClick}
              disabled={
                (claimableAmount <= 0 && option === 1) ||
                (claimableAmount2 <= 0 && option === 2) ||
                !!(startTime && now < startTime)
              }
              isLoading={isClaiming || isOption2Claiming}
            >
              {startTime && now < startTime ? <Countdown date={startTime} daysInHours /> : "Claim"}
            </Button>
          </HStack>
        ) : (
          <ConnectWalletButton />
        )}
      </Card>
      <Card p={0}>
        <Image src={MilestoneBanner} alt="milestone banner" borderRadius="10px" />
      </Card>
    </VStack>
  );
};

export default ClaimV2;
