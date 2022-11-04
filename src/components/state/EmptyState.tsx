import { Icon, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { AiOutlineInbox } from "react-icons/ai";

export default function EmptyState({ msg }: { msg: string }) {
  const textColor = useColorModeValue("gray.500", "gray.300");
  return (
    <VStack justifyContent="center" w="full" height="200">
      <Icon as={AiOutlineInbox} w={24} h={24} color={textColor} />
      <Text textAlign="center" color={textColor}>
        {msg}
      </Text>
    </VStack>
  );
}
