import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
} from "@chakra-ui/react";
import configs from "configs";

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  function switchEthereumChain(chainId: string) {
    return window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainId }],
    });
  }
  function addEthereumChain(params: any) {
    return window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: params,
    });
  }
  function switchNetwork() {
    switchEthereumChain(configs.NETWORK.chainId)
      .then(resetErrorBoundary)
      .catch((err: any) => {
        if (err.code === 4902) {
          addEthereumChain([configs.NETWORK]).then(resetErrorBoundary);
        }
      });
  }
  return (
    <Container w="full" pt={5} maxW="xl">
      <Alert
        status="warning"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
        bg="primary.500"
        color="gray.100"
        borderRadius={10}
        borderColor="gray.200"
      >
        {error.name === "ChainUnknownError" ? (
          <>
            <AlertIcon />
            <Box>
              <AlertTitle>Unknown network!</AlertTitle>
              <AlertDescription>
                <pre>{error.message}</pre> Please switch to{" "}
                <Button onClick={switchNetwork} colorScheme="whiteAlpha" variant="link">
                  Binance Smart Chain
                </Button>
              </AlertDescription>
            </Box>
          </>
        ) : (
          <>
            <AlertIcon />
            <Box>
              <AlertTitle>Something went wrong!</AlertTitle>
              <AlertDescription>
                <pre>{error.message}</pre>{" "}
                <Button onClick={resetErrorBoundary} colorScheme="whiteAlpha" variant="link">
                  Try again
                </Button>
              </AlertDescription>
            </Box>
          </>
        )}
      </Alert>
    </Container>
  );
}
