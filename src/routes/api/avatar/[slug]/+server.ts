// src/routes/api/avatar/[slug]/+server.ts
import type { RequestHandler } from './$types';
import { parseOptionsFromSearchParams, buildRemoteUrl } from '$lib/utils/robohash';

export const GET: RequestHandler = async ({ params, url }) => {
  const slug = String(params.slug ?? 'anon');
  const opts = parseOptionsFromSearchParams(url.searchParams);
  const remote = buildRemoteUrl(slug, opts);

  const res = await fetch(remote);
  if (!res.ok) {
    const text = await res.text().catch(() => 'error');
    return new Response(text, { status: res.status, headers: { 'content-type': 'text/plain' } });
  }

  const headers = new Headers({
    'content-type': res.headers.get('content-type') ?? 'image/png',
    'cache-control': 'public, max-age=2592000, immutable, stale-while-revalidate=86400',
  });

  return new Response(res.body, { status: 200, headers });
};
