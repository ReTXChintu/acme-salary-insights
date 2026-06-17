import { Box, Text } from "@chakra-ui/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "../../../lib/utils/format";
import { CHART_AXIS_COLOR, CHART_COLORS, CHART_GRID_COLOR } from "./chartTheme";

type PayrollBarChartProps = {
  ariaLabel: string;
  data: Array<{ name: string; value: number }>;
  layout?: "horizontal" | "vertical";
};

export function PayrollBarChart({
  ariaLabel,
  data,
  layout = "vertical",
}: PayrollBarChartProps) {
  if (data.length === 0) {
    return <Text color="gray.500">No data available.</Text>;
  }

  const isHorizontal = layout === "horizontal";

  return (
    <Box aria-label={ariaLabel} height={{ base: "240px", md: "280px" }} width="100%">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={isHorizontal ? "vertical" : "horizontal"}
          margin={{ top: 8, right: 8, left: isHorizontal ? 24 : 0, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
          {isHorizontal ? (
            <>
              <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
              <YAxis type="category" dataKey="name" width={96} tick={{ fill: CHART_AXIS_COLOR }} />
            </>
          ) : (
            <>
              <XAxis dataKey="name" tick={{ fill: CHART_AXIS_COLOR }} />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
            </>
          )}
          <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
          <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
