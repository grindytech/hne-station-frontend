import { Box, Button, ButtonGroup, HStack, Select, Skeleton, Text, VStack } from "@chakra-ui/react";
import Card from "components/card/Card";
import configs from "configs";
import { format } from "date-fns";
import useCustomToast from "hooks/useCustomToast";
import numeral from "numeral";
import { useCallback, useState } from "react";
import { useQuery } from "react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { heStatsService } from "services/heStats";
import { numeralFormat } from "utils/utils";
export default function HeChart() {
  const toast = useCustomToast();
  const [days, setDays] = useState("30");
  const [dataType, setDateType] = useState("volume");
  const { data, isFetching: chartDataFetching } = useQuery(
    ["HeChart-chartData", days],
    async () => (await heStatsService.heChartData(days, days === "1" ? "" : "daily")) || {},
    {
      onError: (err) => {
        console.error(err);
        toast.error("Cannot connect to server!");
      },
    }
  );

  const { data: chartData } = useQuery(["HeChart-chartDataRender", data, dataType], () => {
    const { prices, total_volumes } = data || {};
    return dataType === "volume" ? total_volumes : prices;
  });

  // const dateFormatter = (date: any) => format(new Date(date), "MMM dd");
  return (
    <Card w="full">
      <VStack w="full" spacing={5}>
        <HStack w="full" justifyContent="space-between" alignItems="center">
          <Text fontSize="lg" fontWeight="semibold" color="primary.500">
            {dataType === "volume"
              ? "Transaction volume"
              : `${configs.TOKEN_SYMBOL} price`}
          </Text>
          <Select
            onChange={(e) => setDateType(e.target.value)}
            w={"32"}
            size="sm"
            color="primary.500"
            borderRadius={25}
          >
            <option value="volume">Volume</option>
            <option value="price">Price</option>
          </Select>
        </HStack>
        <Box w="full" minHeight={400}>
          {chartData && (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7CC29A" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7CC29A" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis
                  domain={[chartData[0][0], chartData[chartData.length - 1][0]]}
                  scale="time"
                  dataKey="0"
                  tickFormatter={(date: any) =>
                    format(
                      new Date(date),
                      days === "1" ? "HH:00 MMM dd" : "MMM dd"
                    )
                  }
                  type="number"
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => numeral(v).format(`0,0.[000000]a`)}
                  axisLine={false}
                  tickLine={false}
                />
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="0"
                  strokeOpacity={0.4}
                />
                <Tooltip
                  separator=""
                  formatter={(d: any) =>
                    numeralFormat(d, dataType === "volume" ? 0 : 6)
                  }
                  labelFormatter={(date: any) =>
                    format(
                      new Date(date),
                      days === "1" ? "HH:00 MM/dd/yyyy" : "MM/dd/yyyy"
                    )
                  }
                />
                <Area
                  type="monotone"
                  name="$"
                  dataKey="1"
                  stroke="#4BA170"
                  strokeWidth="2px"
                  dot={false}
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Box>
        <ButtonGroup isAttached size="xs" w="full" color="primary.500">
          <Button
            onClick={() => {
              setDays("1");
            }}
            isActive={days === "1"}
            w="full"
          >
            Last 24h
          </Button>
          <Button
            onClick={() => {
              setDays("7");
            }}
            isActive={days === "7"}
            w="full"
          >
            7 days
          </Button>
          <Button
            onClick={() => {
              setDays("14");
            }}
            isActive={days === "14"}
            w="full"
          >
            14 days
          </Button>
          <Button
            onClick={() => {
              setDays("30");
            }}
            isActive={days === "30"}
            w="full"
          >
            30 days
          </Button>
          <Button
            onClick={() => {
              setDays("max");
            }}
            isActive={days === "max"}
            w="full"
          >
            All
          </Button>
        </ButtonGroup>
      </VStack>
    </Card>
  );
}
