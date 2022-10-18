import { ChakraProvider } from "@chakra-ui/react";
import CONFIGS from "configs";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { theme } from "theme";
import { UseWalletProvider } from "use-wallet";
import Station from "./Home";

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
        <UseWalletProvider
          connectors={{
            walletconnect: {
              rpcUrl: CONFIGS.DEFAULT_NETWORK().rpcUrls[0],
            },
          }}
          chainId={CONFIGS.DEFAULT_NETWORK().chainIdNumber}
        >
          <BrowserRouter>
            <Station />
          </BrowserRouter>
        </UseWalletProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
};
