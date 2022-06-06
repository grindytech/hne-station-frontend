import React from "react";

import PendingClaimItem from "./PendingClaimItem";
import { ClaimInfo } from "contracts/stake";

interface Props {
  claimStatus: number;
  isHideNumbers: boolean;
  onSuccess: () => void;
  pendingClaims: ClaimInfo[];
}

const PendingClaim: React.FC<Props> = ({ isHideNumbers, claimStatus, pendingClaims, onSuccess }) => {
  return (
    <>
      {React.Children.toArray(
        pendingClaims.map(({ amount, blockTime, claimTime, status }, index) =>
          status === claimStatus ? (
            <PendingClaimItem
              isHideNumbers={isHideNumbers}
              claimId={index}
              amount={amount}
              blockTime={blockTime}
              claimTime={claimTime}
              status={status}
              onSuccess={() => {
                onSuccess();
              }}
            />
          ) : (
            <></>
          )
        )
      )}
    </>
  );
};

export default PendingClaim;
