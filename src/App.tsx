import { ChakraProvider } from "@chakra-ui/react";
import ErrorFallback from "components/ErrorFallback";
import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { theme } from "theme";
import { UseWalletProvider } from "use-wallet";
import Station from "./Home";
import Home from "./Home";
import { init } from "./utils/gAnalytics";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const App = () => {
  React.useEffect(() => {
    init();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            window.location.reload();
          }}
        >
          <UseWalletProvider
            connectors={{
              walletconnect: {
                rpc: {
                  56: "https://bsc-dataseed.binance.org/",
                  97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
                },
              },
            }}
            autoConnect
          >
            <BrowserRouter>
              <Station />
            </BrowserRouter>
          </UseWalletProvider>
        </ErrorBoundary>
      </ChakraProvider>
    </QueryClientProvider>
  );
};
