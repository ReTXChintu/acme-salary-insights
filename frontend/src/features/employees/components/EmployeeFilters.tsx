import { Button, HStack, NativeSelect, Stack } from "@chakra-ui/react";

import { COUNTRIES, DEPARTMENTS } from "../../../lib/constants/reference-data";

type EmployeeFiltersProps = {
  departmentId?: string;
  countryId?: string;
  onDepartmentChange: (departmentId?: string) => void;
  onCountryChange: (countryId?: string) => void;
  onClear: () => void;
};

export function EmployeeFilters({
  departmentId,
  countryId,
  onDepartmentChange,
  onCountryChange,
  onClear,
}: EmployeeFiltersProps) {
  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      gap="4"
      align={{ base: "stretch", md: "flex-end" }}
    >
      <NativeSelect.Root>
        <NativeSelect.Field
          aria-label="Department filter"
          value={departmentId ?? ""}
          onChange={(event) =>
            onDepartmentChange(event.target.value || undefined)
          }
        >
          <option value="">All departments</option>
          {DEPARTMENTS.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>

      <NativeSelect.Root>
        <NativeSelect.Field
          aria-label="Country filter"
          value={countryId ?? ""}
          onChange={(event) => onCountryChange(event.target.value || undefined)}
        >
          <option value="">All countries</option>
          {COUNTRIES.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>

      <HStack>
        <Button variant="outline" onClick={onClear}>
          Clear filters
        </Button>
      </HStack>
    </Stack>
  );
}
