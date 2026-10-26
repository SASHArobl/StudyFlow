import 'server-only';
import { z } from 'zod';

const secretSchema = z.string().trim().startsWith('sb_secret_');

export function getSupabaseSecretKey(): string {
  const result = secretSchema.safeParse(process.env.SUPABASE_SECRET_KEY);
  if (!result.success) {
    throw new Error(
      'Supabase server secret is missing or invalid. See .env.example.',
    );
  }
  return result.data;
}
