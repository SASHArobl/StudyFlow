import { NextRequest, NextResponse } from 'next/server';
import { createRequestClient } from '@/lib/supabase/server';
import { requireConfirmedUser } from '@/lib/supabase/require-user';
import { appOrigin, failure, RequestError } from '@/lib/auth-http';

// Refresh only the server-protected recovery screen. API handlers enforce their
// own authorization; the approved /app document remains a generic static shell.
export async function proxy(request: NextRequest) {
  let finish = (response: NextResponse) => response;
  try {
    const client = createRequestClient(request);
    finish = client.finish;
    await requireConfirmedUser(client.supabase);
    return finish(NextResponse.next({ request: { headers: request.headers } }));
  } catch (error) {
    if (error instanceof RequestError && error.status === 401)
      return finish(
        NextResponse.redirect(
          new URL('/forgot-password?notice=session-required', appOrigin()),
        ),
      );
    return finish(failure(error));
  }
}
export const config = { matcher: ['/reset-password'] };
