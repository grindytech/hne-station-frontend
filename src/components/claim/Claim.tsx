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
} from "@chakra-ui/react";
import { mdiEye, mdiEyeOff } from "@mdi/js";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useWallet } from "use-wallet";

import Card from "components/card/Card";

import ClaimInputPopup from "components/claimInputPopup/ClaimInputPopup";
import {
  claimHE,
  getClaimableAmount,
  getStartTime,
  getUserTotalAmount,
  getUserWithdrawnAmount,
} from "contracts/claim";

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
// import SwitchVersion from "components/SwitchVersion";

const Claim: React.FC<{ switchVersion: any }> = ({ switchVersion }) => {
  const { isConnected, account } = useWallet();
  const [now, setNow] = useState(Date.now());
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
  } = useQuery([getClaimableAmountQueryKey, account], () => getClaimableAmount(account || ""), {
    enabled: isConnected(),
  });

  const { data: startTime = 0, isLoading: isLoadingStartTime } = useQuery(
    "getStartTime",
    () => getStartTime(),
    {
      enabled: isConnected(),
    }
  );

  const { mutate, isLoading: isClaiming } = useMutation(claimHE, {
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
      mutate({ address: account || "" });
    }
  };

  const onSuccess = () => {
    refetchUserInfo();
    refetchHEPrice();
    refetchUserWithdrawnAmount();
    refetchClaimableAmount();
  };

  return (
    <VStack flex={1}>
      <Card flex={{ lg: 1 }}>
        <VStack mb={4} alignItems="flex-start">
          <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Text fontWeight="bold" fontSize="xl" color="primary.500">
              My HE Claiming
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
          <ClaimableAmount isLoading={isLoadingClaimableAmount} claimableAmount={claimableAmount} />
        </Stack>

        {isConnected() ? (
          <HStack>
            <Button
              flex={1}
              colorScheme="primary"
              onClick={() => {
                window.open("https://stake.heroesempires.com/", "_blank");
              }}
            >
              Join Stake
            </Button>
            <Button
              flex={1}
              colorScheme="primary"
              variant="outline"
              onClick={onClick}
              disabled={claimableAmount <= 0 || !!(startTime && now < startTime)}
              isLoading={isClaiming}
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

export default Claim;
