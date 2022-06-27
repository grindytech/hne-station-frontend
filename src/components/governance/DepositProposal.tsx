import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  VStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import CardBody from "components/card/CardBody";
import CardHeader from "components/card/CardHeader";
import ConnectWalletButton from "components/connectWalletButton/ConnectWalletButton";
import Loading from "components/state/Loading";
import configs from "configs";
import { getHEAccountBalance } from "contracts/contracts";
import { depositProposal, getProposal } from "contracts/governance";
import { erc20Approve, erc20Approved } from "contracts/swap";
import { formatDistance, formatDistanceToNow } from "date-fns";
import useCustomToast from "hooks/useCustomToast";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { ProposalStatus } from "services/types/ProposalStatus";
import { useWallet } from "use-wallet";
import { colorsUtil, convertToContractValue, formatDate, numeralFormat } from "utils/utils";

function DepositForm({ proposalId }: { proposalId: string }) {
  const { account, isConnected } = useWallet();
  const [amount, setAmount] = useState<string>();
  const [approving, setApproving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useCustomToast();
  const [now, setNow] = useState(Date.now());

  const { data: heBalance = 0, isRefetching: heBalanceFetching } = useQuery(
    ["getHEAccountBalance", account],
    async () => {
      const balance = await getHEAccountBalance("HE", account || "");
      return parseInt(String(balance ?? 0));
    },
    {
      enabled: isConnected(),
    }
  );
  // const { data: minimumDeposit, isFetching: minDepositFetching } = useQuery(
  //   "minDeposit",
  //   async () => {
  //     return Number(await minDeposit()) / 1e18;
  //   }
  // );
  const { data: proposal, isFetching: proposalRefetching } = useQuery(
    ["getProposal", proposalId],
    async () => {
      return await getProposal(String(proposalId));
    },
    { enabled: !!proposalId }
  );

  const {
    data: approved,
    isFetching: approvedFetching,
    refetch: refetchApproved,
  } = useQuery(
    ["approved", account],
    () => erc20Approved(1e9, "HE", configs.GOVERNANCE_CONTRACT, String(account)),
    { enabled: !!account }
  );
  const approve = async () => {
    try {
      setApproving(true);
      await erc20Approve("HE", configs.GOVERNANCE_CONTRACT, String(account));
      await refetchApproved();
      toast.success("Approve successfully");
    } catch (error) {
      console.error(error);
      toast.error("Transaction fail");
    } finally {
      setApproving(false);
    }
  };
  const depositProposalHandle = async () => {
    try {
      setLoading(true);
      await depositProposal(
        proposalId,
        convertToContractValue({ amount: Number(amount) }),
        String(account)
      );
      toast.success("Transaction successfully");
    } catch (error) {
      console.error(error);
      toast.error("Transaction fail");
    } finally {
      setLoading(false);
    }
  };
  const { data: amountInvalid } = useQuery(["DepositForm-amountInvalid", amount], () => {
    let msg = "";
    if (!amount) {
      msg = "Amount is required";
    }
    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      msg = "Please input an valid amount";
    }
    if (num > heBalance) {
      msg = "Insufficient balance";
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
            {/* {minimumDeposit && (
              <Alert status="info">
                <AlertIcon />
                <AlertDescription color="primary.500" fontSize="sm">
                  Minimum deposit is {numeralFormat(Number(minimumDeposit))} HE
                </AlertDescription>
              </Alert>
            )} */}

            {now >= Number(proposal?.endDeposit ?? 0) * 1e3 && (
              <Alert status="error">
                <AlertIcon />
                <AlertDescription color="primary.500" fontSize="sm">
                  Deposit was ended
                </AlertDescription>
              </Alert>
            )}
          </VStack>
          <FormControl isInvalid={amount !== undefined && !!amountInvalid} colorScheme="primary">
            <FormLabel color="primary.500" htmlFor="title">
              Amount
            </FormLabel>
            <InputGroup>
              <Input
                disabled={now >= Number(proposal?.endDeposit ?? 0) * 1e3}
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
              <InputRightAddon color="primary.500" children="HE" />
            </InputGroup>
            <FormErrorMessage>{amountInvalid}</FormErrorMessage>
          </FormControl>
          <HStack w="full" justifyContent="space-between">
            <FormLabel margin={0} color="primary.500">
              Balance
            </FormLabel>
            <Skeleton isLoaded={!heBalanceFetching}>
              <ChakraLink
                onClick={() => {
                  setAmount(String(heBalance));
                }}
                _hover={{ textDecoration: "none" }}
                color="primary.500"
                fontSize="sm"
              >
                {numeralFormat(Number(heBalance))} HE
              </ChakraLink>
            </Skeleton>
          </HStack>

          {!isConnected() ? (
            <ConnectWalletButton w="full" />
          ) : approved ? (
            <Button
              onClick={depositProposalHandle}
              w="full"
              isLoading={loading}
              disabled={
                !!amountInvalid || loading || now >= Number(proposal?.endDeposit ?? 0) * 1e3
              }
              colorScheme="primary"
            >
              Deposit
            </Button>
          ) : (
            <Button
              onClick={approve}
              w="full"
              isLoading={approving}
              disabled={approving || approvedFetching}
              colorScheme="primary"
            >
              Approve
            </Button>
          )}
          {Number(proposal?.endDeposit) && (
            <Tooltip label={formatDate(Number(proposal?.endDeposit) * 1e3)}>
              <Text w="full" fontSize="sm" color="primary.500">
                Ended{" "}
                {formatDistance(Number(proposal?.endDeposit) * 1e3, now, {
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
export function ProposalInfo({ proposalId }: { proposalId: string }) {
  const { data: proposal, isFetching: proposalRefetching } = useQuery(
    ["getProposal", proposalId],
    async () => {
      // const proposals = await governanceService.getProposals({ proposalId: proposalId });
      // if (proposals && proposals?.items.length > 0) {
      //   return proposals.items[0];
      // }
      return await getProposal(String(proposalId));
    },
    { enabled: !!proposalId }
  );
  return (
    <>
      {proposalRefetching ? (
        <Loading />
      ) : (
        <Box w="full">
          <Link to={`/proposal/${proposalId}`}>
            <Card
              width="full"
              borderWidth={1}
              _hover={{ borderColor: "primary.300", cursor: "pointer" }}
            >
              <CardHeader>
                <HStack mb={2} justifyContent="space-between" w="full">
                  <Text fontSize="sm" color="primary.500" colorScheme="primary">
                    {proposalId}
                  </Text>
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color={
                      colorsUtil.PROPOSAL_STATUS_COLORS[proposal?.status ?? ProposalStatus.Voting]
                    }
                  >
                    {proposal?.status && ProposalStatus[proposal?.status]}
                  </Text>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack w="full" align="start">
                  <Text fontSize="lg" color="primary.600">
                    {proposal?.title}
                  </Text>
                  {Number(proposal?.blockTime) && (
                    <Tooltip label={formatDate(new Date((proposal?.blockTime ?? 0) * 1e3))}>
                      <Text fontSize="sm" color="primary.500" colorScheme="primary">
                        Submitted{" "}
                        {formatDistanceToNow(new Date((proposal?.blockTime ?? 0) * 1e3), {
                          addSuffix: true,
                        })}
                      </Text>
                    </Tooltip>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </Link>
        </Box>
      )}
    </>
  );
}
export function DepositProposal() {
  const { proposalId } = useParams();
  return (
    <VStack w="full">
      <Heading w="full" mb={5} mt={[10, 5]} as="h3" color="primary.500">
        Deposit
      </Heading>
      <Stack spacing={[10, 5]} w="full" direction={{ md: "row", base: "column-reverse" }}>
        <DepositForm proposalId={String(proposalId)} />
        <ProposalInfo proposalId={String(proposalId)} />
      </Stack>
    </VStack>
  );
}
