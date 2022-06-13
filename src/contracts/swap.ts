import configs from "configs";
import { BURN_ADDRESS, MAX_INT } from "constant";
import { convertToContractValue, covertToContractValue } from "utils/utils";
import Web3 from "web3";
import { erc20Contract, factoryV2Contract, getErc20Balance, routerV2Contract } from "./contracts";

type TokenInfo = {
  token: string;
  name: string;
  isNative: boolean;
  address: string;
  decimals: number;
  wrapper?: string;
};
export const TOKEN_INFO: { [key: string]: TokenInfo } = {
  HE: {
    token: "HE",
    name: "Heroes & Empires",
    isNative: false,
    address: configs.HE_CONTRACT,
    decimals: 18,
  },
  BUSD: {
    token: "BUSD",
    name: "BUSD Token",
    isNative: false,
    address: configs.BUSD_CONTRACT,
    decimals: 18,
  },
  BNB: {
    token: "BNB",
    name: "BNB Token",
    isNative: true,
    decimals: 18,
    address: "",
    wrapper: "WBNB",
  },
  WBNB: {
    token: "WBNB",
    name: "Wrapped BNB",
    address: configs.WBNB_CONTRACT,
    decimals: 18,
    isNative: false,
  },
};

export const getPair = async (address1: string, address2: string): Promise<string> => {
  const address = await factoryV2Contract().methods.getPair(address1, address2).call();
  return address;
};

type PairInfo = {
  pair: string;
  balance: { [key: string]: number };
  price: number;
  priceAfter: number;
  priceImpact: number;
  receive: number;
  route: string;
};
export const getPairInfo = async (
  token1: TokenInfo,
  token2: TokenInfo,
  amount: number
): Promise<PairInfo | undefined> => {
  const address1 = token1.address;
  const address2 = token2.address;
  const pairAddress = await getPair(address1, address2);
  if (pairAddress !== BURN_ADDRESS) {
    const [balance1, balance2] = await Promise.all([
      getErc20Balance(token1.address, token1.decimals, pairAddress),
      getErc20Balance(token2.address, token2.decimals, pairAddress),
    ]);
    const pair1: PairInfo = {
      pair: pairAddress,
      balance: {},
      price: 0,
      priceAfter: 0,
      priceImpact: 0,
      receive: 0,
      route: "",
    };
    pair1.balance[address1] = balance1;
    pair1.balance[address2] = balance2;
    const price = balance2 / balance1;
    const balance2After = (balance1 * balance2) / (balance1 + amount);
    const priceAfter = (balance2 - balance2After) / amount;
    const priceImpact = ((price - priceAfter) / price) * 100;
    pair1.price = price;
    pair1.priceAfter = priceAfter;
    pair1.priceImpact = priceImpact;
    pair1.receive = balance2 - balance2After;
    pair1.route = token2.token;
    return pair1;
  }
};

export const getPairs = async (
  tk1: string,
  tk2: string,
  amount: number,
  bridgeToken = "BUSD"
): Promise<PairInfo[] | undefined> => {
  debugger;
  let token1 = TOKEN_INFO[tk1];
  token1 = token1.isNative && token1.wrapper ? TOKEN_INFO[token1.wrapper] : token1;
  let token2 = TOKEN_INFO[tk2];
  token2 = token2.isNative && token2.wrapper ? TOKEN_INFO[token2.wrapper] : token2;
  const bridge = TOKEN_INFO[bridgeToken];

  if (tk1 === "BUSD" || tk2 === "BUSD") {
    const pairInfo = await getPairInfo(token1, token2, amount);
    return pairInfo ? [pairInfo] : undefined;
  } else {
    const pair1 = await getPairInfo(token1, bridge, amount);
    if (pair1) {
      const pair2 = await getPairInfo(bridge, token2, pair1.receive);
      return pair2 ? [pair1, pair2] : undefined;
    }
  }
};

const toDecimals = (number: number, decimal = 18) => {
  return convertToContractValue({ amount: number, decimal });
};

export function swap(
  amountIn: number,
  minReceive: number,
  token1: string,
  token2: string,
  route: string[],
  from: string,
  to: string,
  deadline: number
) {
  if (token1 === "BNB") {
    const path = ["WBNB", ...route].map((token) => TOKEN_INFO[token].address);
    return routerV2Contract()
      .methods.swapExactETHForTokens(toDecimals(minReceive), path, to, Math.round(deadline / 1000))
      .send({
        from: from,
        value: toDecimals(amountIn),
      });
  } else if (token2 === "WBNB") {
    const path = [token1, ...route].map((token) => TOKEN_INFO[token].address);
    return routerV2Contract()
      .methods.swapExactTokensForETH(
        toDecimals(amountIn),
        toDecimals(minReceive),
        path,
        to,
        Math.round(deadline / 1000)
      )
      .send({
        from: from,
      });
  } else {
    const path = [token1, ...route].map((token) => TOKEN_INFO[token].address);
    return routerV2Contract()
      .methods.swapExactTokensForTokens(
        toDecimals(amountIn),
        toDecimals(minReceive),
        path,
        to,
        Math.round(deadline / 1000)
      )
      .send({
        from: from,
      });
  }
}

export async function erc20Approved(
  amount: number,
  token: string,
  contract: string,
  account: string
) {
  const erc20Address = TOKEN_INFO[token].address;
  const approvePrice = covertToContractValue({ amount });
  const allowance = await erc20Contract(erc20Address).methods.allowance(account, contract).call();
  return allowance && Number(allowance) > Number(approvePrice);
}

export function erc20Approve(token: string, contract: string, account: string) {
  const erc20Address = TOKEN_INFO[token].address;
  return erc20Contract(erc20Address).methods.approve(contract, MAX_INT).send({ from: account });
}
