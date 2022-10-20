import { Box, Button, HStack, Icon, Text } from "@chakra-ui/react";
import { format, formatDistanceToNow } from "date-fns";
import React from "react";
import { useMutation, useQuery } from "react-query";

import { TimeIcon } from "@chakra-ui/icons";
import { ReactComponent as HEIcon } from "assets/he_coin.svg";
import configs from "configs";
import { CLAIMED_STATUS, DATE_TIME_FORMAT } from "constant";
import { claimHE, ClaimInfo, getTimeLockClaim } from "contracts/stake";
import useCustomToast from "hooks/useCustomToast";
import { useConnectWallet } from "hooks/useWallet";
import { formatNumber } from "utils/utils";

interface Props extends ClaimInfo {
  claimId: number;
  isHideNumbers: boolean;
  onSuccess: () => void;
}

const PendingClaimItem: React.FC<Props> = ({
  claimId,
  isHideNumbers,
  status,
  blockTime,
  claimTime,
  amount,
  onSuccess
}) => {
  const { account } = useConnectWallet();
  const toast = useCustomToast();

  const { data: timeLockClaim = 0 } = useQuery(["timeLockClaim", account], getTimeLockClaim);

  const claimableTime = blockTime + timeLockClaim * 1000;
  const isDisableClaim = claimableTime > new Date().getTime();
  const claimTimeString = formatDistanceToNow(claimableTime, { addSuffix: true });

  const { mutate, isLoading: isLoadingClaim } = useMutation(claimHE, {
    onSuccess: () => {
      toast.success(`Claim ${amount} ${configs.TOKEN_SYMBOL} successfully!`);
      onSuccess();
    }
    // onError: (error: ErrorContract) => {
    //   if (error.code === 4001) setErrorMsg("Please allow transaction!");
    // }
  });

  const onClick = () => {
    mutate({ poolId: 0, claimId, address: account || "" });
  };

  return (
    <Box>
      <HStack justifyContent="space-between">
        <HStack>
          <Icon w="1em" h="1em">
            <HEIcon />
          </Icon>
          <Text fontWeight="bold">{isHideNumbers ? "**" : formatNumber(amount)}</Text>
        </HStack>
        {status === CLAIMED_STATUS ? (
          <>{format(claimTime, DATE_TIME_FORMAT)}</>
        ) : isDisableClaim ? (
          <Text as="div" fontSize="sm" textAlign="center" color="gray.500">
            <TimeIcon /> {claimTimeString}
          </Text>
        ) : (
          <Button
            colorScheme="primary"
            variant="ghost"
            isLoading={isLoadingClaim}
            size="sm"
            onClick={onClick}
          >
            Claim reward
          </Button>
        )}
      </HStack>
    </Box>
  );
};

export default PendingClaimItem;
