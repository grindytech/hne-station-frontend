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
import { TOKEN_INFO } from "contracts/swap";
import { FiChevronDown } from "react-icons/fi";

const listTokens = [
  { token: "HE", icon: <HECoin />, name: TOKEN_INFO["HE"].name },
  { token: "BUSD", icon: <BUSDCoin />, name: TOKEN_INFO["BUSD"].name },
  { token: "BNB", icon: <BNBCoin />, name: TOKEN_INFO["BNB"].name },
];

type Props = {
  token: string;
  onChange: (token: string) => void;
};

export default function ChooseTokenButton({ token, onChange }: Props) {
  return (
    <Stack>
      <Stack position="relative">
        <Menu>
          <MenuButton
            leftIcon={
              <Icon w={5} h={5}>
                {token === "HE" && <HECoin />}
                {token === "BUSD" && <BUSDCoin />}
                {token === "BNB" && <BNBCoin />}
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
