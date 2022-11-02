import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { format } from "date-fns";
import { useState } from "react";
import { useQuery } from "react-query";
import bridgeService from "services/bridge.service";
import CustomAreaChart from "./CustomAreaChart";
type Props = {
  w: string | number;
  h: number;
};
export default function BridgeTransferChart({ w, h }: Props) {
  const [dataType, setDataType] = useState("D");
  const [activeToolTipIndex, setActiveToolTipIndex] = useState(0);
  const { data: chartData, isLoading: isChartLoading } = useQuery(
    ["BridgeTransferChart", dataType],
    async () => {
      const data = await bridgeService.getChartData({
        name: "transfer",
        key: dataType as "D" | "W" | "M",
      });
      return data.items;
    }
  );
  return (
    <Card w="full">
      <VStack w="full" spacing={2}>
        <HStack w="full" justifyContent="space-between" alignItems="start">
          <VStack w="full" align="start" spacing={0}>
            <Text fontSize="sm" color="primary.500">
              Transactions
            </Text>
            <VStack align="start" spacing={0}>
              <Text fontSize="xl" fontWeight="semibold">
                {chartData ? chartData[activeToolTipIndex].value : "--"}
              </Text>
              <Text fontSize="xs" color="gray.400">
                {chartData
                  ? format(
                      new Date(chartData[activeToolTipIndex].time),
                      "MMM dd yyyy ppp"
                    )
                  : "--"}
              </Text>
            </VStack>
          </VStack>

          <ButtonGroup isAttached size="xs" color="primary.500">
            <Button
              isActive={dataType === "D"}
              onClick={() => {
                setDataType("D");
              }}
            >
              D
            </Button>
            <Button
              isActive={dataType === "W"}
              onClick={() => {
                setDataType("W");
              }}
            >
              W
            </Button>
            <Button
              isActive={dataType === "M"}
              onClick={() => {
                setDataType("M");
              }}
            >
              M
            </Button>
          </ButtonGroup>
        </HStack>

        <Box w="full" minHeight={h} width={w}>
          <Skeleton isLoaded={!isChartLoading}>
            {chartData && (
              <CustomAreaChart
                chartData={chartData}
                setActiveToolTipIndex={(index) => {
                  setActiveToolTipIndex(index);
                }}
                xDataKey="time"
                yDataKey="value"
                h={Number(h)}
              />
            )}
          </Skeleton>
        </Box>
      </VStack>
    </Card>
  );
}
