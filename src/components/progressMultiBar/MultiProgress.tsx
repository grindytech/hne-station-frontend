import { HStack, StackProps } from "@chakra-ui/react";

export function MultiProgress(props: StackProps) {
  const { children, ...rest } = props;
  return (
    <HStack position="relative" {...rest}>
      {children}
    </HStack>
  );
}
