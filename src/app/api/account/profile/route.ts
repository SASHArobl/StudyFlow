import { NextRequest, NextResponse } from 'next/server';
import { requireConfirmedUser } from '@/lib/supabase/require-user';
import { createRequestClient } from '@/lib/supabase/server';
import { failure, readBody, RequestError, rpcFailure } from '@/lib/auth-http';
import { emptySchema, profileSchema, updateProfileSchema } from '@/domain/auth';

async function handle(request: NextRequest, update: boolean) {
  let finish = (response: NextResponse) => response;
  try {
    const body = await readBody(request);
    const updateResult = update ? updateProfileSchema.safeParse(body) : null;
    if (
      (updateResult && !updateResult.success) ||
      (!update && !emptySchema.safeParse(body).success)
    )
      throw new RequestError(422, 'invalid_input');
    const changes = updateResult?.success ? updateResult.data : null;
    const client = createRequestClient(request);
    finish = client.finish;
    const user = await requireConfirmedUser(client.supabase);
    if (changes && changes.expected_user_id !== user.id)
      throw new RequestError(409, 'account_changed');
    const result = changes
      ? await client.supabase.rpc('update_profile', {
          p_display_name: changes.display_name,
          p_expected_version: changes.expected_version,
        })
      : await client.supabase.rpc('profile');
    if (result.error) rpcFailure(result.error.code);
    const profile = profileSchema.parse({
      ...(result.data as Record<string, unknown>),
      email: user.email,
    });
    return finish(NextResponse.json({ profile }));
  } catch (error) {
    return finish(failure(error));
  }
}
export const POST = (request: NextRequest) => handle(request, false);
export const PATCH = (request: NextRequest) => handle(request, true);
