import { expect } from '@playwright/test';

const mailOrigin = 'http://127.0.0.1:54324';
// Local Mailpit only. Never connect browser tests to a hosted project or mailbox.
export function localTestConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (url !== 'http://127.0.0.1:54321' || !key?.startsWith('sb_publishable_'))
    throw new Error('Auth tests require the local Supabase stack.');
  return { url, key };
}
export async function confirmationLink(
  email: string,
  recovery = false,
): Promise<string> {
  let link = '';
  await expect
    .poll(
      async () => {
        const response = await fetch(`${mailOrigin}/api/v1/messages`);
        const data = (await response.json()) as {
          messages: {
            ID: string;
            To: { Address: string }[];
            Subject: string;
          }[];
        };
        const message = data.messages.find(
          (message) =>
            message.To.some((to) => to.Address === email) &&
            (recovery
              ? /reset/i.test(message.Subject)
              : /confirm/i.test(message.Subject)),
        );
        if (!message) return false;
        const detail = (await (
          await fetch(`${mailOrigin}/api/v1/message/${message.ID}`)
        ).json()) as { Text: string; HTML: string };
        const match = `${detail.Text}\n${detail.HTML}`.match(
          /https?:\/\/[^\s"<>]+\/auth\/v1\/verify\?[^\s"<>]+/,
        );
        if (!match) return false;
        link = match[0].replaceAll('&amp;', '&');
        if (new URL(link).origin !== 'http://127.0.0.1:54321')
          throw new Error('Unexpected verification link origin.');
        return true;
      },
      { timeout: 15_000 },
    )
    .toBe(true);
  return link;
}
