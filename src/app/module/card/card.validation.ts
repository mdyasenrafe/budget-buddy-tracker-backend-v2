import { z } from "zod";

const cardCreateSchema = z.object({
  last4Digits: z
    .string()
    .length(4, { message: "Last 4 digits must be exactly 4 characters" }),
  bankName: z.string().min(1, { message: "Bank name is required" }),
  accountHolderName: z
    .string()
    .min(1, { message: "Account holder name is required" }),
  expireDate: z.string(),
  totalBalance: z.number().nonnegative(),
});
const cardUpdateSchema = z.object({
  last4Digits: z
    .string()
    .length(4, { message: "Last 4 digits must be exactly 4 characters" })
    .optional(),
  bankName: z.string().min(1, { message: "Bank name is required" }).optional(),
  accountHolderName: z
    .string()
    .min(1, { message: "Account holder name is required" })
    .optional(),
  expireDate: z.string(),
  totalBalance: z.number().nonnegative().optional(),
});

export const cardValidations = {
  cardCreateSchema,
  cardUpdateSchema,
};
