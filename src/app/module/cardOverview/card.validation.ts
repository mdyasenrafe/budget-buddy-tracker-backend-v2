import { z } from "zod";

export const CardOverviewValidationSchema = z.object({
  totalBalance: z
    .number()
    .min(0, { message: "Total balance must be greater than or equal to 0" }),
});
