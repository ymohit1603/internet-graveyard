import { z } from 'zod';

const envSchema = z.object({
  SUPABASE_URL: z.string().min(1, 'Supabase URL is required'),
  SUPABASE_ANON_KEY: z.string().min(1, 'Supabase Anon Key is required'),
  API_URL: z.string().min(1, 'API URL is required'), // ✅ added
});

const processEnv = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  API_URL: import.meta.env.VITE_API_URL, // ✅ added
} as const;

export const env = envSchema.parse(processEnv);
