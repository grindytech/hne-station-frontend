import {
  Button,
  ButtonGroup,
  FormLabel,
  Heading,
  HStack,
  Input,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import CardBody from "components/card/CardBody";
import CardHeader from "components/card/CardHeader";
import ChooseTokenButton, { Token } from "components/swap/ChooseTokenButton";
import configs from "configs";
import { getErc20Balance } from "contracts/bridge";
import { useCallback, useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { HiSwitchVertical } from "react-icons/hi";
import { useQuery } from "react-query";
import { useWallet } from "use-wallet";
import { getSgvIcon, ICONS } from "utils/icons";
import { numeralFormat } from "utils/utils";

const NETWORKS: Token[] = [
  { key: "BSC", icon: getSgvIcon(ICONS.BNB), name: "BSC" },
  { key: "DOS", icon: getSgvIcon(ICONS.DOS), name: "DOS" },
];
const TOKENS_SUPPORT: { [k: string]: (Token & { contract: string })[] } = {};
for (const network of NETWORKS) {
  TOKENS_SUPPORT[network.key] = configs.BRIDGE.TOKENS[network.key].map(
    (token) => ({
      key: token.key,
      icon: getSgvIcon(token.key),
      name: "0",
      contract: token.contract,
    })
  );
}

export default function Bridge() {
  const numberPoint = 6;
  const [originChain, setOriginChain] = useState(NETWORKS[0]);
  const [destinationChain, setDestinationChain] = useState(NETWORKS[1]);
  const [originToken, setOriginToken] = useState("HE");
  const [destinationToken, setDestinationToken] = useState("SKY");
  const { account } = useWallet();
  const { data: balance } = useQuery(
    ["balanceOf", originToken, account, originChain.key],
    async () => {
      const erc20 = configs.BRIDGE.TOKENS[originChain.key].find(
        (token) => token.key === originToken
      );
      if (!erc20 || !account) return 0;
      const balance = await getErc20Balance(
        account,
        erc20?.contract,
        originChain.key
      );
      return balance;
    }
  );
  const refreshChainBalance = useCallback(
    async (chain: string) => {
      if (!chain || !account) return;
      for (const token of TOKENS_SUPPORT[chain]) {
        const balance = await getErc20Balance(account, token.contract, chain);
        token.name = String(balance);
        debugger
      }
    },
    [account]
  );
  useEffect(() => {
    refreshChainBalance("BSC");
  }, [refreshChainBalance]);
  return (
    <VStack spacing={5}>
      <Card flex={{ lg: 1 }} maxW={600}>
        <CardHeader mb={[10, 5]}>
          <HStack padding={2} w="full" justifyContent="space-between">
            <Heading
              size="md"
              textAlign="left"
              width="full"
              color="primary.500"
            >
              Bridge
            </Heading>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={7} width="full" minW={350}>
            <VStack spacing={3} width="full">
              <VStack alignItems="start" width="full" spacing={0}>
                <FormLabel
                  mb={1}
                  ml={1}
                  color="gray.600"
                  fontWeight="normal"
                  fontSize="sm"
                >
                  From
                </FormLabel>
                <HStack width="full">
                  <ButtonGroup
                    width="full"
                    size="me"
                    isAttached
                    variant="outline"
                  >
                    <ChooseTokenButton
                      buttonProps={{
                        padding: 3,
                        width: "full",
                        borderRight: "1px",
                        borderRightColor: "gray.200",
                        bgColor: "gray.100",
                        textAlign: "left",
                        borderRadius: 15,
                      }}
                      onChange={(token) => {
                        setOriginToken(token);
                      }}
                      token={originToken}
                      key={originToken}
                      label="Token"
                      tokens={TOKENS_SUPPORT[originChain.key]}
                    />
                    <ChooseTokenButton
                      buttonProps={{
                        padding: 3,
                        width: "40%",
                        bgColor: "gray.100",
                        textAlign: "left",
                        borderRadius: 15,
                      }}
                      onChange={(token) => {}}
                      token={originChain.key}
                      key={originChain.key}
                      tokens={[originChain]}
                      label="Network"
                    />
                  </ButtonGroup>
                </HStack>
              </VStack>
              <HStack>
                <Button
                  onClick={() => {}}
                  variant="link"
                  _focus={{ border: "none" }}
                >
                  <HiSwitchVertical size={28} />
                </Button>
              </HStack>
              <VStack width="full" alignItems="start" spacing={0}>
                <FormLabel
                  mb={1}
                  ml={1}
                  color="gray.600"
                  fontWeight="normal"
                  fontSize="sm"
                >
                  To
                </FormLabel>
                <HStack width="full">
                  <ButtonGroup
                    width="full"
                    size="me"
                    isAttached
                    variant="outline"
                  >
                    <ChooseTokenButton
                      buttonProps={{
                        padding: 3,
                        width: "full",
                        borderRight: "1px",
                        borderRightColor: "gray.200",
                        bgColor: "gray.100",
                        textAlign: "left",
                        borderRadius: 15,
                      }}
                      onChange={(token) => {
                        setDestinationToken(token);
                      }}
                      token={destinationToken}
                      key={destinationToken}
                      tokens={TOKENS_SUPPORT[destinationChain.key]}
                      label="Token"
                    />
                    <ChooseTokenButton
                      buttonProps={{
                        padding: 3,
                        width: "40%",
                        bgColor: "gray.100",
                        textAlign: "left",
                        borderRadius: 15,
                      }}
                      onChange={(token) => {}}
                      token={destinationChain.key}
                      key={destinationChain.key}
                      label="Network"
                      tokens={[destinationChain]}
                    />
                  </ButtonGroup>
                </HStack>
              </VStack>
            </VStack>
            <VStack width="full" spacing={0}>
              <HStack spacing={0} width="full" justifyContent="space-between">
                <FormLabel
                  color="gray.600"
                  fontWeight="normal"
                  textAlign="left"
                  fontSize="sm"
                  mb={1}
                  ml={1}
                >
                  Total amount
                </FormLabel>
                <FormLabel
                  color="gray.600"
                  fontWeight="normal"
                  mb={1}
                  pr={2}
                  textAlign="right"
                  fontSize="sm"
                >
                  Balance:&nbsp;{balance || 0}
                </FormLabel>
              </HStack>

              <VStack
                width="full"
                padding={4}
                _hover={{ borderColor: "gray.300" }}
                bgColor="gray.100"
                border="1px"
                borderColor="gray.100"
                borderRadius={15}
              >
                <HStack width="full">
                  <Input
                    textOverflow="ellipsis"
                    _placeholder={{ color: "gray.500" }}
                    variant="unstyled"
                    placeholder="0.0"
                    size="lg"
                    onKeyPress={(e) => {}}
                    value={0}
                    onChange={(e) => {}}
                    onKeyUp={(e) => {}}
                  ></Input>
                  <Button size="sm" variant="solid" colorScheme="blackAlpha">
                    Max
                  </Button>
                </HStack>
              </VStack>
            </VStack>
            <VStack width="full">
              <HStack px={2} justifyContent="space-between" width="full">
                <Text color="primary.500" fontSize="sm" fontWeight="semibold">
                  Price
                </Text>
                <HStack spacing={0}>
                  <Text color="gray" fontSize="sm">
                    <Skeleton>
                      <>{numeralFormat(1000, numberPoint)} HE per BUSD</>
                    </Skeleton>
                  </Text>
                  <Button
                    onClick={() => {}}
                    variant="link"
                    _focus={{ border: "none" }}
                    size="sm"
                  >
                    <FiRefreshCw />
                  </Button>
                </HStack>
              </HStack>
              {/* <HStack px={2} justifyContent="space-between" width="full">
                <Text color="primary.500" fontSize="sm" fontWeight="semibold">
                  Slippage Tolerance
                </Text>
                <HStack spacing={0}>
                  <Text color="gray" fontSize="sm">
                    {slippage}%
                  </Text>
                </HStack>
              </HStack> */}
            </VStack>
            <VStack width="full">
              {/* {wallet.ethereum ? (
                !Number(amount1) ? (
                  <Button disabled colorScheme="primary" width="full">
                    Enter an amount
                  </Button>
                ) : Number(amount1) > Number(balance1) ? (
                  <Button disabled colorScheme="primary" width="full">
                    Insufficient {token1} balance
                  </Button>
                ) : !approved || approvedFetching ? (
                  <Button
                    onClick={onApprove}
                    colorScheme="primary"
                    width="full"
                    isLoading={approving}
                    disabled={approving || approvedFetching}
                  >
                    Approve {token1} token
                  </Button>
                ) : (
                  <Button
                    isLoading={swapping}
                    onClick={swapOnclick}
                    colorScheme="primary"
                    width="full"
                    disabled={loading || swapping}
                  >
                    Swap
                  </Button>
                )
              ) : (
                <ConnectWalletButton
                  width="full"
                  variant="solid"
                  colorScheme="primary"
                />
              )} */}

              <Button colorScheme="primary" width="full">
                Swap
              </Button>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}
