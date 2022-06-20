import { Spinner, VStack } from "@chakra-ui/react";

export default function Loading() {
  return (
    <VStack justifyContent="center" w="full" height="200">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
        justifyContent="center"
      />
    </VStack>
  );
}
