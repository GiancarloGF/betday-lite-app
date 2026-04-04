import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { syncAppUser } from '@/modules/auth/infrastructure/sync-app-user';
import { env } from '@/shared/lib/env';

/**
 * NextAuth configuration.
 * Uses Google OAuth and synchronizes the application user in Supabase.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || account.provider !== 'google') {
        return false;
      }

      if (!user.email) {
        return false;
      }

      const emailVerifiedValue = (
        profile as { email_verified?: boolean } | undefined
      )?.email_verified;
      const emailVerified =
        typeof emailVerifiedValue === 'boolean' ? emailVerifiedValue : true;

      if (!emailVerified) {
        return false;
      }

      const appUserId = await syncAppUser({
        email: user.email,
        name: user.name,
        image: user.image,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      });

      user.id = appUserId;

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image =
          typeof token.picture === 'string' ? token.picture : null;
      }

      return session;
    },
  },
};
