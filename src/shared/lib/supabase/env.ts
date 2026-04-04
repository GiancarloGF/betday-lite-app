import { supabaseServerEnvSchema } from '@/shared/schemas/env.schema';

export const supabaseServerEnv = supabaseServerEnvSchema.parse({
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
});
