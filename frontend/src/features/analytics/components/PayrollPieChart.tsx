import { Box, Text } from "@chakra-ui/react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { formatCurrency } from "../../../lib/utils/format";
import { CHART_COLORS } from "./chartTheme";

type PayrollPieChartProps = {
  ariaLabel: string;
  data: Array<{ name: string; value: number }>;
};

export function PayrollPieChart({ ariaLabel, data }: PayrollPieChartProps) {
  if (data.length === 0) {
    return <Text color="gray.500">No data available.</Text>;
  }

  return (
    <Box aria-label={ariaLabel} height={{ base: "240px", md: "280px" }} width="100%">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
