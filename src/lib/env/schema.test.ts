import { describe, expect, it } from 'vitest';
import { publicEnvSchema } from './schema';

const valid = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test_only',
};

describe('public environment boundary', () => {
  it('accepts HTTPS and local Supabase without exposing extra fields', () => {
    expect(
      publicEnvSchema.parse({ ...valid, SUPABASE_SECRET_KEY: 'never-public' }),
    ).toEqual(valid);
    expect(
      publicEnvSchema.safeParse({
        ...valid,
        NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54321',
      }).success,
    ).toBe(true);
  });

  it.each([
    {},
    { ...valid, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: '' },
    { ...valid, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_test_only' },
    { ...valid, NEXT_PUBLIC_SUPABASE_URL: 'not-a-url' },
    { ...valid, NEXT_PUBLIC_SUPABASE_URL: 'http://example.com' },
    { ...valid, NEXT_PUBLIC_SUPABASE_URL: 'https://user:password@example.com' },
  ])('rejects missing or unsafe configuration: case %#', (input) => {
    expect(publicEnvSchema.safeParse(input).success).toBe(false);
  });
});
