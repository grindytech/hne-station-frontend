import { Flex, FlexProps, HStack, Icon, Link as ChakraLink, Text } from "@chakra-ui/react";
import { ReactText } from "react";
import { IconType } from "react-icons";
import { Link } from "react-router-dom";

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  isActive?: boolean;
  to: string;
}
const NavItem = ({ to, icon, children, isActive = false, ...rest }: NavItemProps) => {
  return (
    <Link to={to}>
      <ChakraLink
        href="#"
        style={{ textDecoration: "none" }}
        // fontFamily="sans-serif"
        _focus={{ boxShadow: "none" }}
      >
        <Flex
          color={"gray.100"}
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: "primary.500",
            color: "white",
          }}
          __css={isActive ? { fontWeight: "bold" } : {}}
          {...rest}
        >
          <HStack spacing={0}>
            {icon && (
              <Icon
                mr="4"
                fontSize="16"
                _groupHover={{
                  color: "white",
                }}
                as={icon}
              />
            )}
            <Text>{children}</Text>
          </HStack>
        </Flex>
      </ChakraLink>
    </Link>
  );
};
export default NavItem;
