import configs from "configs";
import { BURN_ADDRESS, MAX_INT } from "constant";
import {
  safeAmount,
  web3Inject,
  WEB3_HTTP_PROVIDERS,
} from "contracts/contracts";
import { convertToContractValue } from "utils/utils";
import { AbiItem } from "web3-utils";
import erc20 from "../ERC20.json";
import factoryAbi from "./factory.abi.json";
import pancakePairAbi from "./pancakePair.abi.json";
import pancakeRouterAbi from "./pancakeRouter.abi.json";
import routerAbi from "./router.abi.json";

export type BridgeToken = {
  name: string;
  key: string;
  id: string;
  contract: string;
  native?: boolean;
};
const DEFAULT_CHAIN = configs.DEFAULT_CHAIN;
export const pancakeRouterContract = (address: string, web3 = web3Inject) => {
  return new web3.eth.Contract(pancakeRouterAbi as AbiItem[], address);
};
export const bridgeRouterContract = (address: string, web3 = web3Inject) => {
  return new web3.eth.Contract(routerAbi as AbiItem[], address);
};
export const pancakeFactoryContract = (address: string, web3 = web3Inject) => {
  return new web3.eth.Contract(factoryAbi as AbiItem[], address);
};
export const pancakePairContract = (address: string, web3 = web3Inject) => {
  return new web3.eth.Contract(pancakePairAbi as AbiItem[], address);
};
export const erc20Contract = (address: string, web3 = web3Inject) => {
  return new web3.eth.Contract(erc20 as AbiItem[], address);
};

export const getErc20Balance = async (
  account: string,
  contractAddress: string,
  chain: string = DEFAULT_CHAIN,
  decimal = 18
) => {
  const web3Http = WEB3_HTTP_PROVIDERS[chain];
  const contract = new web3Http.eth.Contract(
    erc20 as AbiItem[],
    contractAddress
  );
  let balance = await contract.methods.balanceOf(account).call();
  return safeAmount({ str: balance, decimal });
};
export const getNativeBalance = async (
  account: string,
  chain: string = DEFAULT_CHAIN
) => {
  const web3Http = WEB3_HTTP_PROVIDERS[chain];
  const bnbBalance = await web3Http.eth.getBalance(account);
  return safeAmount({ str: bnbBalance, decimal: 18 });
};

export const getFactory = async (chain: string = DEFAULT_CHAIN) => {
  const web3Http = WEB3_HTTP_PROVIDERS[chain];
  const contract = pancakeRouterContract(
    configs.BRIDGE[chain].CONTRACTS.PANCAKE_ROUTER_CONTRACT,
    web3Http
  );
  const factory = await contract.methods.factory().call();
  return factory;
};

export const getPair = async (
  token1: string,
  token2: string,
  pancakeFactoryAddress: string,
  chain: string = DEFAULT_CHAIN
) => {
  const web3Http = WEB3_HTTP_PROVIDERS[chain];
  const contract = pancakeFactoryContract(pancakeFactoryAddress, web3Http);
  const pair = await contract.methods.getPair(token1, token2).call();
  return pair;
};

export async function erc20Approved(
  amount: number,
  contractAddress: string,
  erc20Address: string,
  account: string,
  chain: string = DEFAULT_CHAIN
) {
  const web3Http = WEB3_HTTP_PROVIDERS[chain];
  const approvePrice = convertToContractValue({ amount });
  const contract = erc20Contract(erc20Address, web3Http);
  const allowance = await contract.methods
    .allowance(account, contractAddress)
    .call();
  return allowance && Number(allowance) > Number(approvePrice);
}
export function erc20Approve(
  erc20Address: string,
  contract: string,
  account: string
) {
  return erc20Contract(erc20Address)
    .methods.approve(contract, MAX_INT)
    .send({ from: account });
}

export const getAmountsOut = async (
  amountIn: number,
  addresses: string[],
  routerContract: string,
  chain: string = DEFAULT_CHAIN
) => {
  const web3Http = WEB3_HTTP_PROVIDERS[chain];
  const contract = pancakeRouterContract(routerContract, web3Http);
  const ethAmount = convertToContractValue({ amount: amountIn });
  const amountOut = await contract.methods
    .getAmountsOut(ethAmount, addresses)
    .call();
  return amountOut;
};

export const getPath = async (
  token1: BridgeToken,
  token2: BridgeToken,
  chain: string = DEFAULT_CHAIN
) => {
  const bridgeToken = configs.BRIDGE[chain].CONTRACTS.BRIDGE_TOKEN;
  const network = configs.NETWORKS[chain];
  const wrapToken = network.wrapToken;
  const pancakeFactoryAddress =
    configs.BRIDGE[chain].CONTRACTS.PANCAKE_FACTORY_CONTRACT;
  let path: string[] = [];
  let firstPath = token1.contract;
  let endPath = token2.contract;
  if (token1.native) {
    firstPath = wrapToken.contract;
  }
  if (token2.native) {
    endPath = wrapToken.contract;
  }
  const pair = await getPair(firstPath, endPath, pancakeFactoryAddress, chain);
  if (pair === BURN_ADDRESS) {
    path = [firstPath, bridgeToken, endPath];
  } else {
    path = [firstPath, endPath];
  }
  return path;
};

export const getDestinationAmount = async (
  amountIn: number,
  token1: BridgeToken,
  token2: BridgeToken,
  chain: string = DEFAULT_CHAIN
) => {
  const pancakeRouter = configs.BRIDGE[chain].CONTRACTS.PANCAKE_ROUTER_CONTRACT;
  const path = await getPath(token1, token2, chain);
  const amountOut = await getAmountsOut(amountIn, path, pancakeRouter, chain);
  return safeAmount({ str: amountOut[amountOut.length - 1], decimal: 18 });
};

export const routerSwapExactETHForTokens = async (
  from: string,
  amountIn: number,
  amountOutMin: number,
  path: string[],
  to: string,
  deadLine: number,
  chain: string = DEFAULT_CHAIN
) => {
  const bridgeRouterAddress = configs.BRIDGE[chain].CONTRACTS.ROUTER_CONTRACT;
  const contract = bridgeRouterContract(bridgeRouterAddress);
  const amountInContract = convertToContractValue({ amount: amountIn });
  const amountOutMinContract = convertToContractValue({ amount: amountOutMin });
  const deadLineTimestamp = parseInt(String(Date.now() / 1e3)) + deadLine;
  return await contract.methods
    .routerSwapExactETHForTokens(
      amountInContract,
      amountOutMinContract,
      path,
      to,
      deadLineTimestamp
    )
    .send({ from: from, value: amountInContract });
};

export const routerSwapExactTokensForETH = async (
  from: string,
  amountIn: number,
  amountOutMin: number,
  path: string[],
  to: string,
  deadLine: number,
  chain: string = DEFAULT_CHAIN
) => {
  const bridgeRouterAddress = configs.BRIDGE[chain].CONTRACTS.ROUTER_CONTRACT;
  const contract = bridgeRouterContract(bridgeRouterAddress);
  const amountInContract = convertToContractValue({ amount: amountIn });
  const amountOutMinContract = convertToContractValue({ amount: amountOutMin });
  const deadLineTimestamp = parseInt(String(Date.now() / 1e3)) + deadLine;
  return await contract.methods
    .routerSwapExactTokensForETH(
      amountInContract,
      amountOutMinContract,
      path,
      to,
      deadLineTimestamp
    )
    .send({ from: from, value: amountInContract });
};

export const routerSwapExactTokensForTokens = async (
  from: string,
  amountIn: number,
  amountOutMin: number,
  path: string[],
  to: string,
  deadLine: number,
  chain: string = DEFAULT_CHAIN
) => {
  const bridgeRouterAddress = configs.BRIDGE[chain].CONTRACTS.ROUTER_CONTRACT;
  const contract = bridgeRouterContract(bridgeRouterAddress);
  const amountInContract = convertToContractValue({ amount: amountIn });
  const amountOutMinContract = convertToContractValue({ amount: amountOutMin });
  const deadLineTimestamp = parseInt(String(Date.now() / 1e3)) + deadLine;
  return await contract.methods
    .routerSwapExactTokensForTokens(
      amountInContract,
      amountOutMinContract,
      path,
      to,
      deadLineTimestamp
    )
    .send({ from: from, value: amountInContract });
};

export const transfer = async (
  token1: BridgeToken,
  token2: BridgeToken,
  bridgeToken: string,
  amountIn: number,
  amountOutMin: number,
  from: string,
  to: string,
  deadLine: number,
  chain: string = DEFAULT_CHAIN
) => {
  const path = await getPath(token1, token2, chain);
  if (token1.native) {
    return routerSwapExactETHForTokens(
      from,
      amountIn,
      amountOutMin,
      path,
      to,
      deadLine,
      chain
    );
  }
  if (token2.native) {
    return routerSwapExactTokensForETH(
      from,
      amountIn,
      amountOutMin,
      path,
      to,
      deadLine,
      chain
    );
  }
  return routerSwapExactTokensForTokens(
    from,
    amountIn,
    amountOutMin,
    path,
    to,
    deadLine,
    chain
  );
};
