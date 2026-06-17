import { z } from "zod";

export const createEmployeeSchema = z.object({
  employeeCode: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  departmentId: z.string().min(1),
  countryId: z.string().min(1),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export const employeeIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const listEmployeesQuerySchema = z.object({
  departmentId: z.string().min(1).optional(),
  countryId: z.string().min(1).optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type ListEmployeesQuery = z.infer<typeof listEmployeesQuerySchema>;
