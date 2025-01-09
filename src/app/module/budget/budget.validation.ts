import { z } from "zod";

export const TBudgetRequestSchema = z.object({
  category: z.string().refine((value) => /^[a-fA-F0-9]{24}$/.test(value), {
    message: "Invalid ObjectId format for category",
  }),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  limit: z.number().min(0, "Limit must be a positive number"),
});

export const budgetValidations = {
  TBudgetRequestSchema,
};
