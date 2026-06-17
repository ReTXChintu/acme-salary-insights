import { z } from "zod";

export const createSalarySchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.string().trim().min(1),
  effectiveDate: z.coerce.date(),
});
