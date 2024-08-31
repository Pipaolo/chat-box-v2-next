import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z
    .string({
      required_error: "This field is required",
    })
    .email({
      message: "Invalid email address",
    }),
  password: z
    .string({
      required_error: "This field is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    }),
});

export type LoginFormSchema = z.infer<typeof LoginFormSchema>;
