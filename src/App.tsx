import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { UseWalletProvider } from "use-wallet";

import { theme } from "theme";

import Home from "./Home";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
});

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider theme={theme}>
      <UseWalletProvider
        connectors={{
          walletconnect: {
            rpc: {
              56: "https://bsc-dataseed.binance.org/",
              97: "https://data-seed-prebsc-1-s1.binance.org:8545/"
            }
          }
        }}
        autoConnect
      >
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </UseWalletProvider>
    </ChakraProvider>
  </QueryClientProvider>
);
