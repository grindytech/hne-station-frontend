import { format } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
type Props = {
  setActiveToolTipIndex: (index: number) => void;
  chartData: any[];
  xDataKey: string;
  yDataKey: string;
  h: number;
};
export default function CustomAreaChart({
  setActiveToolTipIndex,
  chartData,
  xDataKey,
  yDataKey,
  h,
}: Props) {
  return (
    <ResponsiveContainer width="100%" height={h}>
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        onMouseMove={(props) => {
          setActiveToolTipIndex(props.activeTooltipIndex || 0);
        }}
        onMouseLeave={() => {
          setActiveToolTipIndex(0);
        }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7CC29A" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#7CC29A" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis
          padding={{ right: 0, left: 0 }}
          domain={[
            chartData[0][xDataKey],
            chartData[chartData.length - 1][xDataKey],
          ]}
          scale="time"
          dataKey={xDataKey}
          tickFormatter={(date: any) => format(new Date(date), "MMM dd")}
          type="number"
          tickLine={false}
        />
        <YAxis
          hide={true}
          axisLine={false}
          tickLine={false}
          dataKey={yDataKey}
        />
        <CartesianGrid
          vertical={false}
          strokeDasharray="0"
          strokeOpacity={0.4}
        />
        <Tooltip active={false} content={<></>} />
        <Area
          type="monotone"
          name="Transfer: "
          dataKey={yDataKey}
          stroke="#4BA170"
          strokeWidth="2px"
          dot={false}
          fillOpacity={1}
          fill="url(#colorUv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
