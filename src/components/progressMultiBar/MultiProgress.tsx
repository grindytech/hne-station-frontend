import { HStack, StackProps } from "@chakra-ui/react";

export function MultiProgress(props: StackProps) {
  const { children, ...rest } = props;
  return (
    <HStack spacing={0} position="relative" {...rest}>
      {children}
    </HStack>
  );
}
