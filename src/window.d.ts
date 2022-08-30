import { AbstractProvider } from "web3-core";

declare global {
  interface Window {
    ethereum: AbstractProvider & { chainId: string };
  }
}
