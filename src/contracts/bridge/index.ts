import configs from "configs";
import { BURN_ADDRESS, MAX_INT } from "constant";
import {
  Chain,
  safeAmount,
  web3Inject,
  WEB3_HTTP_PROVIDERS,
} from "contracts/contracts";
import { convertToContractValue } from "utils/utils";
import { AbiItem } from "web3-utils";
import erc20 from "../ERC20.json";
import factoryAbi from "./factory.abi.json";
import issueAbi from "./issue.abi.json";
import layer0EndpointAbi from "./layer0Endpoint.abi.json";
import pancakePairAbi from "./pancakePair.abi.json";
import pancakeRouterAbi from "./pancakeRouter.abi.json";
import routerAbi from "./router.abi.json";

export type BridgeToken = {
  name: string;
  key: string;
  id: string;
  contract: string;
  native?: boolean;
  decimal: number;
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
export const layer0EndpointContract = (address: string, web3 = web3Inject) => {
  return new web3.eth.Contract(layer0EndpointAbi as AbiItem[], address);
};

export const issueContract = (address: string, web3 = web3Inject) => {
  return new web3.eth.Contract(issueAbi as AbiItem[], address);
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

export const routerSwapExactETHForTokens = (
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
  return contract.methods.routerSwapExactETHForTokens(
    amountInContract,
    amountOutMinContract,
    path,
    to,
    deadLineTimestamp
  );
};

export const routerSwapExactTokensForETH = (
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
  return contract.methods.routerSwapExactTokensForETH(
    amountInContract,
    amountOutMinContract,
    path,
    to,
    deadLineTimestamp
  );
};

export const routerSwapExactTokensForTokens = (
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
  return contract.methods.routerSwapExactTokensForTokens(
    amountInContract,
    amountOutMinContract,
    path,
    to,
    deadLineTimestamp
  );
};

export const swap = (
  to: string,
  token: string,
  amount: number,
  chain: string = DEFAULT_CHAIN
) => {
  const bridgeRouterAddress = configs.BRIDGE[chain].CONTRACTS.ROUTER_CONTRACT;
  const contract = bridgeRouterContract(bridgeRouterAddress);
  const amountContractValue = convertToContractValue({ amount: amount });
  return contract.methods.swap(amountContractValue, token, to);
};

export const deposit = (
  amount: number,
  to: string,
  chain: string = Chain.BSC
) => {
  const bridgeRouterAddress = configs.BRIDGE[chain].CONTRACTS.ROUTER_CONTRACT;
  const amountContractValue = convertToContractValue({ amount: amount });
  const contract = bridgeRouterContract(bridgeRouterAddress);
  return contract.methods.deposit(amountContractValue, to);
};

export const transfer = (
  token1: BridgeToken,
  token2: BridgeToken,
  path: string[],
  amountIn: number,
  amountOutMin: number,
  from: string,
  to: string,
  deadLine: number,
  fee: number,
  chain: string = DEFAULT_CHAIN
): { contractMethod: any; param: any } => {
  let contractCall = undefined;
  let contractFee = fee;
  debugger;

  if (token1.id === token2.id && !token1.native) {
    contractCall = swap(to, token1.contract, amountIn, chain);
  } else {
    if (token1.native) {
      if (token2.id === token1.id) {
        contractCall = deposit(amountIn, to, chain);
      } else {
        contractCall = routerSwapExactETHForTokens(
          amountIn,
          amountOutMin,
          path,
          to,
          deadLine,
          chain
        );
      }
      contractFee += amountIn;
    } else if (token2.native) {
      contractCall = routerSwapExactTokensForETH(
        amountIn,
        amountOutMin,
        path,
        to,
        deadLine,
        chain
      );
    } else {
      contractCall = routerSwapExactTokensForTokens(
        amountIn,
        amountOutMin,
        path,
        to,
        deadLine,
        chain
      );
    }
  }
  const contractFeeValue = convertToContractValue({ amount: contractFee });
  return {
    contractMethod: contractCall,
    param: { from, value: contractFeeValue },
  };
};

export const swapIssueContract = (
  _dstChainId: number,
  token: string,
  amount: number,
  fee: number,
  to: string,
  from: string,
  chain: string = Chain.AVAX
): { contractMethod: any; param: any } => {
  const issueContractAddress = configs.BRIDGE[chain].CONTRACTS.ISSUE_CONTRACT;
  const contract = issueContract(issueContractAddress);
  const amountContractValue = convertToContractValue({ amount: amount });
  const contractFeeValue = convertToContractValue({ amount: fee });

  const contractMethod = contract.methods.swap(
    _dstChainId,
    token,
    amountContractValue,
    to
  );
  return {
    contractMethod: contractMethod,
    param: { from, value: contractFeeValue },
  };
};
// fee
export const estimateFeesBSCPayload = ({
  sourceChain,
  to,
  tokenOut,
  amountOut,
  decimals,
  timestamp,
  chain = Chain.BSC,
}: {
  sourceChain: number;
  to: string;
  tokenOut: string;
  amountOut: number;
  decimals: number;
  timestamp: number;
  chain: string;
}) => {
  const amountOutContractValue = convertToContractValue({
    amount: amountOut,
    decimal: decimals,
  });
  const payload = WEB3_HTTP_PROVIDERS[chain].eth.abi.encodeParameters(
    ["uint16", "address", "address", "uint256", "uint16", "uint256"],
    [sourceChain, to, tokenOut, amountOutContractValue, decimals, timestamp]
  );
  return payload;
};

export const estimateFeesAVAXPayload = ({
  amount,
  tokenSource,
  to,
  decimals,
  chain = Chain.BSC,
}: {
  amount: number;
  tokenSource: string;
  to: string;
  decimals: number;
  chain: string;
}) => {
  const amountContractValue = convertToContractValue({
    amount: amount,
    decimal: decimals,
  });
  const payload = WEB3_HTTP_PROVIDERS[chain].eth.abi.encodeParameters(
    ["uint256", "address", "address", "uint16"],
    [amountContractValue, tokenSource, to, decimals]
  );
  return payload;
};

export const estimateFees = async ({
  _dstChainId,
  payload,
  chain = Chain.BSC,
}: {
  _dstChainId: number;
  payload: string;
  chain: string;
}) => {
  debugger;
  const httpProvider = WEB3_HTTP_PROVIDERS[chain];
  const layer0ContractAddress =
    configs.BRIDGE[chain].CONTRACTS.LAYER_0_ENDPOINT;
  const layer0Contract = layer0EndpointContract(
    layer0ContractAddress,
    httpProvider
  );
  const decimal = configs.NETWORKS[chain].nativeCurrency.decimals;
  const contract = configs.BRIDGE[chain].IS_USE_LP
    ? configs.BRIDGE[chain].CONTRACTS.ROUTER_CONTRACT
    : configs.BRIDGE[chain].CONTRACTS.ISSUE_CONTRACT;
  const { nativeFee, zroFee } = await layer0Contract.methods
    .estimateFees(_dstChainId, contract, payload, false, "0x")
    .call();
  const fee = safeAmount({
    str: String(nativeFee),
    decimal,
  });

  return fee;
};
