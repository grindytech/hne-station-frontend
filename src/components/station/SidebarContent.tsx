import {
  Box,
  BoxProps,
  ButtonGroup,
  CloseButton,
  Divider,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  VStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import {
  FaBook,
  FaDiscord,
  FaFacebook,
  FaNewspaper,
  FaTelegram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import NavItem from "./NavItem";

interface LinkItem {
  key: string;
  name: string;
  icon: any;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  // onLinkClick: (key: string) => void;
  // activeKey?: string;
  LinkItems: LinkItem[];
}

const SidebarContent = ({ onClose, LinkItems, ...rest }: SidebarProps) => {
  const location = useLocation();
  return (
    <Box
      overflowY="auto"
      transition="3s ease"
      bg={useColorModeValue("primary.600", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <VStack w="full" h="full" justifyContent="space-between">
        <VStack alignItems="flex-start">
          <Flex
            w={{ md: "auto", base: "full" }}
            h="20"
            alignItems="center"
            mx="8"
            justifyContent="space-between"
          >
            <Link to="/" onClick={onClose}>
              <Text color={"white"} fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                HE Station
              </Text>
            </Link>
            <CloseButton onClick={onClose} display={{ base: "flex", md: "none" }} />
          </Flex>
          {LinkItems.map((link) => (
            <Box w="full" onClick={onClose}>
              <NavItem
                to={link.key}
                key={link.key}
                icon={link.icon}
                isActive={location.pathname === link.key}
                fontSize="md"
              >
                {link.name}
              </NavItem>
            </Box>
          ))}
        </VStack>
        <VStack spacing={2} paddingX={5} w="full" alignItems="flex-start">
          <ChakraLink
            _hover={{}}
            fontFamily="mono"
            color="gray.200"
            variant="unstyled"
            fontSize="sm"
            target="_blank"
          >
            <Icon as={FaBook} />
            &nbsp;Docs
          </ChakraLink>
          <Divider color="gray.50" />
          <ButtonGroup w="full" justifyContent="space-between" pb={5} color="gray.100">
            <ChakraLink href="https://blog.heroesempires.com/" target="_blank">
              <Icon as={FaNewspaper} />
            </ChakraLink>
            <ChakraLink href="https://discord.com/invite/HeroesEmpires" target="_blank">
              <Icon as={FaDiscord} />
            </ChakraLink>
            <ChakraLink href="https://t.me/HeroesEmpires" target="_blank">
              <Icon as={FaTelegram} />
            </ChakraLink>
            <ChakraLink href="https://twitter.com/HeroesEmpires" target="_blank">
              <Icon as={FaTwitter} />
            </ChakraLink>
            <ChakraLink href="https://www.facebook.com/HeroesEmpires" target="_blank">
              <Icon as={FaFacebook} />
            </ChakraLink>
            <ChakraLink href="https://www.youtube.com/HeroesEmpires" target="_blank">
              <Icon as={FaYoutube} />
            </ChakraLink>
          </ButtonGroup>
        </VStack>
      </VStack>
    </Box>
  );
};

export default SidebarContent;
