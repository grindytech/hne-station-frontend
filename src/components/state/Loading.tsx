import { Box, Skeleton, Spinner, VStack } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Box w="full" height="200">
      <Skeleton>
        <Box w="full" height="200"></Box>
      </Skeleton>
    </Box>
  );
}
