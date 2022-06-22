import { Button, HStack } from "@chakra-ui/react";
import { activeDeposit } from "contracts/governance";
import useCustomToast from "hooks/useCustomToast";
import { useState } from "react";
import { ProposalStatus } from "services/types/ProposalStatus";
import { useWallet } from "use-wallet";

export default function AdminAction({
  proposalId,
  onSuccess,
}: {
  proposalId: string;
  onSuccess: () => void;
}) {
  const [activeLoading, setActiveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const { account } = useWallet();
  const toast = useCustomToast();
  const active = async () => {
    try {
      setActiveLoading(true);
      await activeDeposit(proposalId, ProposalStatus.Deposit, String(account));
      toast.success("Active proposal successfully");
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setActiveLoading(false);
    }
  };
  const reject = async () => {
    try {
      setRejectLoading(true);
      await activeDeposit(proposalId, ProposalStatus.RejectedByAdmin, String(account));
      toast.success("Proposal rejected");
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setRejectLoading(false);
    }
  };
  return (
    <HStack>
      <Button
        disabled={activeLoading || rejectLoading}
        isLoading={activeLoading}
        onClick={active}
        colorScheme="primary"
      >
        Active
      </Button>
      <Button
        disabled={activeLoading || rejectLoading}
        isLoading={rejectLoading}
        onClick={reject}
        colorScheme="primary"
        variant="outline"
      >
        Reject
      </Button>
    </HStack>
  );
}
