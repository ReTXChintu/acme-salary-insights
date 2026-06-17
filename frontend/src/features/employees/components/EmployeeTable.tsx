import {
  Button,
  HStack,
  Input,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";

import {
  getCountryName,
  getDepartmentName,
} from "../../../lib/constants/reference-data";
import type { Employee } from "../types";

type EmployeeTableProps = {
  employees: Employee[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
  isLoading?: boolean;
};

export function EmployeeTable({
  employees,
  searchValue,
  onSearchChange,
  onEdit,
  onDelete,
  isLoading = false,
}: EmployeeTableProps) {
  return (
    <Stack gap="4">
      <Input
        aria-label="Search employees"
        placeholder="Search employees"
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      {isLoading ? (
        <Text color="gray.600">Loading employees...</Text>
      ) : employees.length === 0 ? (
        <Text role="status">No employees found.</Text>
      ) : (
        <Table.Root aria-label="Employees table">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Code</Table.ColumnHeader>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Email</Table.ColumnHeader>
              <Table.ColumnHeader>Department</Table.ColumnHeader>
              <Table.ColumnHeader>Country</Table.ColumnHeader>
              <Table.ColumnHeader>Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {employees.map((employee) => (
              <Table.Row key={employee.id}>
                <Table.Cell>{employee.employeeCode}</Table.Cell>
                <Table.Cell>
                  {employee.firstName} {employee.lastName}
                </Table.Cell>
                <Table.Cell>{employee.email}</Table.Cell>
                <Table.Cell>
                  {getDepartmentName(employee.departmentId)}
                </Table.Cell>
                <Table.Cell>{getCountryName(employee.countryId)}</Table.Cell>
                <Table.Cell>
                  <HStack gap="2">
                    {onEdit ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(employee)}
                      >
                        Edit
                      </Button>
                    ) : null}
                    {onDelete ? (
                      <Button
                        size="sm"
                        colorPalette="red"
                        variant="outline"
                        onClick={() => onDelete(employee)}
                      >
                        Delete
                      </Button>
                    ) : null}
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Stack>
  );
}
