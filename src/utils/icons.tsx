import { ReactComponent as BNBCoin } from "assets/bnb_coin.svg";
import { ReactComponent as BUSDCoin } from "assets/busd_coin.svg";
import { ReactComponent as HECoin } from "assets/he_coin.svg";
import { ReactComponent as USDTCoin } from "assets/tether.svg";
import { ReactComponent as AVAX } from "assets/avax.svg";
import { ReactComponent as DOS } from "assets/dos_chain.svg";
import HE from "assets/he.png";

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
  AVAX = "AVAX",
}
const sgvIcons: { [n: string]: React.ReactElement } = {};
sgvIcons[ICONS.BSC] = <BNBCoin />;
sgvIcons[ICONS.HE] = <HECoin />;
sgvIcons[ICONS.BUSD] = <BUSDCoin />;
sgvIcons[ICONS.USDT] = <USDTCoin />;
sgvIcons[ICONS.BNB] = <BNBCoin />;
sgvIcons[ICONS.WBNB] = <BNBCoin />;
sgvIcons[ICONS.AVAX] = <AVAX />;
sgvIcons[ICONS.SKY] = <HECoin />;
sgvIcons[ICONS.DOS] = <DOS />;


export const getSgvIcon = (icon: string) => {
  return sgvIcons[icon];
};
