import { publicEnvSchema, type PublicEnv } from './schema';

// Lazy validation keeps the generic static shell independent of auth configuration.
export function getPublicEnv(): PublicEnv {
  const result = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
  if (!result.success) {
    // Do not include submitted values or raw validation errors in logs.
    throw new Error(
      'Supabase public environment is missing or invalid. See .env.example.',
    );
  }
  return result.data;
}
