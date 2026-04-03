import { headers } from 'next/headers';

/**
 * Resolves the current application base URL from incoming request headers.
 */
export async function getBaseUrl(): Promise<string> {
  const requestHeaders = await headers();

  const host =
    requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host');

  const protocol =
    requestHeaders.get('x-forwarded-proto') ??
    (host?.includes('localhost') ? 'http' : 'https');

  if (!host) {
    throw new Error('Unable to resolve request host');
  }

  return `${protocol}://${host}`;
}
