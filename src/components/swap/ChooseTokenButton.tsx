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
  useColorModeValue,
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
  icon?: React.ReactElement;
  name?: string;
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
  const textColor = useColorModeValue("gray.600", "gray.100");
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
          <Text color={textColor} fontWeight="normal" fontSize="xs" mb={1}>
            {label}
          </Text>
        )}
        <Button
          width="full"
          variant="ghost"
          justifyContent="space-between"
          alignItems="center"
          leftIcon={
            tokenInfo?.icon ? (
              <Icon w={5} h={5}>
                {tokenInfo?.icon}
              </Icon>
            ) : undefined
          }
          rightIcon={<FiChevronDown color={textColor} />}
        >
          <Text width="full" textAlign="left">
            {token}
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
                {icon && (
                  <Icon w={8} height={8}>
                    {icon}
                  </Icon>
                )}
                <VStack alignItems={"start"}>
                  <Text>{tk}</Text>
                  {name && (
                    <Text color={textColor} fontSize="xs">
                      {name}
                    </Text>
                  )}
                </VStack>
              </HStack>
            </Button>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
