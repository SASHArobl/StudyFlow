import { NextRequest, NextResponse } from 'next/server';
import { appOrigin } from '@/lib/auth-http';
import { createRequestClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  let finish = (response: NextResponse) => response;
  try {
    const client = createRequestClient(request);
    finish = client.finish;
    const code = request.nextUrl.searchParams.get('code');
    if (code && code.length <= 2048) {
      const { error } = await client.supabase.auth.exchangeCodeForSession(code);
      if (!error)
        return finish(
          NextResponse.redirect(
            new URL(
              request.nextUrl.searchParams.get('flow') === 'recovery'
                ? '/reset-password'
                : '/app',
              appOrigin(),
            ),
            303,
          ),
        );
    }
    return finish(
      NextResponse.redirect(
        new URL('/login?notice=invalid-link', appOrigin()),
        303,
      ),
    );
  } catch {
    return finish(
      NextResponse.redirect(
        new URL('/login?notice=service-unavailable', appOrigin()),
        303,
      ),
    );
  }
}
