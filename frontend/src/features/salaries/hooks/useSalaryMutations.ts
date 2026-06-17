import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createSalary } from "../../../lib/api/salaries";
import type { CreateSalaryInput } from "../types";
import { salaryKeys } from "./useSalariesQuery";

export function useCreateSalaryMutation(employeeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSalaryInput) => createSalary(employeeId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: salaryKeys.list(employeeId),
      });
    },
  });
}
