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
import ConnectWalletButton from "components/connectWalletButton/ConnectWalletButton";
import ChooseTokenButton, { Token } from "components/swap/ChooseTokenButton";
import configs from "configs";
import {
  BridgeToken,
  erc20Approve,
  erc20Approved,
  getDestinationAmount,
  getErc20Balance,
  getNativeBalance,
  transfer,
} from "contracts/bridge";
import { Chain } from "contracts/contracts";
import useCustomToast from "hooks/useCustomToast";
import useSwitchNetwork from "hooks/useSwitchNetwork";
import { useConnectWallet } from "hooks/useWallet";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import { HiSwitchVertical } from "react-icons/hi";
import { useQuery } from "react-query";
import { getSgvIcon, ICONS } from "utils/icons";
import { numberOnly, numeralFormat, numeralFormat1 } from "utils/utils";

const NETWORKS: Token[] = [
  { key: "BSC", icon: getSgvIcon(ICONS.BNB), name: "BSC" },
  { key: "AVAX", icon: getSgvIcon(ICONS.DOS), name: "AVAX" },
];
const TOKENS_SUPPORT: { [k: string]: (Token & { contract: string })[] } = {};
for (const network of NETWORKS) {
  const networkTokens = configs.BRIDGE[network.key].TOKENS;
  TOKENS_SUPPORT[network.key] = Object.keys(networkTokens).map((k) => {
    const token = networkTokens[k];
    return {
      key: token.key,
      icon: getSgvIcon(token.key),
      name: "0",
      contract: token.contract,
    };
  });
}

export default function Bridge() {
  const numberPoint = 6;
  const [originChain, setOriginChain] = useState("BSC");
  const [destinationChain, setDestinationChain] = useState("AVAX");
  const [originToken, setOriginToken] = useState("HE");
  const [destinationToken, setDestinationToken] = useState("SKY");
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [receiveLoading, setReceiveLoading] = useState(false);
  const [deadline, setDeadline] = useState(20 * 60);
  const [slippage, setSlippage] = useState(1);
  const [refreshChainBalanceTime, setRefreshChainBalanceTime] = useState(
    Date.now()
  );
  const toast = useCustomToast();
  const fee = 0.1;
  const { account } = useConnectWallet();
  const { isWrongNetwork, changeNetwork } = useSwitchNetwork();
  const { data: balance, refetch: refetchBalance } = useQuery(
    ["balanceOf", originToken, account, originChain],
    async () => {
      const token = configs.BRIDGE[originChain].TOKENS[originToken];
      let balance = 0;
      if (!token || !account) return 0;
      if (token.native) {
        balance = await getNativeBalance(account, originChain);
      } else {
        balance = await getErc20Balance(account, token.contract, originChain);
      }
      return balance;
    }
  );
  const refreshChainBalance = useCallback(async () => {
    const refresh = async (chain: string) => {
      if (!chain) return;
      for (const token of TOKENS_SUPPORT[chain]) {
        let balance = 0;
        if (account) {
          if (token.contract) {
            balance = await getErc20Balance(account, token.contract, chain);
          } else {
            balance = await getNativeBalance(account, chain);
          }
        }
        token.name = String(numeralFormat(balance || 0));
      }
    };
    await refresh(originChain);
    await refresh(destinationChain);
    setRefreshChainBalanceTime(Date.now());
  }, [account, destinationChain, originChain]);
  const validate = useCallback(async () => {
    let error = "";
    if (!amount || Number(amount) > Number(balance) || Number(amount) < 0) {
      error = "Insufficient balance";
    }
    if (originChain !== Chain.BSC) {
      const token1 = configs.BRIDGE[originChain].TOKENS[originToken];
      const token2 = configs.BRIDGE[destinationChain].TOKENS[destinationToken];
      if (token1.id !== token2.id) {
        error = "Pair is not support";
      }
    }
    setErrorMessage(error);
  }, [
    amount,
    balance,
    originChain,
    originToken,
    destinationChain,
    destinationToken,
  ]);
  const originChainOnchange = (chain: string) => {
    if (destinationChain === chain) {
      setDestinationChain(originChain);
      setOriginToken(destinationToken);
      setDestinationToken(originToken);
    }
    setOriginChain(chain);
  };
  const destinationChainOnchange = (chain: string) => {
    if (originChain === chain) {
      setOriginChain(destinationChain);
      setOriginToken(destinationToken);
      setDestinationToken(originToken);
    }
    setDestinationChain(chain);
  };
  const { data: approved, refetch: refetchApprove } = useQuery(
    ["approved", account, originChain, originToken],
    async () => {
      if (!account) return true;
      const token = configs.BRIDGE[originChain].TOKENS[originToken];
      if (token.native) return true;
      const routerContract =
        configs.BRIDGE[originChain].CONTRACTS.ROUTER_CONTRACT;
      const isApproved = await erc20Approved(
        Number(amount),
        routerContract,
        token.contract,
        account,
        originChain
      );
      return isApproved;
    }
  );
  const receiveAmountCalculate = useCallback(
    _.debounce(async () => {
      let receive = Number(amount);
      if (originChain === Chain.BSC) {
        try {
          const desToken =
            configs.BRIDGE[destinationChain].TOKENS[destinationToken];
          const token1 = configs.BRIDGE[originChain].TOKENS[originToken];
          const originChainTokens = configs.BRIDGE[originChain].TOKENS;
          const token2 = Object.keys(originChainTokens)
            .map((tk) => originChainTokens[tk])
            .find((tk) => tk.id === desToken.id);
          if (!token1 || !token2) {
            setReceiveAmount(0);
            return;
          }
          if (token1.id === token2.id) {
            setReceiveAmount(Number(amount));
            return;
          }
          setReceiveLoading(true);
          receive = await getDestinationAmount(
            Number(amount),
            token1,
            token2,
            originChain
          );
        } catch (error) {
          console.error(error);
        } finally {
          setReceiveLoading(false);
        }
      }
      setReceiveAmount(receive);
    }, 300),
    [amount, originToken, originChain, destinationChain, destinationToken]
  );
  useEffect(() => {
    receiveAmountCalculate();
  }, [receiveAmountCalculate]);

  useEffect(() => {
    validate();
  }, [validate]);

  const approve = async (
    erc20Contract: string,
    contract: string,
    account: string
  ) => {
    try {
      setApproving(true);
      await erc20Approve(erc20Contract, contract, account);
      await refetchApprove();
      toast.success("Transaction successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Transaction failed!");
    } finally {
      setApproving(false);
    }
  };
  const bridge = async (token1: BridgeToken, token2: BridgeToken) => {
    if (!account) return;
    try {
      setIsLoading(true);
      const minReceive = receiveAmount - (receiveAmount * slippage) / 100;
      await transfer(
        token1,
        token2,
        Number(amount),
        minReceive,
        account,
        account,
        deadline,
        fee,
        originChain
      );
      toast.success("Transaction successfully!");
      setAmount("");
      await refetchBalance();
      await refreshChainBalance();
    } catch (error) {
      console.error(error);
      toast.error("Transaction failed!");
    } finally {
      setIsLoading(false);
    }
  };
  const transferBtnOnclickHandle = async () => {
    if (isWrongNetwork(originChain)) {
      await changeNetwork(originChain);
      return;
    }
    const token1 = configs.BRIDGE[originChain].TOKENS[originToken];
    const token2 = configs.BRIDGE[destinationChain].TOKENS[destinationToken];
    if (!token1 || !token2 || !account) return;
    const routerContractAddress =
      configs.BRIDGE[originChain].CONTRACTS.ROUTER_CONTRACT;
    if (!approved) {
      await approve(token1.contract, routerContractAddress, account);
    } else {
      const originTokens = configs.BRIDGE[originChain].TOKENS;
      const token2OriginChainMap = Object.keys(originTokens)
        .map((k) => originTokens[k])
        .find((token) => token.id === token2.id);
      if (token2OriginChainMap) await bridge(token1, token2OriginChainMap);
    }
  };
  useEffect(() => {
    refreshChainBalance();
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
                      key={`${originToken}-${refreshChainBalanceTime}`}
                      label="Token"
                      tokens={TOKENS_SUPPORT[originChain]}
                    />
                    <ChooseTokenButton
                      buttonProps={{
                        padding: 3,
                        width: "40%",
                        bgColor: "gray.100",
                        textAlign: "left",
                        borderRadius: 15,
                      }}
                      onChange={(chain) => {
                        originChainOnchange(chain);
                      }}
                      token={originChain}
                      key={originChain}
                      tokens={NETWORKS}
                      label="Network"
                    />
                  </ButtonGroup>
                </HStack>
              </VStack>
              <HStack>
                <Button
                  onClick={() => {
                    originChainOnchange(destinationChain);
                  }}
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
                      key={`${destinationToken}-${refreshChainBalanceTime}`}
                      tokens={TOKENS_SUPPORT[destinationChain]}
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
                      onChange={(chain) => {
                        destinationChainOnchange(chain);
                      }}
                      token={destinationChain}
                      key={destinationChain}
                      label="Network"
                      tokens={NETWORKS}
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
                  Balance:&nbsp;{numeralFormat(balance || 0)}
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
                    onKeyPress={(e) => {
                      if (numberOnly(e.key, amount)) {
                        e.preventDefault();
                      }
                    }}
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                    }}
                    onKeyUp={(e) => {}}
                  ></Input>
                  <Button
                    onClick={() => {
                      setAmount(String(numeralFormat1(Number(balance))));
                    }}
                    size="sm"
                    variant="solid"
                    colorScheme="blackAlpha"
                  >
                    Max
                  </Button>
                </HStack>
              </VStack>
            </VStack>
            <VStack width="full">
              <HStack px={2} justifyContent="space-between" width="full">
                <Text color="primary.500" fontSize="sm" fontWeight="semibold">
                  You will receive
                </Text>
                <HStack spacing={0}>
                  <Text color="gray" fontSize="sm">
                    <Skeleton isLoaded={!receiveLoading}>
                      <>
                        {numeralFormat(Number(receiveAmount) || 0, numberPoint)}
                        &nbsp;
                        {destinationToken}
                      </>
                    </Skeleton>
                  </Text>
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
              {account ? (
                <Button
                  disabled={!!errorMessage || approving || isLoading}
                  colorScheme="primary"
                  width="full"
                  isLoading={approving || isLoading}
                  onClick={transferBtnOnclickHandle}
                >
                  {!!errorMessage
                    ? errorMessage
                    : isWrongNetwork(originChain)
                    ? `Switch to ${configs.NETWORKS[originChain].chainName}`
                    : approved
                    ? "Transfer"
                    : "Approve"}
                </Button>
              ) : (
                <ConnectWalletButton
                  width="full"
                  variant="solid"
                  colorScheme="primary"
                />
              )}
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}
