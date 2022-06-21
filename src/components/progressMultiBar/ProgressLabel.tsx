import { Box, Text, VStack } from "@chakra-ui/react";

export function ProgressLabel({
  label,
  color,
  left,
}: {
  label: string;
  color: string;
  left: number;
}) {
  return (
    <Box __css={{ position: "absolute", left: `${left}%`, bottom: "100%" }}>
      <Box __css={{ position: "absolute", left: "-50px", width: "200px", bottom: "100%" }}>
        <Text fontFamily="mono" fontSize="sm" color={color}>
          {label}
        </Text>
      </Box>

      <Box h="4" w="2px" bgColor={color} />
    </Box>
  );
}
