import { ChakraProvider } from "@chakra-ui/react";
import { useWalletConnectors } from "connectWallet/connectors";
import useWalletConnectContext from "hooks/useWalletConnectContext";
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
  const { currentChain } = useWalletConnectContext();
  React.useEffect(() => {
    init();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <UseWalletProvider
          connectors={useWalletConnectors}
          autoConnect
        >
          <BrowserRouter>
            <Station />
          </BrowserRouter>
        </UseWalletProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
};
