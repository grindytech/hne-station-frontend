import { Flex, FlexProps, HStack, IconButton, Menu, useColorModeValue } from "@chakra-ui/react";
import { SidebarContent as NavbarContent } from "components/Sidebar";
import { FiMenu } from "react-icons/fi";

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      {/* <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        HE Station
      </Text> */}

      <HStack spacing={{ base: "0", md: "6" }}>
        {/* <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />} /> */}
        <Flex alignItems={"center"}>
          <Menu>
            <NavbarContent onClick={() => {}} />
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default MobileNav;
