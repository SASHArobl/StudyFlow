import 'server-only';
import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from './database.types';
import { appOrigin } from '@/lib/auth-http';
import { getPublicEnv } from '@/lib/env/public';

// One client per request. Preserve both cookies and cache headers from SSR refresh.
export function createRequestClient(request: NextRequest) {
  const env = getPublicEnv();
  const pending = new Map<string, { value: string; options: CookieOptions }>();
  const headers = new Headers();
  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      db: { schema: 'api' },
      cookieOptions: {
        sameSite: 'lax',
        secure: new URL(appOrigin()).protocol === 'https:',
      },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookies, refreshHeaders) {
          for (const { name, value, options } of cookies) {
            request.cookies.set(name, value);
            pending.set(name, { value, options });
          }
          for (const [name, value] of Object.entries(refreshHeaders))
            headers.set(name, value);
        },
      },
    },
  );
  function finish(response: NextResponse): NextResponse {
    headers.forEach((value, name) => response.headers.set(name, value));
    response.headers.set('Cache-Control', 'private, no-store, max-age=0');
    response.headers.set('Referrer-Policy', 'no-referrer');
    for (const [name, { value, options }] of pending)
      response.cookies.set(name, value, options);
    return response;
  }
  return { supabase, finish };
}
