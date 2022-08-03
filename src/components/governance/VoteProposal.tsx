import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import CardBody from "components/card/CardBody";
import ConnectWalletButton from "components/connectWalletButton/ConnectWalletButton";
import { getProposal, getVoted, vote } from "contracts/governance";
import { getUserInfo } from "contracts/stake";
import { formatDistance } from "date-fns";
import useCustomToast from "hooks/useCustomToast";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { VoteType } from "services/types/VoteType";
import { useWallet } from "use-wallet";
import { gaEvent } from "utils/gAnalytics";
import { convertToContractValue, formatDate, numeralFormat } from "utils/utils";
import { ProposalInfo } from "./DepositProposal";

function VoteForm({ proposalId }: { proposalId: string }) {
  const { account, isConnected } = useWallet();
  const [amount, setAmount] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useCustomToast();
  const [now, setNow] = useState(Date.now());
  const [voteType, setVoteType] = useState<VoteType>();

  const {
    data: userStakeInfo,
    isLoading: isLoadingUserStakeInfo,
    refetch: refetchUserStakeInfo,
  } = useQuery(["getUserInfo", account], () => getUserInfo(0, account || ""), {
    enabled: isConnected(),
  });
  const { data: proposal, isFetching: proposalRefetching } = useQuery(
    ["getProposal", proposalId],
    async () => {
      return await getProposal(String(proposalId));
    },
    { enabled: !!proposalId }
  );

  const {
    data: availableVotingPower,
    refetch: avlPowerRefetch,
    isFetching: avlPowerFetching,
  } = useQuery(
    ["availableVotingPower", proposalId, account],
    async () => {
      const voted = await getVoted(proposalId, String(account));
      const power = Number(userStakeInfo?.stakeAmount) - Number(voted) / 1e18;
      return power > 0 ? parseInt(String(power)) : 0;
    },
    {
      enabled: !!userStakeInfo,
      onError: (err) => console.error(err),
    }
  );
  useEffect(() => {
    setAmount(availableVotingPower ? String(Number(availableVotingPower)) : undefined);
  }, [avlPowerFetching]);
  const voteProposalHandle = async () => {
    if (!voteType) return;
    try {
      setLoading(true);
      await vote(
        proposalId,
        convertToContractValue({ amount: Number(amount) }),
        voteType,
        String(account)
      );
      toast.success("Transaction successfully");
      avlPowerRefetch();
      gaEvent({ voteProposal: { proposalId, amount, voteType, address: account } });
    } catch (error) {
      console.error(error);
      toast.error("Transaction fail");
    } finally {
      setLoading(false);
    }
  };
  const { data: amountInvalid } = useQuery(["VoteForm-amountInvalid", amount], () => {
    let msg = "";
    if (!amount) {
      msg = "Amount is required";
    }
    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      msg = "Please input an valid amount";
    }
    if (num > Number(availableVotingPower)) {
      msg = "Insufficient voting power";
    }
    return msg;
  });

  const { data: voteTypeInvalid } = useQuery(["VoteForm-voteTypeInvalid", voteType], () => {
    let msg = "";
    if (!voteType) {
      msg = "Choose a vote option";
    }
    return msg;
  });

  useEffect(() => {
    const count = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => {
      clearInterval(count);
    };
  }, []);
  return (
    <Card w="full">
      <CardBody w="full">
        <VStack spacing={5} w="full">
          <VStack w="full">
            {now >= Number(proposal?.endVote ?? 0) * 1e3 && (
              <Alert status="error">
                <AlertIcon />
                <AlertDescription color="primary.500" fontSize="sm">
                  Voting was ended
                </AlertDescription>
              </Alert>
            )}
          </VStack>
          <FormControl>
            <FormLabel w="full" color="primary.500">
              Vote option
            </FormLabel>
            <HStack>
              <Button
                onClick={() => {
                  setVoteType(VoteType.Pass);
                }}
                variant={voteType === VoteType.Pass ? "solid" : "outline"}
                colorScheme="blue"
              >
                Yes
              </Button>
              <Button
                onClick={() => {
                  setVoteType(VoteType.Fail);
                }}
                variant={voteType === VoteType.Fail ? "solid" : "outline"}
                colorScheme="red"
              >
                No
              </Button>
              <Button
                onClick={() => {
                  setVoteType(VoteType.Veto);
                }}
                variant={voteType === VoteType.Veto ? "solid" : "outline"}
                colorScheme="orange"
              >
                No with veto
              </Button>
            </HStack>
          </FormControl>

          <FormControl isInvalid={amount !== undefined && !!amountInvalid} colorScheme="primary">
            <FormLabel color="primary.500" htmlFor="amount">
              Amount
            </FormLabel>
            <Input
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              color="primary.500"
              placeholder="000"
              onKeyDown={(e) => {
                console.log(e.key);
                if (!e.key.match(/[\d\w]/g)) {
                  e.preventDefault();
                }
              }}
            />
            <FormErrorMessage>{amountInvalid}</FormErrorMessage>
          </FormControl>
          <HStack w="full" justifyContent="space-between">
            <FormLabel margin={0} color="primary.500">
              Your available voting power
            </FormLabel>
            <Skeleton isLoaded={!avlPowerFetching}>
              <Link
                onClick={() => {
                  setAmount(String(parseInt(String(availableVotingPower || 0))));
                }}
                _hover={{ textDecoration: "none" }}
                color="primary.500"
                fontSize="sm"
              >
                {numeralFormat(Number(availableVotingPower))}
              </Link>
            </Skeleton>
          </HStack>

          {!isConnected() ? (
            <ConnectWalletButton w="full" />
          ) : (
            <Button
              onClick={voteProposalHandle}
              w="full"
              isLoading={loading}
              disabled={
                !!amountInvalid ||
                !!voteTypeInvalid ||
                loading ||
                now >= Number(proposal?.endVote ?? 0) * 1e3
              }
              colorScheme="primary"
            >
              {voteTypeInvalid ? voteTypeInvalid : "Vote"}
            </Button>
          )}
          {Number(proposal?.endDeposit) && (
            <Tooltip label={formatDate(Number(proposal?.endDeposit) * 1e3)}>
              <Text w="full" fontSize="sm" color="primary.500">
                Ended{" "}
                {formatDistance(Number(proposal?.endVote) * 1e3, now, {
                  includeSeconds: false,
                  addSuffix: true,
                })}
              </Text>
            </Tooltip>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
export function VoteProposal() {
  const { proposalId } = useParams();
  return (
    <VStack w="full">
      <Heading w="full" mb={5} mt={[10, 5]} as="h3" color="primary.500">
        Vote
      </Heading>
      <Stack spacing={[10, 5]} w="full" direction={{ md: "row", base: "column-reverse" }}>
        <VoteForm proposalId={String(proposalId)} />
        <ProposalInfo proposalId={String(proposalId)} />
      </Stack>
    </VStack>
  );
}
