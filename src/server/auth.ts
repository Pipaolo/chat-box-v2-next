import {
  type DefaultUser,
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { api } from "~/trpc/server";
import { type AuthUser } from "~/schemas/user";
import { env } from "~/env";
import { type User, type DefaultJWT } from "next-auth/jwt";
import { AuthEmailLoginSchema } from "~/schemas/api/auth-email-login";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];

    tokenDetails: {
      token: string;
      refreshToken: string;
      tokenExpiresAt?: number;
    };
  }

  interface User extends DefaultUser {
    tokenDetails: {
      token: string;
      refreshToken: string;
      tokenExpiresAt?: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends Record<string, unknown>, DefaultJWT {
    token: string;
    refreshToken: string;
    tokenExpiresAt?: number;
  }

  interface User extends DefaultUser {
    tokenDetails: {
      token: string;
      refreshToken: string;
      tokenExpiresAt?: number;
    };
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user && !("emailVerified" in user)) {
        token.sub = user.id.toString();
        token.token = user.tokenDetails.token;
        token.refreshToken = user.tokenDetails.refreshToken;
        token.tokenExpiresAt = user.tokenDetails.tokenExpiresAt;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub!;
        session.tokenDetails = {
          refreshToken: token.refreshToken,
          token: token.token,
          tokenExpiresAt: token.tokenExpiresAt,
        };
      }
      return session;
    },
  },
  providers: [
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
    CredentialsProvider({
      credentials: {
        email: {
          type: "email",
        },
        password: {
          type: "password",
        },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials) {
            return null;
          }

          const parsedCredentials = AuthEmailLoginSchema.safeParse(credentials);

          if (!parsedCredentials.success) {
            return null;
          }

          // Check if the email and password are valid
          const response = await api.auth.loginByEmail(parsedCredentials.data);

          return {
            id: response.user.id.toString(),
            email: response.user.email,
            image: response.user.photo?.path,
            name: `${response.user.firstName} ${response.user.lastName}`,
            tokenDetails: {
              token: response.token,
              refreshToken: response.refreshToken,
              tokenExpiresAt: response.tokenExpiresAt,
            },
          };
        } catch {
          return null;
        }
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
