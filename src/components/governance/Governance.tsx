import { Button, ButtonGroup, Icon } from "@chakra-ui/react";
import Card from "components/card/Card";
import CardBody from "components/card/CardBody";
import { isAdmin } from "contracts/governance";
import { useIsAdmin } from "hooks/useIsAdmin";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ProposalStatus } from "services/types/ProposalStatus";
import { useWallet } from "use-wallet";
import { Proposals } from "./Proposals";
import { SystemInfo } from "./SystemInfo";
import { GrUserAdmin} from 'react-icons/gr'

export default function Governance() {
  const [status, setStatus] = useState(ProposalStatus.Voting);
  const { hash } = useLocation();
  const { account, isConnected } = useWallet();
  const { admin, adminLoading } = useIsAdmin({ enabled: isConnected(), key: String(account) });
  useEffect(() => {
    const section = String(hash).substring(1);
    if (section === "deposit") {
      setStatus(ProposalStatus.Deposit);
    } else if (section === "passed") {
      setStatus(ProposalStatus.Passed);
    } else if (section === "rejected") {
      setStatus(ProposalStatus.Failed);
    } else if (section === "pending") {
      setStatus(ProposalStatus.Pending);
    } else if (section === "admin-rejected") {
      setStatus(ProposalStatus.RejectedByAdmin);
    } else {
      setStatus(ProposalStatus.Voting);
    }
  }, [hash]);
  return (
    <>
      <Card>
        <CardBody>
          <ButtonGroup gap="4">
            <Button
              variant={status === ProposalStatus.Voting ? "outline" : "ghost"}
              colorScheme="primary"
              to="#voting"
              id="voting"
              as={Link}
            >
              Voting
            </Button>
            <Button
              variant={status === ProposalStatus.Deposit ? "outline" : "ghost"}
              colorScheme="primary"
              to="#deposit"
              id="deposit"
              as={Link}
            >
              Deposit
            </Button>
            <Button
              variant={status === ProposalStatus.Passed ? "outline" : "ghost"}
              colorScheme="primary"
              to="#passed"
              id="passed"
              as={Link}
            >
              Passed
            </Button>
            <Button
              variant={status === ProposalStatus.Failed ? "outline" : "ghost"}
              colorScheme="primary"
              to="#rejected"
              id="rejected"
              as={Link}
            >
              Rejected
            </Button>
            {admin && !adminLoading && (
              <>
                <Button
                  leftIcon={<Icon as={GrUserAdmin} />}
                  variant={status === ProposalStatus.Pending ? "outline" : "ghost"}
                  colorScheme="primary"
                  to="#pending"
                  id="pending"
                  as={Link}
                >
                  Pending
                </Button>
                <Button
                  leftIcon={<Icon as={GrUserAdmin} />}
                  variant={status === ProposalStatus.RejectedByAdmin ? "outline" : "ghost"}
                  colorScheme="primary"
                  to="#admin-rejected"
                  id="admin-rejected"
                  as={Link}
                >
                  Admin rejected
                </Button>
              </>
            )}
          </ButtonGroup>
        </CardBody>
      </Card>
      <Proposals key={`proposals-${status}`} status={status} />
      <SystemInfo />
    </>
  );
}
