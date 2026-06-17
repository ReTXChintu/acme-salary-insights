import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createEmployee,
  deleteEmployee,
  updateEmployee,
} from "../../../lib/api/employees";
import type { CreateEmployeeInput, UpdateEmployeeInput } from "../types";
import { employeeKeys } from "./useEmployeesQuery";

export function useCreateEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEmployeeInput) => createEmployee(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}

export function useUpdateEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateEmployeeInput;
    }) => updateEmployee(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}

export function useDeleteEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}
