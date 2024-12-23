import { z } from "zod";

const uploadSchema = z.object({
  file: z.string(),
});

export const uploadValidations = {
  uploadSchema,
};
