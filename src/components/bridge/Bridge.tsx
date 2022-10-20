import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
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
import SettingButton from "components/swap/SettingButton";
import TxHistories, { Transaction } from "components/swap/TxHistories";
import configs from "configs";
import {
  BridgeToken,
  erc20Approve,
  erc20Approved,
  getDestinationAmount,
  getErc20Balance,
  getNativeBalance,
  getPath,
  swapIssueContract,
  transfer,
} from "contracts/bridge";
import { Chain } from "contracts/contracts";
import useCustomToast from "hooks/useCustomToast";
import useSwitchNetwork from "hooks/useSwitchNetwork";
import { useConnectWallet } from "hooks/useWallet";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HiSwitchVertical } from "react-icons/hi";
import { useQuery } from "react-query";
import { getSgvIcon, ICONS } from "utils/icons";
import { numberOnly, numeralFormat, numeralFormat1 } from "utils/utils";

const NETWORKS: Token[] = [
  { key: "BSC", icon: getSgvIcon(ICONS.BNB), name: "BSC" },
  { key: "AVAX", icon: getSgvIcon(ICONS.AVAX), name: "AVAX" },
];
const TOKENS_SUPPORT: {
  [k: string]: (Token & { contract: string; id: string })[];
} = {};
for (const network of NETWORKS) {
  const networkTokens = configs.BRIDGE[network.key].TOKENS;
  TOKENS_SUPPORT[network.key] = Object.keys(networkTokens).map((k) => {
    const token = networkTokens[k];
    return {
      key: token.key,
      icon: getSgvIcon(token.key),
      name: "0",
      contract: token.contract,
      id: token.id,
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
  const [deadline, setDeadline] = useState(20);
  const [slippage, setSlippage] = useState(1);
  const [histories, setHistories] = useState<Transaction[]>([]);
  const [inputAmount, setInputAmount] = useState(amount);
  // const [gasCost, setGasCost] = useState(0);
  const [refreshChainBalanceTime, setRefreshChainBalanceTime] = useState(
    Date.now()
  );
  const toast = useCustomToast();
  const fee = 0.1;
  const { account } = useConnectWallet();
  const [receiver, setReceive] = useState(account);

  const { isWrongNetwork, changeNetwork } = useSwitchNetwork();
  useEffect(() => {
    setInputAmount(amount);
  }, [amount]);
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

  const destinationTokenOptions = useMemo(() => {
    if (originChain !== Chain.BSC) {
      const token1 = configs.BRIDGE[originChain].TOKENS[originToken];
      const token2 = TOKENS_SUPPORT[destinationChain].find(
        (tk) => tk.id === token1.id
      );
      return [token2];
    } else {
      return TOKENS_SUPPORT[destinationChain];
    }
  }, [destinationChain, originChain, originToken]);
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
      const approveContract =
        originChain === Chain.BSC
          ? configs.BRIDGE[originChain].CONTRACTS.ROUTER_CONTRACT
          : configs.BRIDGE[originChain].CONTRACTS.ISSUE_CONTRACT;
      const isApproved = await erc20Approved(
        Number(amount),
        approveContract,
        token.contract,
        account,
        originChain
      );
      return isApproved;
    }
  );
  const receiveAmountCalculate = useCallback(async () => {
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
  }, [amount, originToken, originChain, destinationChain, destinationToken]);
  useEffect(() => {
    receiveAmountCalculate();
  }, [receiveAmountCalculate]);

  // const calculateGasCost = useCallback(async () => {
  //   if (!account || !Number(amount)) return;
  //   const token1 = configs.BRIDGE[originChain].TOKENS[originToken];
  //   const token2 = configs.BRIDGE[destinationChain].TOKENS[destinationToken];
  //   const originTokens = configs.BRIDGE[originChain].TOKENS;
  //   const token2OriginChainMap = Object.keys(originTokens)
  //     .map((k) => originTokens[k])
  //     .find((token) => token.id === token2.id);
  //   if (!token2OriginChainMap) return;
  //   const minReceive = receiveAmount - (receiveAmount * slippage) / 100;
  //   const path = await getPath(token1, token2OriginChainMap, originChain);
  //   const { contractMethod, param } = transfer(
  //     token1,
  //     token2OriginChainMap,
  //     path,
  //     Number(amount),
  //     minReceive,
  //     account,
  //     receiver || account,
  //     deadline * 60,
  //     fee,
  //     originChain
  //   );
  //   try {
  //     const gas = await contractMethod.estimateGas(param);
  //     const gasSafeAmount = safeAmount({
  //       str: String(gas),
  //       decimal: 18,
  //     });
  //     setGasCost(gasSafeAmount);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [
  //   account,
  //   originChain,
  //   originToken,
  //   destinationChain,
  //   destinationToken,
  //   receiveAmount,
  //   slippage,
  //   amount,
  //   receiver,
  //   deadline,
  // ]);
  // useEffect(() => {
  //   calculateGasCost();
  // }, [calculateGasCost]);

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
      const originTokens = configs.BRIDGE[originChain].TOKENS;
      const token2OriginChainMap = Object.keys(originTokens)
        .map((k) => originTokens[k])
        .find((token) => token.id === token2.id);
      if (!token2OriginChainMap) return;
      const h: Transaction = {
        amount: Number(amount),
        status: "pending",
        token1: token1.key,
        token2: token2.key,
        txHash: "",
        type: "bridge",
      };
      setHistories([...histories, h]);
      let contractCall: any = {};
      if (originChain === Chain.BSC) {
        const minReceive = receiveAmount - (receiveAmount * slippage) / 100;
        const path = await getPath(token1, token2OriginChainMap, originChain);
        contractCall = transfer(
          token1,
          token2OriginChainMap,
          path,
          Number(amount),
          minReceive,
          account,
          receiver || account,
          deadline * 60,
          fee,
          originChain
        );
      } else {
        const _dstChainId =
          configs.BRIDGE[destinationChain].CONTRACTS.DST_CHAIN_ID;
        contractCall = swapIssueContract(
          _dstChainId,
          token1.contract,
          Number(amount),
          fee,
          receiver || account,
          account,
          originChain
        );
      }
      const { contractMethod, param } = contractCall;

      contractMethod
        .send(param)
        .on("transactionHash", (hash: string) => {
          h.txHash = hash;
        })
        .on("confirmation", (confNumber: number, receipt: string) => {
          if (confNumber === 0) {
            h.status = "success";
            toast.success("Transaction successfully!");
            setAmount("");
            refetchBalance();
            refreshChainBalance();
          }
        })
        .on("error", (error: any) => {
          if (error.code === 4001) {
            h.status = "rejected";
            toast.error("Transaction rejected!");
          } else {
            h.status = "fail";
            toast.error("Transaction fail!");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      console.error(error);
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
    if (!approved) {
      const approveContract =
        originChain === Chain.BSC
          ? configs.BRIDGE[originChain].CONTRACTS.ROUTER_CONTRACT
          : configs.BRIDGE[originChain].CONTRACTS.ISSUE_CONTRACT;
      await approve(token1.contract, approveContract, account);
    } else {
      await bridge(token1, token2);
    }
  };
  useEffect(() => {
    refreshChainBalance();
  }, [refreshChainBalance]);
  return (
    <VStack>
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
            <HStack w="full" justifyContent="end">
              <TxHistories
                onClear={() => {
                  setHistories([]);
                }}
                histories={histories}
              />
              <SettingButton
                slippageDefault={1}
                onChange={({ deadline, slippage }) => {
                  setSlippage(slippage);
                  setDeadline(deadline);
                }}
              />
            </HStack>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={5} width="full" minW={350}>
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
                      tokens={destinationTokenOptions as Token[]}
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
            <VStack alignItems="start" width="full" spacing={0}>
              <FormLabel
                color="gray.600"
                fontWeight="normal"
                textAlign="left"
                fontSize="sm"
                mb={1}
                ml={1}
              >
                Receive wallet
              </FormLabel>
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
                    placeholder={account}
                    value={receiver}
                    size="lg"
                    onChange={(e) => {
                      setReceive(e.target.value.trim());
                    }}
                  ></Input>
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
                    value={inputAmount}
                    onKeyPress={(e) => {
                      if (numberOnly(e.key, amount)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={_.debounce((e) => {
                      setAmount(e.target.value);
                    }, 300)}
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
              <Accordion allowToggle w="full">
                <AccordionItem
                  background="gray.50"
                  sx={{
                    borderRadius: 15,
                    borderBottom: "none",
                    borderTop: "none",
                    overflow: "hide",
                  }}
                >
                  <h2>
                    <AccordionButton
                      sx={{ borderRadius: 15 }}
                      _focus={{ border: "none" }}
                    >
                      <HStack justifyContent="space-between" width="full">
                        <Text
                          color="primary.500"
                          fontSize="sm"
                          fontWeight="semibold"
                        >
                          You will receive
                        </Text>
                        <HStack spacing={0}>
                          <Text color="gray" fontSize="sm">
                            <Skeleton isLoaded={!receiveLoading}>
                              <>
                                {numeralFormat(
                                  Number(receiveAmount) || 0,
                                  numberPoint
                                )}
                                &nbsp;
                                {destinationToken}
                              </>
                            </Skeleton>
                          </Text>
                        </HStack>
                      </HStack>

                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <VStack>
                      <HStack justifyContent="space-between" width="full">
                        <Text color="gray" fontSize="xs" fontWeight="semibold">
                          Slippage
                        </Text>
                        <HStack spacing={0}>
                          <Text color="gray" fontSize="xs">
                            {slippage}%
                          </Text>
                        </HStack>
                      </HStack>
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
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
