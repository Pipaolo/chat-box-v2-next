import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  provider: z.string(),
  socialId: z.string().nullable(),
  firstName: z.string(),
  lastName: z.string(),
  photo: z
    .object({
      id: z.string(),
      path: z.string(),
    })
    .optional(),
  role: z.object({
    id: z.number(),
    name: z.string(),
    __entity: z.string(),
  }),
  status: z.object({
    id: z.number(),
    name: z.string(),
    __entity: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export type AuthUser = z.infer<typeof UserSchema>;
