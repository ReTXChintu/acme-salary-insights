import { z } from "zod";

export const employeeFormSchema = z.object({
  employeeCode: z.string().min(1, "Employee code is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  departmentId: z.string().min(1, "Department is required"),
  countryId: z.string().min(1, "Country is required"),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
