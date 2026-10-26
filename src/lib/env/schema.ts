import { z } from 'zod';

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url().refine((value) => {
    if (!URL.canParse(value)) return false;
    const url = new URL(value);
    return (
      !url.username &&
      !url.password &&
      (url.protocol === 'https:' ||
        (url.protocol === 'http:' &&
          ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)))
    );
  }, 'Use HTTPS, or HTTP on loopback for local Supabase.'),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .trim()
    .min(1)
    .refine(
      (value) => value.startsWith('sb_publishable_'),
      'Use a publishable key; secret and legacy JWT keys are not accepted here.',
    ),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
