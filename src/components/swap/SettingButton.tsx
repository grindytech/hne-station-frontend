import {
  Button,
  HStack,
  Icon,
  Input,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { numberOnly } from "utils/utils";

const slippageOptions = ["0.1", "0.5", "1"];

type Props = {
  onChange: ({ slippage, deadline }: { slippage: number; deadline: number }) => void;
};

export default function SettingButton({ onChange }: Props) {
  const [slippage, setSlippage] = useState("0.5");
  const [deadline, setDeadline] = useState(20);
  const [errorMsg, setErrorMsg] = useState("");
  const [errorType, setErrorType] = useState<"warn" | "error">("error");

  const slippageOnChange = (value: string) => {
    setErrorMsg("");
    if (value.trim() === "") return;
    setSlippage(value);
    const number = Number(value);
    if (isNaN(number) || number >= 50) {
      setErrorMsg("Enter a valid slippage percentage");
      setErrorType("error");
    } else {
      if (number <= 0.1) {
        setErrorMsg("Your transaction may fail");
        setErrorType("warn");
      }
      if (number > 5) {
        setErrorMsg("Your transaction may be frontrun");
        setErrorType("warn");
      }
      //on change
      onChange({ slippage: number, deadline: deadline });
    }
  };
  return (
    <Stack>
      <Stack position="relative">
        <Menu>
          <MenuButton variant="link" _focus={{ border: "none" }} color="gray.500" as={Link}>
            <AiOutlineSetting />
          </MenuButton>
          <MenuList
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <VStack spacing={[10, 5]} padding={5}>
              <VStack>
                <Text textAlign="start" w="full" fontSize="sm" fontWeight="semibold">
                  Slippage Tolerance
                </Text>
                <HStack>
                  {slippageOptions.map((v) => (
                    <Button
                      onClick={() => {
                        setSlippage(v);
                        slippageOnChange(v);
                      }}
                      isActive={v === slippage}
                      size="sm"
                    >
                      {v}%
                    </Button>
                  ))}
                  <Input
                    onChange={(e) => {
                      slippageOnChange(e.target.value);
                    }}
                    onKeyPress={(e) => {
                      if (numberOnly(e.key, slippage)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder={String(slippage)}
                    // value={String(slippage)}
                    size="sm"
                    w="14"
                    borderRadius={25}
                  ></Input>
                  <span>%</span>
                </HStack>
                {errorMsg && (
                  <Text
                    textAlign="start"
                    w="full"
                    fontSize="sm"
                    color={
                      errorType === "error" ? "red" : errorType === "warn" ? "orange.300" : "gray"
                    }
                  >
                    {errorMsg}
                  </Text>
                )}
              </VStack>
              <HStack w="full" justifyContent="space-between">
                <Text textAlign="start" w="full" fontSize="sm" fontWeight="semibold">
                  Tx deadline (mins)
                </Text>
                <Input
                  onChange={(e) => {
                    setDeadline(Number(e.target.value));
                    onChange({ slippage: Number(slippage), deadline: Number(e.target.value) });
                  }}
                  onKeyPress={(e) => {
                    if (numberOnly(e.key, slippage) || e.key === ".") {
                      e.preventDefault();
                    }
                  }}
                  placeholder={String(deadline)}
                  size="sm"
                  w="14"
                  borderRadius={25}
                ></Input>
              </HStack>
            </VStack>
          </MenuList>
        </Menu>
      </Stack>
    </Stack>
  );
}
