import { InfoOutlineIcon } from "@chakra-ui/icons";
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
  Text,
  Textarea,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import CardBody from "components/card/CardBody";
import ConnectWalletButton from "components/connectWalletButton/ConnectWalletButton";
import configs from "configs";
import { getHEAccountBalance } from "contracts/contracts";
import { createProposal, initialProposal } from "contracts/governance";
import { erc20Approve, erc20Approved } from "contracts/swap";
import useCustomToast from "hooks/useCustomToast";
import { useState } from "react";
import { useQuery } from "react-query";
import { useWallet } from "use-wallet";
import { numeralFormat } from "utils/utils";

export default function NewProposal() {
  const { isConnected, account } = useWallet();
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [approving, setApproving] = useState<boolean>(false);
  const toast = useCustomToast();
  const { data: heBalance = 0 } = useQuery(
    ["getHEAccountBalance", account],
    () => getHEAccountBalance("HE", account || ""),
    {
      enabled: isConnected(),
    }
  );

  const { data: titleError } = useQuery(["NewProposal-titleError", title], () => {
    let err = "";
    if (!title) err = "Title is required";
    return err;
  });
  const { data: descriptionError } = useQuery(["NewProposal-descriptionError", description], () => {
    let err = "";
    if (!description) err = "Description is required";
    return err;
  });
  const { data: initial, isFetching: initialProposalFetching } = useQuery(
    "initialProposal",
    async () => {
      return Number(await initialProposal()) / 1e18;
    }
  );

  const { data: initialError } = useQuery(
    ["NewProposal-initialError", initial, heBalance],
    async () => {
      let err = "";
      const n = Number(initial);
      if (isNaN(n)) err = "Please input a number";
      if (n < 0 || n > heBalance) err = "Insufficient balance";
      return err;
    }
  );

  const createProposalHandle = async () => {
    try {
      setLoading(true);
      await createProposal(String(title), String(description), String(account));
      toast.success(`Proposal created successfully`);
    } catch (error) {
      console.error(error);
      toast.error("Transaction fail");
    } finally {
      setLoading(false);
    }
  };
  const {
    data: approved,
    isFetching: approvedFetching,
    refetch: refetchApproved,
  } = useQuery(
    ["approved", account, initial],
    () => erc20Approved(Number(initial), "HE", configs.GOVERNANCE_CONTRACT, String(account)),
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
  return (
    <VStack margin="auto" maxW="lg">
      <Heading w="full" mb={5} mt={[10, 5]} as="h3" color="primary.500">
        New proposal
      </Heading>
      <Card>
        <CardBody py="5">
          <VStack w="full" px={5} spacing={5}>
            <Alert status="info">
              <AlertIcon />
              <AlertDescription color="primary.500" fontSize="sm">
                Create proposal after{" "}
                <Link
                  target="_blank"
                  color="primary.400"
                  href="https://feedback.heroesempires.com/"
                >
                  forum discussion
                </Link>
              </AlertDescription>
            </Alert>
            <FormControl isInvalid={title !== undefined && !!titleError} colorScheme="primary">
              <FormLabel color="primary.500" htmlFor="title">
                Title
              </FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                color="primary.500"
                maxLength={150}
                id="title"
                type="text"
              />
              <FormErrorMessage>{titleError}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={description !== undefined && !!descriptionError}>
              <FormLabel color="primary.500" htmlFor="description">
                Description
              </FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                h="xs"
                color="primary.500"
                maxLength={500}
                id="description"
              />
              <FormErrorMessage>{descriptionError}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={initial !== undefined && !!initialError} colorScheme="primary">
              <HStack justifyContent="space-between" alignItems="center">
                <FormLabel margin={0} color="primary.500">
                  <HStack alignItems="center">
                    <Text>Initial deposit </Text>
                    <Tooltip
                      label={`You need ${numeralFormat(Number(initial))} HE to initial a proposal`}
                      fontSize="sm"
                    >
                      <InfoOutlineIcon />
                    </Tooltip>
                  </HStack>
                </FormLabel>
                <Skeleton isLoaded={!initialProposalFetching}>
                  <Text color="primary.500" fontSize="sm">
                    {numeralFormat(Number(initial))} HE
                  </Text>
                </Skeleton>
              </HStack>
            </FormControl>
            {!isConnected() ? (
              <ConnectWalletButton w="full" />
            ) : initialError ? (
              <Button w="full" disabled colorScheme="primary">
                {initialError}
              </Button>
            ) : approved ? (
              <Button
                onClick={createProposalHandle}
                w="full"
                isLoading={loading}
                disabled={!!titleError || !!descriptionError || !!initialError || loading}
                colorScheme="primary"
              >
                {"New proposal"}
              </Button>
            ) : (
              <Button
                onClick={approve}
                w="full"
                isLoading={approving}
                disabled={approving}
                colorScheme="primary"
              >
                {"Approve"}
              </Button>
            )}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}
