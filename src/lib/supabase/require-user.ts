import 'server-only';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { RequestError } from '@/lib/auth-http';

export async function requireConfirmedUser(
  supabase: SupabaseClient<Database>,
): Promise<User> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  // An unavailable provider must not be presented as an expired user session.
  if (
    error &&
    (error.status === 0 || (error.status !== undefined && error.status >= 500))
  )
    throw new RequestError(503, 'service_unavailable');
  if (error || !user?.email || !user.email_confirmed_at)
    throw new RequestError(401, 'authentication_required');
  return user;
}
