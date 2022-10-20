import {
  Button,
  ButtonProps,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ReactComponent as BNBCoin } from "assets/bnb_coin.svg";
import { ReactComponent as BUSDCoin } from "assets/busd_coin.svg";
import { ReactComponent as HECoin } from "assets/he_coin.svg";
import { TOKEN_INFO } from "contracts/swap";
import React, { useEffect, useMemo } from "react";
import { FiChevronDown } from "react-icons/fi";

export type Token = {
  key: string;
  icon: React.ReactElement;
  name: string;
};

const listTokensDefault: Token[] = [
  { key: "HE", icon: <HECoin />, name: TOKEN_INFO["HE"].name },
  { key: "BUSD", icon: <BUSDCoin />, name: TOKEN_INFO["BUSD"].name },
  { key: "BNB", icon: <BNBCoin />, name: TOKEN_INFO["BNB"].name },
];

type Props = {
  token: string;
  onChange: (token: string) => void;
  buttonProps?: ButtonProps;
  tokens?: Token[];
  label?: string;
};

export default function ChooseTokenButton({
  token,
  onChange,
  buttonProps,
  tokens,
  label,
}: Props) {
  const listTokens = tokens || listTokensDefault;
  const tokenInfo = useMemo(
    () => listTokens.find((info) => info.key === token),
    [listTokens, token]
  );
  useEffect(() => {
    if (!tokenInfo) {
      onChange(listTokens[0].key);
    }
  }, [listTokens, onChange, tokenInfo]);
  return (
    <Menu>
      <MenuButton
        padding={5}
        width="full"
        variant="outline"
        _focus={{ outline: "none" }}
        as={Button}
        {...buttonProps}
      >
        {label && (
          <Text color="gray.600" fontWeight="normal" fontSize="xs" mb={1}>
            {label}
          </Text>
        )}
        <Button
          width="full"
          variant="ghost"
          justifyContent="space-between"
          alignItems="center"
          leftIcon={
            <Icon w={5} h={5}>
              {tokenInfo?.icon ?? listTokens[0].icon}
            </Icon>
          }
          rightIcon={<FiChevronDown color="gray" />}
        >
          <Text width="full" textAlign="left">
            {tokenInfo ? token : listTokens[0].key}
          </Text>
        </Button>
      </MenuButton>
      <MenuList>
        {listTokens.map(({ key: tk, icon, name }) => (
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
  );
}
