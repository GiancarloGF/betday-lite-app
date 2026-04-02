import { z } from 'zod';

export const envSchema = z.object({
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  NEXT_PUBLIC_DEMO_EMAIL: z.string().email(),
  NEXT_PUBLIC_DEMO_PASSWORD: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;
