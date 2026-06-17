import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  HStack,
  IconButton,
  Pagination,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ChevronLeftIcon, ChevronRightIcon } from "../../../components/icons/ChevronIcons";

import { useEmployeesQuery } from "../hooks/useEmployeesQuery";
import type { Employee } from "../types";
import { EmployeeCreateModal } from "../components/EmployeeCreateModal";
import { EmployeeDeleteDialog } from "../components/EmployeeDeleteDialog";
import { EmployeeFilters } from "../components/EmployeeFilters";
import { EmployeeTable } from "../components/EmployeeTable";
import { EmployeeUpdateModal } from "../components/EmployeeUpdateModal";

const PAGE_SIZE = 10;

export function EmployeesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [departmentId, setDepartmentId] = useState<string>();
  const [countryId, setCountryId] = useState<string>();
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null,
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const { data, isLoading, isFetching } = useEmployeesQuery({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
    departmentId,
    countryId,
  });

  const employees = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleDepartmentChange = (nextDepartmentId?: string) => {
    setDepartmentId(nextDepartmentId);
    setPage(1);
  };

  const handleCountryChange = (nextCountryId?: string) => {
    setCountryId(nextCountryId);
    setPage(1);
  };

  const handleClearFilters = () => {
    setDepartmentId(undefined);
    setCountryId(undefined);
    setPage(1);
  };

  return (
    <Stack gap="6">
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        gap="4"
      >
        <Box>
          <Heading as="h1" size="2xl">
            Employees
          </Heading>
          <Text mt="2" color="gray.600">
            Manage employee records, filters, and CRUD actions.
          </Text>
        </Box>
        <Button onClick={() => setIsCreateOpen(true)}>Add employee</Button>
      </Flex>

      <EmployeeFilters
        departmentId={departmentId}
        countryId={countryId}
        onDepartmentChange={handleDepartmentChange}
        onCountryChange={handleCountryChange}
        onClear={handleClearFilters}
      />

      <EmployeeTable
        employees={employees}
        searchValue={search}
        onSearchChange={setSearch}
        onView={(employee) => navigate(`/employees/${employee.id}`)}
        onEdit={setEmployeeToEdit}
        onDelete={setEmployeeToDelete}
        isLoading={isLoading || isFetching}
      />

      <HStack justify="space-between" align="center" wrap="wrap" gap="4">
        <Text color="gray.600" _dark={{ color: "gray.400" }}>
          Showing {employees.length} of {total} employees
        </Text>
        {totalPages > 1 ? (
          <Pagination.Root
            count={total}
            pageSize={PAGE_SIZE}
            page={page}
            onPageChange={(details) => setPage(details.page)}
          >
            <ButtonGroup variant="outline" size="sm" attached>
              <Pagination.PrevTrigger asChild>
                <IconButton aria-label="Previous page">
                  <ChevronLeftIcon />
                </IconButton>
              </Pagination.PrevTrigger>
              <Pagination.Context>
                {({ pages }) =>
                  pages.map((pageItem, index) =>
                    pageItem.type === "page" ? (
                      <Pagination.Item key={index} {...pageItem} />
                    ) : (
                      <Pagination.Ellipsis key={index} index={index} />
                    ),
                  )
                }
              </Pagination.Context>
              <Pagination.NextTrigger asChild>
                <IconButton aria-label="Next page">
                  <ChevronRightIcon />
                </IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>
        ) : null}
      </HStack>

      {totalPages > 1 ? (
        <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }}>
          Page {page} of {totalPages}
        </Text>
      ) : null}

      <EmployeeCreateModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
      <EmployeeUpdateModal
        employee={employeeToEdit}
        open={Boolean(employeeToEdit)}
        onOpenChange={(open) => {
          if (!open) {
            setEmployeeToEdit(null);
          }
        }}
      />
      <EmployeeDeleteDialog
        employee={employeeToDelete}
        open={Boolean(employeeToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setEmployeeToDelete(null);
          }
        }}
      />
    </Stack>
  );
}
