import { useQuery } from "@tanstack/react-query";

import { listSalaries } from "../../../lib/api/salaries";

export const salaryKeys = {
  all: ["salaries"] as const,
  lists: () => [...salaryKeys.all, "list"] as const,
  list: (employeeId: string) => [...salaryKeys.lists(), employeeId] as const,
};

export function useSalariesQuery(employeeId: string | null) {
  return useQuery({
    queryKey: salaryKeys.list(employeeId ?? "unknown"),
    queryFn: () => listSalaries(employeeId!),
    enabled: Boolean(employeeId),
  });
}
