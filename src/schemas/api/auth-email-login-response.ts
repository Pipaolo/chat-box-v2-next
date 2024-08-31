import { z } from "zod";
import { UserSchema } from "../user";

export const AuthEmailLoginResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
  tokenExpiresAt: z.number().optional(),
  user: UserSchema,
});

export type AuthEmailLoginResponse = z.infer<
  typeof AuthEmailLoginResponseSchema
>;
