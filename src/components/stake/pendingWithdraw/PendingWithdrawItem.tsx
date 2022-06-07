import React from "react";
import { useMutation, useQuery } from "react-query";
import { format, formatDistanceToNow } from "date-fns";

import { getTimeLockWithdraw, withdrawHE, WithdrawInfo } from "contracts/stake";
import useCustomToast from "hooks/useCustomToast";
import { HStack, Button, Text, Icon, Box } from "@chakra-ui/react";
import { TimeIcon } from "@chakra-ui/icons";
import { formatNumber } from "utils/utils";
import { ReactComponent as HEIcon } from "assets/he_coin.svg";
import { ErrorContract } from "types";
import { useWallet } from "use-wallet";
import { CLAIMED_STATUS, DATE_TIME_FORMAT } from "constant";

interface Props extends WithdrawInfo {
  withdrawId: number;
  isHideNumbers: boolean;
  onSuccess: () => void;
}

const PendingWithdrawItem: React.FC<Props> = ({
  withdrawId,
  isHideNumbers,
  status,
  blockTime,
  withdrawTime,
  amount,
  onSuccess
}) => {
  const toast = useCustomToast();
  const { account } = useWallet();

  const { data: timeLockWithdraw = 0 } = useQuery(["timeLockWithdraw", account], getTimeLockWithdraw);

  const withdrawableTime = blockTime + timeLockWithdraw * 1000;
  const isDisableWithdraw = withdrawableTime > new Date().getTime();
  const withdrawTimeString = formatDistanceToNow(withdrawableTime, {
    addSuffix: true
  });

  const { mutate, isLoading: isLoadingWithdraw } = useMutation(withdrawHE, {
    onSuccess: () => {
      toast.success(`Withdraw ${amount} HE successfully!`);
      onSuccess();
    },
    onError: (error: ErrorContract) => {
      if (error.code === 4001) toast.error("Please allow transaction!");
    }
  });

  const onClick = () => {
    mutate({ poolId: 0, withdrawId: withdrawId, address: account || "" });
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
          <>{format(withdrawTime, DATE_TIME_FORMAT)}</>
        ) : isDisableWithdraw ? (
          <Text as="div" fontSize="sm" textAlign="center" color="gray.500">
            <TimeIcon /> {withdrawTimeString}
          </Text>
        ) : (
          <Button
            size="sm"
            colorScheme="primary"
            variant="ghost"
            onClick={onClick}
            isLoading={isLoadingWithdraw}
          >
            Withdraw
          </Button>
        )}
      </HStack>
    </Box>
  );
};

export default PendingWithdrawItem;
