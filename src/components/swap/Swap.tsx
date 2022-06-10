import {
  Button,
  Heading,
  HStack,
  Icon,
  Input,
  Link,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import CardBody from "components/card/CardBody";
import CardHeader from "components/card/CardHeader";
import ConnectWalletButton from "components/connectWalletButton/ConnectWalletButton";
import { getErc20Balance, getETHBalance } from "contracts/contracts";
import { getPairs, swap, TOKEN_INFO } from "contracts/swap";
import useCustomToast from "hooks/useCustomToast";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import { FiArrowDownCircle, FiRefreshCw, FiSettings } from "react-icons/fi";
import { useQuery } from "react-query";
import { useWallet } from "use-wallet";
import { numeralFormat } from "utils/utils";
import ChooseTokenButton from "./ChooseTokenButton";

export default function Swap() {
  const wallet = useWallet();
  const [token1, setToken1] = useState("BUSD");
  const [token2, setToken2] = useState("HE");
  const [amount1, setAmount1] = useState("");
  const [amount2, setAmount2] = useState("");
  const [price1, setPrice1] = useState(0);
  const [price2, setPrice2] = useState(0);
  const [slippage, setSlippage] = useState(0.5);
  const [priceImpact, setPriceImpact] = useState(0);
  const fee = 0.25 / 100;
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState(["HE"]);
  const [priceType, setPriceType] = useState(2);
  const [swapping, setSwapping] = useState(false);
  const toast = useCustomToast();

  function token1Onchange(newToken: string) {
    const newToken1 = newToken;
    const newToken2 = newToken === token2 ? token1 : token2;
    setToken1(newToken1);
    setToken2(newToken2);
    const amount = Number(amount1);
    amount1OnChange(amount - amount * fee, newToken1, newToken2);
  }
  function token2Onchange(newToken: string) {
    const newToken2 = newToken;
    const newToken1 = newToken === token1 ? token2 : token1;
    setToken1(newToken1);
    setToken2(newToken2);
    const amount = Number(amount1);
    amount1OnChange(amount - amount * fee, newToken1, newToken2);
  }
  function numberOnly(key: string, amount: string) {
    console.log(key);
    return !(
      key.match(/[\d.]/g) ||
      (key === "." && amount.indexOf(".") >= 0) ||
      key === "Delete" ||
      key === "Backspace"
    );
  }
  async function getBalance(token: string, account: string) {
    let balance = 0;
    if (token === "BNB") {
      balance = await getETHBalance(account);
    } else {
      balance = await getErc20Balance(
        TOKEN_INFO[token].address,
        TOKEN_INFO[token].decimals,
        account
      );
    }
    return balance;
  }
  const { data: balance1, isFetching: balance1Fetching } = useQuery(
    ["balance1", token1, wallet.account],
    () => getBalance(token1, String(wallet.account)),
    { enabled: !!wallet.account }
  );
  const { data: balance2, isFetching: balance2Fetching } = useQuery(
    ["balance2", token2, wallet.account],
    () => getBalance(token2, String(wallet.account)),
    { enabled: !!wallet.account }
  );

  async function amount1OnChange(amount: number, token1: string, token2: string) {
    try {
      setLoading(true);
      const pairInfo = await getPairs(token1, token2, amount ? amount : 1);
      if (pairInfo && pairInfo?.length > 0) {
        let price1 = 1;
        let priceImpact = 0;
        const route: string[] = [];
        pairInfo.map((pair) => {
          price1 = price1 * pair.priceAfter;
          priceImpact += pair.priceImpact;
          route.push(pair.route);
          return price1;
        });
        setPrice1(price1);
        setPrice2(1 / price1);
        setAmount2(amount ? String(price1 * Number(amount)) : "");
        setPriceImpact(priceImpact ?? 0);
        setRoute(route);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const amount1ChangeHandle = useCallback(
    _.debounce((amount, token1, token2) => {
      amount1OnChange(amount - amount * fee, token1, token2);
    }, 300),
    []
  );
  async function amount2OnChange(amount: number, token1: string, token2: string) {
    try {
      setLoading(true);
      const pairInfo = await getPairs(token2, token1, amount ? amount : 1);
      if (pairInfo && pairInfo?.length > 0) {
        let price2 = 1;
        let priceImpact = 0;
        pairInfo.map((pair) => {
          price2 = price2 * pair.priceAfter;
          priceImpact += pair.priceImpact;
          return price2;
        });
        setPrice2(price2);
        setPrice1(1 / price2);
        setAmount1(amount ? String(price2 * Number(amount)) : "");
        setPriceImpact(priceImpact ?? 0);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const amount2ChangeHandle = useCallback(
    _.debounce((amount, token1, token2) => {
      amount2OnChange(amount - amount * fee, token1, token2);
    }, 300),
    []
  );
  const getMinimumReceive = useCallback(
    () => Number(amount1) * price1 - (Number(amount1) * price1 * slippage) / 100,
    [amount1, price1, slippage]
  );
  const swapOnclick = async () => {
    try {
      if (!wallet.account) return;
      setSwapping(true);
      const deadline = Date.now() + 20 * 60 * 1e3;
      await swap(
        Number(amount1),
        getMinimumReceive(),
        token1,
        token2,
        route,
        wallet.account,
        wallet.account,
        deadline
      );
    } catch (error) {
      console.error(error);
      toast.error("Transaction fail!");
    } finally {
      setSwapping(false);
    }
  };
  useEffect(() => {
    amount1OnChange(0, token1, token2);
  }, []);
  return (
    <VStack spacing={5}>
      <Card flex={{ lg: 1 }} maxW={400}>
        <CardHeader>
          <Heading size="md" textAlign="center" width="full" mb={[10, 5]} color="primary.500">
            Swap token
          </Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={5}>
            <VStack spacing={2} width="full">
              <VStack
                width="full"
                padding={5}
                _hover={{ borderColor: "gray.300" }}
                bgColor="gray.100"
                border="1px"
                borderColor="gray.100"
                borderRadius={25}
              >
                <HStack width="full">
                  <Input
                    _placeholder={{ color: "gray.500" }}
                    variant="unstyled"
                    placeholder="0.0"
                    size="lg"
                    textOverflow="ellipsis"
                    onKeyPress={(e) => {
                      if (numberOnly(e.key, amount1)) {
                        e.preventDefault();
                      }
                    }}
                    onKeyUp={(e) => {
                      if (!numberOnly(e.key, amount1)) {
                        amount1ChangeHandle(Number(amount1), token1, token2);
                      }
                    }}
                    value={amount1}
                    onChange={(e) => {
                      setAmount1(e.target.value);
                    }}
                  ></Input>
                  <ChooseTokenButton
                    onChange={(token) => {
                      token1Onchange(token);
                    }}
                    token={token1}
                    key={token1}
                  />
                </HStack>

                <HStack mt={3} width="full" justifyContent="end" color="gray.500">
                  <Skeleton isLoaded={!balance1Fetching}>
                    {balance1 !== undefined && (
                      <Link
                        onClick={() => {
                          setAmount1(String(balance1));
                          amount1OnChange(balance1, token1, token2);
                        }}
                        _hover={{ textDecoration: "none" }}
                        variant="unstyled"
                        fontSize="sm"
                      >
                        <Text fontSize="sm">Balance: {numeralFormat(Number(balance1), 8)}</Text>
                      </Link>
                    )}
                  </Skeleton>
                </HStack>
              </VStack>
              <HStack>
                <Button
                  onClick={() => {
                    token1Onchange(token2);
                  }}
                  variant="link"
                  _focus={{ border: "none" }}
                >
                  <FiArrowDownCircle size={28} />
                </Button>
              </HStack>
              <VStack
                width="full"
                padding={5}
                _hover={{ borderColor: "gray.300" }}
                bgColor="gray.100"
                border="1px"
                borderColor="gray.100"
                borderRadius={25}
              >
                <HStack width="full">
                  <Input
                    textOverflow="ellipsis"
                    _placeholder={{ color: "gray.500" }}
                    variant="unstyled"
                    placeholder="0.0"
                    size="lg"
                    onKeyPress={(e) => {
                      if (numberOnly(e.key, amount2)) {
                        e.preventDefault();
                      }
                    }}
                    value={amount2}
                    onChange={(e) => {
                      setAmount2(e.target.value);
                    }}
                    onKeyUp={(e) => {
                      if (!numberOnly(e.key, amount2)) {
                        amount2ChangeHandle(Number(amount2), token1, token2);
                      }
                    }}
                  ></Input>
                  <ChooseTokenButton
                    onChange={(token) => {
                      token2Onchange(token);
                    }}
                    token={token2}
                    key={token2}
                  />
                </HStack>
                <HStack mt={3} width="full" justifyContent="end" color="gray.500">
                  <Skeleton isLoaded={!balance2Fetching}>
                    {balance2 !== undefined && (
                      <Link
                        onClick={() => {
                          setAmount2(String(balance2));
                          amount2OnChange(balance2, token1, token2);
                        }}
                        _hover={{ textDecoration: "none" }}
                        variant="unstyled"
                        fontSize="sm"
                      >
                        Balance: {numeralFormat(Number(balance2), 8)}
                      </Link>
                    )}
                  </Skeleton>
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
                    <Skeleton isLoaded={!loading || !!price2}>
                      {priceType === 2 && (
                        <>
                          {numeralFormat(price2, 8)} {token1} per {token2}
                        </>
                      )}
                      {priceType === 1 && (
                        <>
                          {numeralFormat(price1, 8)} {token2} per {token1}
                        </>
                      )}
                    </Skeleton>
                  </Text>
                  <Button
                    onClick={() => {
                      setPriceType(priceType === 1 ? 2 : 1);
                    }}
                    variant="link"
                    _focus={{ border: "none" }}
                    size="sm"
                  >
                    <FiRefreshCw />
                  </Button>
                </HStack>
              </HStack>
              <HStack px={2} justifyContent="space-between" width="full">
                <Text color="primary.500" fontSize="sm" fontWeight="semibold">
                  Slippage Tolerance
                </Text>
                <HStack spacing={0}>
                  <Text color="gray" fontSize="sm">
                    {slippage}%
                  </Text>
                  <Button onClick={() => {}} variant="link" _focus={{ border: "none" }} size="sm">
                    <FiSettings />
                  </Button>
                </HStack>
              </HStack>
            </VStack>
            <VStack width="full">
              {wallet.isConnected() ? (
                !Number(amount1) ? (
                  <Button disabled colorScheme="primary" width="full">
                    Enter an amount
                  </Button>
                ) : Number(amount1) > Number(balance1) ? (
                  <Button disabled colorScheme="primary" width="full">
                    Insufficient {token1} balance
                  </Button>
                ) : (
                  <Button
                    isLoading={swapping}
                    onClick={swapOnclick}
                    colorScheme="primary"
                    width="full"
                  >
                    Swap
                  </Button>
                )
              ) : (
                <ConnectWalletButton width="full" variant="solid" colorScheme="primary" />
              )}
            </VStack>
          </VStack>
        </CardBody>
      </Card>
      {Number(amount1) > 0 && (
        <Card flex={{ lg: 1 }} maxW={400}>
          <CardBody>
            <VStack spacing={2} width="full">
              <HStack px={2} justifyContent="space-between" width="full">
                <Text color="gray" fontSize="sm">
                  Minimum received
                </Text>
                <Text color="gray" fontSize="sm">
                  <Skeleton isLoaded={!loading}>
                    {numeralFormat(getMinimumReceive(), 8)} {token2}
                  </Skeleton>
                </Text>
              </HStack>
              <HStack px={2} justifyContent="space-between" width="full">
                <Text color="gray" fontSize="sm">
                  Price Impact
                </Text>
                <Text
                  color={
                    priceImpact >= 5 ? "red.500" : priceImpact >= 3 ? "orange.500" : "green.300"
                  }
                  fontSize="sm"
                >
                  <Skeleton isLoaded={!loading}>
                    {amount1 ? numeralFormat(priceImpact, 2) : 0}%
                  </Skeleton>
                </Text>
              </HStack>
              <HStack px={2} justifyContent="space-between" width="full">
                <Text color="gray" fontSize="sm">
                  Liquidity Provider Fee
                </Text>
                <Text color="gray" fontSize="sm">
                  <Skeleton isLoaded={!loading}>
                    {numeralFormat(Number(amount1) * fee, 8)} {token1}
                  </Skeleton>
                </Text>
              </HStack>
              {route.length > 1 && (
                <HStack px={2} justifyContent="space-between" width="full">
                  <Text color="gray" fontSize="sm">
                    Route
                  </Text>
                  <Text color="gray" fontSize="sm">
                    <Skeleton
                      isLoaded={!loading}
                    >{`${token1} > ${route[0]} > ${route[1]}`}</Skeleton>
                  </Text>
                </HStack>
              )}
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
}
