import {
  Button,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ReactComponent as BNBCoin } from "assets/bnb_coin.svg";
import { ReactComponent as BUSDCoin } from "assets/busd_coin.svg";
import { ReactComponent as HECoin } from "assets/he_coin.svg";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export enum TOKEN {
  HE = "HE",
  BUSD = "BUSD",
  BNB = "BNB",
}
const listTokens = [
  { token: TOKEN.HE, icon: <HECoin />, name: "Heroes & Empires" },
  { token: TOKEN.BUSD, icon: <BUSDCoin />, name: "BUSD Token" },
  { token: TOKEN.BNB, icon: <BNBCoin />, name: "BNB Token" },
];

type Props = {
  token: TOKEN;
  onChange: (token: TOKEN) => void;
};

export default function ChooseTokenButton({ token, onChange }: Props) {
  return (
    <Stack>
      <Stack position="relative">
        <Menu>
          <MenuButton
            leftIcon={
              <Icon w={5} h={5}>
                {token === TOKEN.HE && <HECoin />}
                {token === TOKEN.BUSD && <BUSDCoin />}
                {token === TOKEN.BNB && <BNBCoin />}
              </Icon>
            }
            rightIcon={<FiChevronDown color="gray" />}
            // onClick={isOpen ? onClose : onOpen}
            variant="outline"
            padding={5}
            _focus={{ outline: "none" }}
            as={Button}
          >
            {token}
          </MenuButton>
          <MenuList>
            {listTokens.map(({ token: tk, icon, name }) => (
              <MenuItem key={tk}>
                <Button
                  _focus={{ border: "none" }}
                  disabled={tk === token}
                  variant="base"
                  onClick={() => {
                    if (tk !== token) {
                      onChange(tk);
                    }
                  }}
                >
                  <HStack spacing={5}>
                    <Icon w={8} height={8}>
                      {icon}
                    </Icon>
                    <VStack alignItems={"start"}>
                      <Text>{tk}</Text>
                      <Text color="gray.500" fontSize="xs">
                        {name}
                      </Text>
                    </VStack>
                  </HStack>
                </Button>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Stack>
    </Stack>
  );
}
