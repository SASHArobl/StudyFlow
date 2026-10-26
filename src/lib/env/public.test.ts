import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPublicEnv } from './public';

afterEach(() => vi.unstubAllEnvs());

describe('environment access', () => {
  it('returns only validated public values', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://localhost:54321');
    vi.stubEnv(
      'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
      'sb_publishable_test_only',
    );
    vi.stubEnv('SUPABASE_SECRET_KEY', 'sb_secret_never_public');
    expect(getPublicEnv()).toEqual({
      NEXT_PUBLIC_SUPABASE_URL: 'http://localhost:54321',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test_only',
    });
  });

  it('fails only when accessed and never echoes the supplied secret', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv(
      'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
      'sb_secret_never_public',
    );
    expect(getPublicEnv).toThrow(
      'Supabase public environment is missing or invalid. See .env.example.',
    );
    expect(getPublicEnv).not.toThrow('sb_secret_never_public');
  });

  it('rejects missing configuration instead of using a fake backend', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', undefined);
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', undefined);
    expect(getPublicEnv).toThrow(
      'Supabase public environment is missing or invalid.',
    );
  });
});
