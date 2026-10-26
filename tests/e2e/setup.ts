import { createClient } from '@supabase/supabase-js';
import { confirmationLink, localTestConfig } from './mail';
export default async function setup() {
  const { url, key } = localTestConfig();
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const email = `foundation-${crypto.randomUUID()}@studyflow.test`;
  const password = `Test-only-${crypto.randomUUID()}`;
  const signup = await client.auth.signUp({ email, password });
  if (signup.error)
    throw new Error(`Local fixture registration failed: ${signup.error.code}`);
  const link = new URL(await confirmationLink(email));
  const token = link.searchParams.get('token');
  if (!token)
    throw new Error('Local email did not contain a verification token.');
  const verified = await client.auth.verifyOtp({
    token_hash: token,
    type: 'signup',
  });
  if (verified.error)
    throw new Error(
      `Local fixture confirmation failed: ${verified.error.code}`,
    );
  await client.auth.signOut();
  process.env.STUDYFLOW_TEST_EMAIL = email;
  process.env.STUDYFLOW_TEST_PASSWORD = password;
}
