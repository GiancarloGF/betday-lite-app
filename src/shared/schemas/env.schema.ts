import { z } from 'zod';

export const envSchema = z.object({
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

export const supabaseServerEnvSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export type SupabaseServerEnv = z.infer<typeof supabaseServerEnvSchema>;
