import { ReactComponent as BNBCoin } from "assets/bnb_coin.svg";
import { ReactComponent as BUSDCoin } from "assets/busd_coin.svg";
import { ReactComponent as HECoin } from "assets/he_coin.svg";
import React from "react";

export enum ICONS {
  BSC = "BSC",
  HE = "HE",
  BUSD = "BUSD",
  USDT = "USDT",
  BNB = "BNB",
  WBNB = "WBNB",
  DOS = "DOS",
  SKY = "SKY",
}
const sgvIcons: { [n: string]: React.ReactElement } = {};
sgvIcons[ICONS.BSC] = <BNBCoin/>;
sgvIcons[ICONS.HE] = <HECoin/>;
sgvIcons[ICONS.BUSD] = <BUSDCoin/>;
sgvIcons[ICONS.USDT] = <BUSDCoin/>;
sgvIcons[ICONS.BNB] = <BNBCoin/>;
sgvIcons[ICONS.WBNB] = <BNBCoin/>;
sgvIcons[ICONS.DOS] = <BNBCoin/>;
sgvIcons[ICONS.SKY] = <HECoin />;

export const getSgvIcon = (icon: string) => {
  return sgvIcons[icon];
};
