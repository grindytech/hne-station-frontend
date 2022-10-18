import { safeAmount, web3 } from "contracts/contracts";
import erc20 from "../ERC20.json";
import factoryAbi from "./factory.abi.json";
import pairAbi from "./pair.abi.json";
import routerAbi from "./router.abi.json";

import configs from "configs";
import Web3 from "web3";
import { AbiItem } from "web3-utils";

export const bridgeFactoryContract = () => {
  return new web3.eth.Contract(
    factoryAbi as AbiItem[],
    configs.BRIDGE.FACTORY_CONTRACT
  );
};
export const bridgePairContract = () => {
  return new web3.eth.Contract(
    pairAbi as AbiItem[],
    configs.BRIDGE.PAIR_CONTRACT
  );
};

export const bridgeRouterContract = () => {
  return new web3.eth.Contract(
    routerAbi as AbiItem[],
    configs.BRIDGE.ROUTER_CONTRACT
  );
};

export const getErc20Balance = async (
  account: string,
  contractAddress: string,
  chain: string,
  decimal = 18
) => {
  const network = configs.NETWORKS[chain];
  const web3Http = new Web3(
    new Web3.providers.HttpProvider(network.rpcUrls[0])
  );
  const contract = new web3Http.eth.Contract(
    erc20 as AbiItem[],
    contractAddress
  );
  let balance = await contract.methods.balanceOf(account).call();
  return safeAmount({ str: balance, decimal });
};
export const getNativeBalance = async (account: string, chain: string) => {
  const network = configs.NETWORKS[chain];
  const web3Http = new Web3(
    new Web3.providers.HttpProvider(network.rpcUrls[0])
  );
  const bnbBalance = await web3Http.eth.getBalance(account);
  return safeAmount({ str: bnbBalance, decimal: 18 });
};
