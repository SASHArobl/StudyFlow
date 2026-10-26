import { NextRequest, NextResponse } from 'next/server';
import { requireConfirmedUser } from '@/lib/supabase/require-user';
import { createRequestClient } from '@/lib/supabase/server';
import {
  appOrigin,
  failure,
  readBody,
  RequestError,
  rpcFailure,
} from '@/lib/auth-http';
import { authSchemas, emptySchema } from '@/domain/auth';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ action: string }> },
) {
  let finish = (response: NextResponse) => response;
  try {
    const { action } = await context.params;
    if (
      ![
        'login',
        'register',
        'forgot-password',
        'reset-password',
        'logout',
      ].includes(action)
    )
      throw new RequestError(404, 'not_found');
    const body = await readBody(request);
    const schema =
      action === 'logout'
        ? emptySchema
        : authSchemas[action as keyof typeof authSchemas];
    const parsed = schema.safeParse(body);
    if (!parsed.success) return failure(new RequestError(422, 'invalid_input'));
    const client = createRequestClient(request);
    finish = client.finish;
    const { supabase } = client;
    let error: { code?: string; status?: number } | null = null;
    if (action === 'register') {
      const data = authSchemas.register.parse(body);
      ({ error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { emailRedirectTo: `${appOrigin()}/auth/confirm` },
      }));
    } else if (action === 'login') {
      const data = authSchemas.login.parse(body);
      ({ error } = await supabase.auth.signInWithPassword(data));
    } else if (action === 'forgot-password') {
      const data = authSchemas['forgot-password'].parse(body);
      ({ error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${appOrigin()}/auth/confirm?flow=recovery`,
      }));
    } else if (action === 'reset-password') {
      await requireConfirmedUser(supabase);
      const profile = await supabase.rpc('profile');
      if (profile.error) rpcFailure(profile.error.code);
      ({ error } = await supabase.auth.updateUser({
        password: authSchemas['reset-password'].parse(body).password,
      }));
      if (!error) {
        const result = await supabase.auth.signOut({ scope: 'global' });
        if (result.error)
          throw new RequestError(503, 'password_changed_signout_failed');
      }
    } else {
      // SDK clears cookies and revokes this device's refresh session.
      ({ error } = await supabase.auth.signOut({ scope: 'local' }));
    }
    if (error) {
      if (
        error.status === 0 ||
        (error.status !== undefined && error.status >= 500)
      )
        throw new RequestError(503, 'service_unavailable');
      if (
        (action === 'register' &&
          ['user_already_exists', 'email_exists'].includes(error.code ?? '')) ||
        (action === 'forgot-password' && error.code === 'user_not_found')
      )
        return finish(NextResponse.json({ ok: true }));
      if (error.status === 429) throw new RequestError(429, 'rate_limited');
      if (error.code === 'email_not_confirmed')
        throw new RequestError(403, 'email_not_confirmed');
      if (action === 'login')
        throw new RequestError(401, 'invalid_credentials');
      if (error.code === 'same_password')
        throw new RequestError(422, 'same_password');
      if (error.status && error.status < 500)
        throw new RequestError(422, 'auth_request_failed');
      throw new RequestError(503, 'service_unavailable');
    }
    return finish(NextResponse.json({ ok: true }));
  } catch (error) {
    return finish(failure(error));
  }
}
