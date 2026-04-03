import { z } from "zod";

const getAnalyticsSchema = z.object({
  query: z.object({
    year: z.string({
      required_error: "Year is required",
    }),
    month: z.string({
      required_error: "Month index is required",
    }),
    timezone: z.string({
      required_error: "Timezone is required",
    }),
    categoryIds: z.string().optional(),
  }),
});

export const analyticsValidations = {
  getAnalyticsSchema,
};
