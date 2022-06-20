import { Icon, Text, VStack } from "@chakra-ui/react";
import { AiOutlineInbox } from "react-icons/ai";

export default function EmptyState({ msg }: { msg: string }) {
  return (
    <VStack justifyContent="center" w="full" height="200">
      <Icon as={AiOutlineInbox} w={24} h={24} color="primary.500" />
      <Text textAlign="center" color="primary.500">
        {msg}
      </Text>
    </VStack>
  );
}
