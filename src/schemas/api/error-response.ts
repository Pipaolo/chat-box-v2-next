import { z } from "zod";

export const ApiErrorResponseSchema = z.object({
  status: z.number(),
  errors: z.record(z.any()),
});

export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
