import { Box } from "@chakra-ui/react";

export function ProgressBar({ color, value }: { color: string; value: number }) {
  return <Box w={`${value}%`} h="full" bgColor={color}></Box>;
}
