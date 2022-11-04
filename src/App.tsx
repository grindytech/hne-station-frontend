import { ChakraProvider } from "@chakra-ui/react";
import { ConnectWalletProvider } from "connectWallet/useWallet";
import { SessionTxProvider } from "hooks/bridge/useSessionTxHistories";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { theme } from "theme";
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
        <ConnectWalletProvider>
          <SessionTxProvider>
            <BrowserRouter>
              <Station />
            </BrowserRouter>
          </SessionTxProvider>
        </ConnectWalletProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
};
