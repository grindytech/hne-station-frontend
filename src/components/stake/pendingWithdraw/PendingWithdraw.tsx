import React from "react";

import { WithdrawInfo } from "contracts/stake";

import PendingWithdrawItem from "./PendingWithdrawItem";

interface Props {
  onSuccess: () => void;
  withdrawStatus: number;
  isHideNumbers: boolean;
  pendingWithdraws: WithdrawInfo[];
}

const PendingWithdraw: React.FC<Props> = ({ isHideNumbers, pendingWithdraws, withdrawStatus, onSuccess }) => {
  return (
    <>
      {React.Children.toArray(
        pendingWithdraws.map(({ amount, blockTime, withdrawTime, status }, index) =>
          status === withdrawStatus ? (
            <PendingWithdrawItem
              isHideNumbers={isHideNumbers}
              withdrawId={index}
              amount={amount}
              withdrawTime={withdrawTime}
              blockTime={blockTime}
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

export default PendingWithdraw;
