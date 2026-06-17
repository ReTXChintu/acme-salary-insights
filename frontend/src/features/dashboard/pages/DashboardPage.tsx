import {
  Box,
  Heading,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";

import { formatCount, formatCurrency } from "../../../lib/utils/format";
import {
  useAnalyticsSummaryQuery,
  useTopPaidEmployeesQuery,
} from "../../analytics/hooks/useAnalyticsQueries";

function KpiCard({
  label,
  value,
  isLoading,
}: {
  label: string;
  value: string;
  isLoading: boolean;
}) {
  return (
    <Box
      aria-label={label}
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
      bg="white"
      _dark={{ bg: "gray.900", borderColor: "gray.700" }}
      p="5"
    >
      <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
        {label}
      </Text>
      {isLoading ? (
        <Skeleton height="8" mt="2" />
      ) : (
        <Heading as="p" size="lg" mt="2">
          {value}
        </Heading>
      )}
    </Box>
  );
}

export function DashboardPage() {
  const summaryQuery = useAnalyticsSummaryQuery();
  const topPaidQuery = useTopPaidEmployeesQuery(5);

  const isLoading = summaryQuery.isLoading || topPaidQuery.isLoading;

  if (isLoading) {
    return <Text>Loading dashboard metrics...</Text>;
  }

  const summary = summaryQuery.data;
  const topPaidData = topPaidQuery.data?.data ?? [];

  return (
    <Stack gap="6">
      <Box>
        <Heading as="h1" size="2xl">
          Dashboard
        </Heading>
        <Text mt="2" color="gray.600" _dark={{ color: "gray.400" }}>
          What is happening right now?
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap="4">
        <KpiCard
          label="Total employees"
          value={formatCount(summary?.totalEmployees ?? 0)}
          isLoading={summaryQuery.isLoading}
        />
        <KpiCard
          label="Total payroll"
          value={formatCurrency(summary?.totalPayroll ?? 0)}
          isLoading={summaryQuery.isLoading}
        />
        <KpiCard
          label="Average salary"
          value={formatCurrency(summary?.averageSalary ?? 0)}
          isLoading={summaryQuery.isLoading}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap="4" maxW={{ md: "xl" }}>
        <KpiCard
          label="Countries"
          value={formatCount(summary?.countryCount ?? 0)}
          isLoading={summaryQuery.isLoading}
        />
        <KpiCard
          label="Departments"
          value={formatCount(summary?.departmentCount ?? 0)}
          isLoading={summaryQuery.isLoading}
        />
      </SimpleGrid>

      <Box
        aria-label="Top paid employees"
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        _dark={{ bg: "gray.900", borderColor: "gray.700" }}
        borderColor="gray.200"
        p="5"
        overflowX="auto"
      >
        <Heading as="h2" size="md" mb="4">
          Top 5 highest paid employees
        </Heading>
        {topPaidData.length === 0 ? (
          <Text color="gray.500">No top paid employees yet.</Text>
        ) : (
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Employee</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">Salary</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {topPaidData.map((entry) => (
                <Table.Row key={entry.employeeId}>
                  <Table.Cell>
                    {entry.employeeCode ?? entry.employeeId} — {entry.firstName}{" "}
                    {entry.lastName}
                  </Table.Cell>
                  <Table.Cell textAlign="end">
                    {formatCurrency(entry.amount)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Box>
    </Stack>
  );
}
