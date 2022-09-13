import configs from "configs";

const heStats = async () =>
  (
    await fetch(
      "https://api.coingecko.com/api/v3/coins/heroes-empires?localization=false"
    )
  ).json();

// const hePrice = async () => (await fetch(`${configs.DASHBOARD_API_URL}/api/v1/hePrice`)).json();
const hePrice = async () => {
  const price = await(
    await fetch(
      `${configs.MP_API}/market/api/market-data/price/heroes-empires?vs_currencies=usd`
    )
  ).json();
  return { price: Number(price) };
};

const heChartData = async (days: string, interval: string) =>
  (
    await fetch(
      `https://api.coingecko.com/api/v3/coins/heroes-empires/market_chart?vs_currency=usd&days=${days}&interval=${interval}`
    )
  ).json();
export const heStatsService = { heStats, hePrice, heChartData };
