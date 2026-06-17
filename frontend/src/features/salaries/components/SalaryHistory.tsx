import {
  Box,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

import type { Salary } from "../types";

type SalaryHistoryProps = {
  salaries: Salary[];
};

function formatSalaryAmount(amount: number, currency: string): string {
  return `${amount.toLocaleString("en-US")} ${currency}`;
}

function formatEffectiveDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US");
}

export function SalaryHistory({ salaries }: SalaryHistoryProps) {
  if (salaries.length === 0) {
    return (
      <Text role="status">No salary history available.</Text>
    );
  }

  return (
    <Stack gap={4} aria-label="Salary history" role="list">
      <Heading size="md">Salary History</Heading>

      {salaries.map((salary) => (
        <Box
          key={salary.id}
          borderWidth="1px"
          borderRadius="md"
          padding={4}
          role="listitem"
        >
          <Text fontWeight="semibold">
            {formatSalaryAmount(Number(salary.amount), salary.currency)}
          </Text>
          <Text color="fg.muted">
            Effective date: {formatEffectiveDate(salary.effectiveDate)}
          </Text>
        </Box>
      ))}
    </Stack>
  );
}
