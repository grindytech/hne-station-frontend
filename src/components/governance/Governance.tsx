import { Button, ButtonGroup, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import Card from "components/card/Card";
import CardBody from "components/card/CardBody";
import { useState } from "react";
import { ProposalStatus } from "services/types/ProposalStatus";
import { Proposals } from "./Proposals";
import { SystemInfo } from "./SystemInfo";

export default function Governance() {
  const [status, setStatus] = useState(ProposalStatus.Voting);
  return (
    <>
      <Card>
        <CardBody>
          <ButtonGroup gap="4">
            <Button
              onClick={() => {
                setStatus(ProposalStatus.Voting);
              }}
              variant={status === ProposalStatus.Voting ? "outline" : "ghost"}
              colorScheme="primary"
            >
              Voting
            </Button>
            <Button
              onClick={() => {
                setStatus(ProposalStatus.Deposit);
              }}
              variant={status === ProposalStatus.Deposit ? "outline" : "ghost"}
              colorScheme="primary"
            >
              Deposit
            </Button>
            <Button
              onClick={() => {
                setStatus(ProposalStatus.Passed);
              }}
              variant={status === ProposalStatus.Passed ? "outline" : "ghost"}
              colorScheme="primary"
            >
              Passed
            </Button>
            <Button
              onClick={() => {
                setStatus(ProposalStatus.Failed);
              }}
              variant={status === ProposalStatus.Failed ? "outline" : "ghost"}
              colorScheme="primary"
            >
              Rejected
            </Button>
          </ButtonGroup>
        </CardBody>
      </Card>
      <Proposals status={status} />
      <SystemInfo />
    </>
  );
}
