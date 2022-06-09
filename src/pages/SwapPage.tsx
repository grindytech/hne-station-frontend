import { HStack } from "@chakra-ui/react";
import Swap from "components/swap/Swap";

export default function SwapPage() {
  return (
    <HStack mt={[10, 5]} justifyContent="center">
      <Swap />
    </HStack>
  );
}
