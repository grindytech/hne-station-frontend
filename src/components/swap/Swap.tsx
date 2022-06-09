import { Button, Heading, HStack, Icon, Input, Text, VStack } from "@chakra-ui/react";
import Card from "components/card/Card";
import CardBody from "components/card/CardBody";
import CardHeader from "components/card/CardHeader";
import ConnectWalletButton from "components/connectWalletButton/ConnectWalletButton";
import { useState } from "react";
import { useWallet } from "use-wallet";
import ChooseTokenButton, { TOKEN } from "./ChooseTokenButton";
import { FiArrowDownCircle } from "react-icons/fi";

export default function Swap() {
  const wallet = useWallet();
  const [token1, setToken1] = useState(TOKEN.BUSD);
  const [token2, setToken2] = useState(TOKEN.HE);
  const [amount1, setAmount1] = useState("");
  const [amount2, setAmount2] = useState("");
  function token1Onchange(newToken1: TOKEN) {
    if (newToken1 === token2) {
      setToken2(token1);
    }
    setToken1(newToken1);
    console.log(`token1: ${token1}, token2: ${token2}`);
  }
  function token2Onchange(newToken2: TOKEN) {
    if (newToken2 === token1) {
      setToken1(token2);
    }
    setToken2(newToken2);
    console.log(`token1: ${token1}, token2: ${token2}`);
  }
  function numberOnly(key: string, amount: string) {
    return !key.match(/[\d.]/g) || (key === "." && amount.indexOf(".") >= 0);
  }

  return (
    <>
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
                    type="number"
                    variant="unstyled"
                    placeholder="0.0"
                    size="lg"
                    textOverflow="ellipsis"
                    onKeyPress={(e) => {
                      if (numberOnly(e.key, amount1)) {
                        e.preventDefault();
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
                  <Text fontSize="sm">Balance: 0.0</Text>
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
                  <Text fontSize="sm">Balance: 0.0</Text>
                </HStack>
              </VStack>
            </VStack>
            <VStack width="full">
              {wallet.isConnected() ? (
                <Button colorScheme="primary" width="full">
                  Swap
                </Button>
              ) : (
                <ConnectWalletButton width="full" variant="solid" colorScheme="primary" />
              )}
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </>
  );
}
