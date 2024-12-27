import { z } from "zod";

const CardOverviewValidationSchema = z.object({
  totalBalance: z
    .number()
    .min(0, { message: "Total balance must be greater than or equal to 0" }),
});

export const cardValidations = {
  CardOverviewValidationSchema,
};
