export type RoboOptions = {
  size?: number; // por ex. 128 -> "128x128"
  set?: string; // ex: 'set1'
  bgset?: string; // ex: 'bg1'
  format?: 'png' | 'svg' | 'jpg';
  grayscale?: boolean;
  extra?: Record<string, string | number | boolean>;
};

function optionsToQuery(o?: RoboOptions): string {
  if (!o) return '';
  const p = new URLSearchParams();
  if (o.size) p.set('size', `${o.size}x${o.size}`);
  if (o.set) p.set('set', String(o.set));
  if (o.bgset) p.set('bgset', String(o.bgset));
  if (o.grayscale !== undefined) p.set('grayscale', String(o.grayscale));
  if (o.extra) for (const [k, v] of Object.entries(o.extra)) p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : '';
}

/** URL direta para robohash.org */
export function buildRemoteUrl(slug: string, opts?: RoboOptions): string {
  const ext = opts?.format ? `.${opts.format}` : '';
  return `https://robohash.org/${encodeURIComponent(slug)}${ext}${optionsToQuery(opts)}`;
}

/** URL para o proxy interno do app */
export function buildProxyUrl(slug: string, opts?: RoboOptions): string {
  return `/api/avatar/${encodeURIComponent(slug)}${optionsToQuery(opts)}`;
}

/** parse simples de query params -> RoboOptions (útil no server) */
export function parseOptionsFromSearchParams(params: URLSearchParams): RoboOptions {
  const o: RoboOptions = {};
  if (params.has('size')) {
    const s = params.get('size')!;
    const m = s.match(/^(\d+)x(\d+)$/);
    o.size = m ? Number(m[1]) : Number(s);
  }
  if (params.has('set')) o.set = params.get('set')!;
  if (params.has('bgset')) o.bgset = params.get('bgset')!;
  if (params.has('format')) {
    const f = params.get('format')!;
    if (['png', 'svg', 'jpg'].includes(f)) o.format = f as RoboOptions['format'];
  }
  if (params.has('grayscale')) o.grayscale = params.get('grayscale') === 'true';
  // extras (qualquer outro param)
  const known = new Set(['size', 'set', 'bgset', 'format', 'grayscale']);
  const extra: Record<string, string> = {};
  for (const [k, v] of params.entries()) if (!known.has(k)) extra[k] = v;
  if (Object.keys(extra).length) o.extra = extra;
  return o;
}

/** Default url params */
export function getAvatar(slug: string, size: number): string {
  return buildProxyUrl(slug, { size, format: 'png', bgset: 'any' });
}
