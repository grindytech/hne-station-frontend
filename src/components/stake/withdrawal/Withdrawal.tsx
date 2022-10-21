import { Text, VStack } from "@chakra-ui/react";
import React from "react";

import Card from "components/card/Card";
import CardHeader from "components/card/CardHeader";
import PendingClaim from "components/stake/pendingClaim/PendingClaim";
import PendingWithdraw from "components/stake/pendingWithdraw/PendingWithdraw";
import { getUserPendingClaim, getUserPendingWithdraw } from "contracts/stake";
import { useConnectWallet } from "connectWallet/useWallet";
import { isEmpty } from "lodash";
import { useQuery } from "react-query";

interface Props {
  isHideNumbers: boolean;
  onSuccess: () => void;
}

export const pendingWithdrawQueryKey = "getUserPendingWithdraw";
export const pendingClaimQueryKey = "getUserPendingClaim";

const Withdrawal: React.FC<Props> = ({ isHideNumbers, onSuccess }) => {
  const { ethereum, account } = useConnectWallet();
  const {
    data: pendingWithdraws,
    isLoading,
    refetch: refetchPendingWithdraws,
  } = useQuery(
    pendingWithdrawQueryKey,
    () => getUserPendingWithdraw(0, account || ""),
    {
      enabled: !!ethereum,
    }
  );

  const {
    data: pendingClaims,
    isLoading: isLoadingClaims,
    refetch: refetchPendingClaims,
  } = useQuery(
    [pendingClaimQueryKey, account],
    () => getUserPendingClaim(0, account || ""),
    {
      enabled: !!ethereum,
    }
  );

  const isShow =
    !isEmpty(pendingWithdraws?.filter(({ status }) => status === 0)) ||
    !isEmpty(pendingClaims?.filter(({ status }) => status === 0));

  return pendingWithdraws && pendingClaims && isShow ? (
    <Card>
      <CardHeader mb={[3, 4]}>
        <Text fontWeight="bold" fontSize="xl" color="primary.500">
          Withdrawal
        </Text>
      </CardHeader>
      <VStack alignItems="stretch" maxH={200} overflow="auto">
        <PendingWithdraw
          withdrawStatus={0}
          pendingWithdraws={pendingWithdraws}
          isHideNumbers={isHideNumbers}
          onSuccess={() => {
            onSuccess();
            refetchPendingWithdraws();
          }}
        />
        <PendingClaim
          claimStatus={0}
          isHideNumbers={isHideNumbers}
          pendingClaims={pendingClaims}
          onSuccess={() => {
            onSuccess();
            refetchPendingClaims();
          }}
        />
      </VStack>
    </Card>
  ) : (
    <></>
  );
};

export default Withdrawal;
