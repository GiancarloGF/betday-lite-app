import type { NextAuthOptions, Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

import { env } from '@/shared/lib/env';

/**
 * NextAuth configuration.
 * Uses a mock credentials provider with demo user credentials.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      // Validate credentials against the demo user credentials
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (
          email === env.NEXT_PUBLIC_DEMO_EMAIL &&
          password === env.NEXT_PUBLIC_DEMO_PASSWORD
        ) {
          // Return a minimal authenticated user payload for the demo session
          return {
            id: 'demo-user',
            name: 'Demo User',
            email: env.NEXT_PUBLIC_DEMO_EMAIL,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
      }

      return session;
    },
  },
};
