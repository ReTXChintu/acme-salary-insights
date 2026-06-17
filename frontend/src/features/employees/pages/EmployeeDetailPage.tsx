import {
  Alert,
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import {
  getCountryName,
  getDepartmentName,
} from "../../../lib/constants/reference-data";
import { useEmployeeQuery } from "../hooks/useEmployeesQuery";
import { useSalariesQuery } from "../../salaries/hooks/useSalariesQuery";
import { SalaryHistory } from "../../salaries/components/SalaryHistory";
import { AddSalaryModal } from "../../salaries/components/AddSalaryModal";

function formatSalaryAmount(amount: number, currency: string): string {
  return `${amount.toLocaleString("en-US")} ${currency}`;
}

export function EmployeeDetailPage() {
  const { id } = useParams();
  const [isAddSalaryOpen, setIsAddSalaryOpen] = useState(false);
  const employeeQuery = useEmployeeQuery(id ?? null);
  const salariesQuery = useSalariesQuery(id ?? null);

  if (employeeQuery.isLoading || salariesQuery.isLoading) {
    return (
      <Stack align="center" gap={4} py={10}>
        <Spinner size="lg" />
        <Text>Loading employee details...</Text>
      </Stack>
    );
  }

  if (employeeQuery.isError) {
    return (
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>
            {employeeQuery.error instanceof Error
              ? employeeQuery.error.message
              : "Unable to load employee"}
          </Alert.Title>
        </Alert.Content>
      </Alert.Root>
    );
  }

  const employee = employeeQuery.data;
  const currentSalary = salariesQuery.data?.data[0];

  if (!employee) {
    return null;
  }

  return (
    <Stack gap={6}>
      <Flex justify="space-between" align={{ base: "stretch", md: "center" }} direction={{ base: "column", md: "row" }} gap={4}>
        <Heading size="lg">Employee Details</Heading>
        <Button onClick={() => setIsAddSalaryOpen(true)}>Add salary</Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <Box>
          <Text fontWeight="semibold">Employee code</Text>
          <Text>{employee.employeeCode}</Text>
        </Box>
        <Box>
          <Text fontWeight="semibold">Name</Text>
          <Text>{`${employee.firstName} ${employee.lastName}`}</Text>
        </Box>
        <Box>
          <Text fontWeight="semibold">Email</Text>
          <Text>{employee.email}</Text>
        </Box>
        <Box>
          <Text fontWeight="semibold">Department</Text>
          <Text>{getDepartmentName(employee.departmentId)}</Text>
        </Box>
        <Box>
          <Text fontWeight="semibold">Country</Text>
          <Text>{getCountryName(employee.countryId)}</Text>
        </Box>
        <Box>
          <Text fontWeight="semibold">Current salary</Text>
          <Text aria-label="Current salary">
            {currentSalary
              ? formatSalaryAmount(
                  Number(currentSalary.amount),
                  currentSalary.currency,
                )
              : "No salary recorded"}
          </Text>
        </Box>
      </SimpleGrid>

      <SalaryHistory salaries={salariesQuery.data?.data ?? []} />

      {employee ? (
        <AddSalaryModal
          employeeId={employee.id}
          open={isAddSalaryOpen}
          onOpenChange={setIsAddSalaryOpen}
        />
      ) : null}
    </Stack>
  );
}
