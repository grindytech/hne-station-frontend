import React from "react";
import { useMutation, useQuery } from "react-query";
import { HStack, Button, Text, Icon, Box } from "@chakra-ui/react";
import { formatDistanceToNow, format } from "date-fns";

import { claimHE, ClaimInfo, getTimeLockClaim } from "contracts/stake";
import useCustomToast from "hooks/useCustomToast";
import { formatNumber } from "utils/utils";
import { useWallet } from "use-wallet";
import { ReactComponent as HEIcon } from "assets/he_coin.svg";
import { TimeIcon } from "@chakra-ui/icons";
import { CLAIMED_STATUS, DATE_TIME_FORMAT } from "constant";

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
  const { account } = useWallet();
  const toast = useCustomToast();

  const { data: timeLockClaim = 0 } = useQuery(["timeLockClaim", account], getTimeLockClaim);

  const claimableTime = blockTime + timeLockClaim * 1000;
  const isDisableClaim = claimableTime > new Date().getTime();
  const claimTimeString = formatDistanceToNow(claimableTime, { addSuffix: true });

  const { mutate, isLoading: isLoadingClaim } = useMutation(claimHE, {
    onSuccess: () => {
      toast.success(`Claim ${amount} HE successfully!`);
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
          <Button isLoading={isLoadingClaim} size="sm" onClick={onClick}>
            Claim reward
          </Button>
        )}
      </HStack>
    </Box>
  );
};

export default PendingClaimItem;
