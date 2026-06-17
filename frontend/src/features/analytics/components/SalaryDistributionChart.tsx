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

import { CHART_AXIS_COLOR, CHART_COLORS, CHART_GRID_COLOR } from "./chartTheme";

type SalaryDistributionChartProps = {
  data: Array<{ band: string; count: number }>;
};

export function SalaryDistributionChart({ data }: SalaryDistributionChartProps) {
  if (data.every((entry) => entry.count === 0)) {
    return <Text color="gray.500">No salary distribution data yet.</Text>;
  }

  return (
    <Box aria-label="Salary distribution chart" height={{ base: "260px", md: "320px" }} width="100%">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
          <XAxis dataKey="band" tick={{ fill: CHART_AXIS_COLOR }} />
          <YAxis allowDecimals={false} tick={{ fill: CHART_AXIS_COLOR }} />
          <Tooltip formatter={(value) => [`${value ?? 0} employees`, "Count"]} />
          <Bar dataKey="count" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
