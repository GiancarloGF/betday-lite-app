import NextAuth from 'next-auth';

import { authConfig } from '@/modules/auth/infrastructure/auth.config';

// Centralized NextAuth helpers to be reused across routes, middleware and pages
export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
