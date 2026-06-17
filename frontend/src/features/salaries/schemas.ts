import { z } from "zod";

export const salaryFormSchema = z.object({
  amount: z.number().positive("Amount must be greater than zero"),
  currency: z.string().min(1, "Currency is required"),
  effectiveDate: z.string().min(1, "Effective date is required"),
});

export type SalaryFormValues = z.infer<typeof salaryFormSchema>;
