import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export function appOrigin(): string {
  const result = z.url().safeParse(process.env.APP_ORIGIN);
  if (!result.success) throw new Error('APP_ORIGIN is missing or invalid.');
  const url = new URL(result.data);
  if (
    url.origin !== result.data ||
    (url.protocol !== 'https:' &&
      !(
        url.protocol === 'http:' &&
        ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
      ))
  )
    throw new Error(
      'APP_ORIGIN must be a trusted HTTPS origin or loopback origin.',
    );
  return url.origin;
}
export class RequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
  ) {
    super(code);
  }
}
export async function readBody(request: NextRequest): Promise<unknown> {
  if (request.headers.get('origin') !== appOrigin())
    throw new RequestError(403, 'invalid_origin');
  if (
    request.headers.get('content-type')?.split(';')[0]?.trim() !==
    'application/json'
  )
    throw new RequestError(415, 'invalid_content_type');
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError(400, 'invalid_request');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) {
        await reader.cancel();
        throw new RequestError(413, 'request_too_large');
      }
      chunks.push(value);
    }
    const body = Buffer.concat(chunks);
    try {
      return JSON.parse(body.toString('utf8')) as unknown;
    } catch {
      throw new RequestError(400, 'invalid_request');
    }
  } finally {
    reader.releaseLock();
  }
}
export function failure(error: unknown): NextResponse {
  const status = error instanceof RequestError ? error.status : 503;
  const code =
    error instanceof RequestError ? error.code : 'service_unavailable';
  return NextResponse.json(
    {
      error: code,
      retryable: status >= 500 || status === 429,
      request_id: crypto.randomUUID(),
    },
    { status, headers: { 'Cache-Control': 'private, no-store' } },
  );
}
export function rpcFailure(code: string): never {
  if (code === '28000' || code === 'PGRST301' || code === 'PGRST302')
    throw new RequestError(401, 'authentication_required');
  if (code === '42501') throw new RequestError(403, 'account_unavailable');
  if (code === '40001') throw new RequestError(409, 'profile_conflict');
  throw new RequestError(503, 'service_unavailable');
}
