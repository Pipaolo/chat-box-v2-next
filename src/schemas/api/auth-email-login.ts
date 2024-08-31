import { z } from "zod";

export const AuthEmailLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type AuthEmailLogin = z.infer<typeof AuthEmailLoginSchema>;
