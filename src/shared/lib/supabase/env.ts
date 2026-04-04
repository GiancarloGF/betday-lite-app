import { supabaseServerEnvSchema } from '@/shared/schemas/env.schema';

export const supabaseServerEnv = supabaseServerEnvSchema.parse({
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
});
