import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import apiClient from "~/lib/api-client";
import { AuthEmailLoginResponseSchema } from "~/schemas/api/auth-email-login-response";
import { AuthEmailLoginSchema } from "~/schemas/api/auth-email-login";
import { UserSchema } from "~/schemas/user";

export const authRouter = createTRPCRouter({
  loginByEmail: publicProcedure
    .input(AuthEmailLoginSchema)
    .mutation(async ({ input }) => {
      const response = await apiClient.v1.post("/auth/email/login", {
        email: input.email,
        password: input.password,
      });

      return AuthEmailLoginResponseSchema.safeParse(response.data);
    }),
  getUserDetails: protectedProcedure.query(async ({ ctx }) => {
    const response = await apiClient.v1.get("/auth/me");

    return UserSchema.parse(response.data);
  }),
});
