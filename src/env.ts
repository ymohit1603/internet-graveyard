import { z } from 'zod';

const envSchema = z.object({
  SUPABASE_URL: z.string().min(1, 'Supabase URL is required'),
  SUPABASE_ANON_KEY: z.string().min(1, 'Supabase Anon Key is required'),
  PADDLE_ENVIRONMENT: z.enum(['sandbox', 'production']).default('sandbox'),
  PADDLE_SELLER_ID: z.string().min(1, 'Paddle Seller ID is required'),
  PADDLE_PRICE_ID: z.string().min(1, 'Paddle Price ID is required'),
  PADDLE_TOKEN: z.string().min(1, 'Paddle Token is required'),
  API_URL: z.string().min(1, 'API URL is required'), // ✅ added
});

const processEnv = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  PADDLE_ENVIRONMENT: import.meta.env.VITE_PADDLE_ENVIRONMENT,
  PADDLE_SELLER_ID: import.meta.env.VITE_PADDLE_SELLER_ID,
  PADDLE_PRICE_ID: import.meta.env.VITE_PADDLE_PRICE_ID,
  PADDLE_TOKEN: import.meta.env.VITE_PADDLE_TOKEN,
  API_URL: import.meta.env.VITE_API_URL, // ✅ added
} as const;

export const env = envSchema.parse(processEnv);
