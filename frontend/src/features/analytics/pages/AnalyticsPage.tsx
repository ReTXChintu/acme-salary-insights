import {
  Box,
  Heading,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";

import { formatCurrency } from "../../../lib/utils/format";
import { PayrollBarChart } from "../components/PayrollBarChart";
import { PayrollPieChart } from "../components/PayrollPieChart";
import { SalaryDistributionChart } from "../components/SalaryDistributionChart";
import {
  usePayrollByCountryQuery,
  usePayrollByDepartmentQuery,
  useSalaryDistributionQuery,
  useTopPaidEmployeesQuery,
} from "../hooks/useAnalyticsQueries";

function CountryComparisonTable({
  entries,
  totalPayroll,
}: {
  entries: Array<{ countryId: string; countryName: string; total: number }>;
  totalPayroll: number;
}) {
  return (
    <Box
      aria-label="Country comparison"
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      _dark={{ bg: "gray.900", borderColor: "gray.700" }}
      borderColor="gray.200"
      p="5"
      overflowX="auto"
    >
      <Heading as="h2" size="md" mb="4">
        Country comparison
      </Heading>
      {entries.length === 0 ? (
        <Text color="gray.500">No country payroll data yet.</Text>
      ) : (
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Country</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Total payroll</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Share</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {entries.map((entry) => (
              <Table.Row key={entry.countryId}>
                <Table.Cell>{entry.countryName}</Table.Cell>
                <Table.Cell textAlign="end">
                  {formatCurrency(entry.total)}
                </Table.Cell>
                <Table.Cell textAlign="end">
                  {totalPayroll === 0
                    ? "0%"
                    : `${((entry.total / totalPayroll) * 100).toFixed(1)}%`}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
}

export function AnalyticsPage() {
  const distributionQuery = useSalaryDistributionQuery();
  const countryQuery = usePayrollByCountryQuery();
  const departmentQuery = usePayrollByDepartmentQuery();
  const topPaidQuery = useTopPaidEmployeesQuery(10);

  const isLoading =
    distributionQuery.isLoading ||
    countryQuery.isLoading ||
    departmentQuery.isLoading ||
    topPaidQuery.isLoading;

  if (isLoading) {
    return <Text>Loading analytics...</Text>;
  }

  if (distributionQuery.isError) {
    return (
      <Text color="red.600" role="alert">
        {distributionQuery.error instanceof Error
          ? distributionQuery.error.message
          : "Analytics unavailable"}
      </Text>
    );
  }

  const distribution = distributionQuery.data?.data ?? [];
  const countryEntries = countryQuery.data?.data ?? [];
  const countryChartData = countryEntries.map((entry) => ({
    name: entry.countryName,
    value: entry.total,
  }));
  const departmentChartData = (departmentQuery.data?.data ?? []).map((entry) => ({
    name: entry.departmentName,
    value: entry.total,
  }));
  const totalCountryPayroll = countryEntries.reduce(
    (sum, entry) => sum + entry.total,
    0,
  );

  return (
    <Stack gap="6">
      <Box>
        <Heading as="h1" size="2xl">
          Analytics
        </Heading>
        <Text mt="2" color="gray.600" _dark={{ color: "gray.400" }}>
          Why is it happening?
        </Text>
      </Box>

      <Box
        aria-label="Payroll by country"
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        _dark={{ bg: "gray.900", borderColor: "gray.700" }}
        borderColor="gray.200"
        p="5"
      >
        <Heading as="h2" size="md" mb="4">
          Payroll by country
        </Heading>
        <PayrollPieChart
          ariaLabel="Payroll by country chart"
          data={countryChartData}
        />
      </Box>

      <Box
        aria-label="Payroll by department"
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        _dark={{ bg: "gray.900", borderColor: "gray.700" }}
        borderColor="gray.200"
        p="5"
      >
        <Heading as="h2" size="md" mb="4">
          Payroll by department
        </Heading>
        <PayrollBarChart
          ariaLabel="Payroll by department chart"
          data={departmentChartData}
          layout="horizontal"
        />
      </Box>

      <Box
        aria-label="Salary distribution"
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        _dark={{ bg: "gray.900", borderColor: "gray.700" }}
        borderColor="gray.200"
        p="5"
      >
        <Heading as="h2" size="md" mb="4">
          Salary distribution
        </Heading>
        <SalaryDistributionChart data={distribution} />
      </Box>

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
          Top paid employees
        </Heading>
        {(topPaidQuery.data?.data ?? []).length === 0 ? (
          <Text color="gray.500">No top paid employees yet.</Text>
        ) : (
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Code</Table.ColumnHeader>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">Salary</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {(topPaidQuery.data?.data ?? []).map((entry) => (
                <Table.Row key={entry.employeeId}>
                  <Table.Cell>{entry.employeeCode}</Table.Cell>
                  <Table.Cell>
                    {entry.firstName} {entry.lastName}
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

      <CountryComparisonTable
        entries={countryEntries}
        totalPayroll={totalCountryPayroll}
      />
    </Stack>
  );
}
