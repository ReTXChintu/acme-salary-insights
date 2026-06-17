import { useQuery } from "@tanstack/react-query";

import {
  getEmployee,
  listEmployees,
} from "../../../lib/api/employees";
import type { ListEmployeesParams } from "../types";

export const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (params: ListEmployeesParams) =>
    [...employeeKeys.lists(), params] as const,
  details: () => [...employeeKeys.all, "detail"] as const,
  detail: (id: string) => [...employeeKeys.details(), id] as const,
};

export function useEmployeesQuery(params: ListEmployeesParams) {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => listEmployees(params),
  });
}

export function useEmployeeQuery(id: string | null) {
  return useQuery({
    queryKey: employeeKeys.detail(id ?? "unknown"),
    queryFn: () => getEmployee(id!),
    enabled: Boolean(id),
  });
}
