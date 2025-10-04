// lib/gradient-tailwind.ts
/** Gera duas cores pastel determinísticas a partir de uma slug
 *  Retorno:
 *   - from: hex (ex: '#f3d9f2')
 *   - to: hex
 *   - class: string pronta para usar com Tailwind JIT (ex: "bg-gradient-to-r from-[#f3d9f2] to-[#d9f3e8]")
 *   - css: fallback linear-gradient CSS (sem ângulo específico)
 *   - textColor: '#000' | '#fff' (recomendado para legibilidade)
 *
 * Observação: se você já exporta `djb2` em outro arquivo, importe-o e troque a implementação interna.
 */

function djb2(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) + h + str.charCodeAt(i); // h * 33 + c
    // mantém como 32-bit unsigned
    h = h >>> 0;
  }
  return h >>> 0;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

/** Converte HSL (0..360, 0..100, 0..100) para RGB 0..255 */
function hslToRgb(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360;
  s = clamp(s / 100, 0, 1);
  l = clamp(l / 100, 0, 1);

  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hk = h / 360;

  const calc = (t: number) => {
    let x = hk + t;
    if (x < 0) x += 1;
    if (x > 1) x -= 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };

  return {
    r: Math.round(calc(1 / 3) * 255),
    g: Math.round(calc(0) * 255),
    b: Math.round(calc(-1 / 3) * 255),
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  const toHex = (v: number) => v.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toLowerCase();
}

/** luminância relativa (WCAG) */
function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  const srgb = [r, g, b]
    .map(v => v / 255)
    .map(c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

/** mistura simples (média) de dois RGB */
function mixRgb(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) {
  return {
    r: Math.round((a.r + b.r) / 2),
    g: Math.round((a.g + b.g) / 2),
    b: Math.round((a.b + b.b) / 2),
  };
}

export function tailwindGradientFromSlug(slug: string) {
  const hash = djb2(slug);

  // Dois hues independentes derivados do hash
  const hue1 = hash % 360;
  const hue2 = (hash >>> 8) % 360;

  // Pastel por padrão:
  // Saturation média-baixa (ex: 50), Lightness alta (ex: 78)
  // esses valores produzem pastéis visuais e legíveis
  const SAT = 50;
  const LIGHT = 78;

  const rgb1 = hslToRgb(hue1, SAT, LIGHT);
  const rgb2 = hslToRgb(hue2, SAT, LIGHT);

  const hex1 = rgbToHex(rgb1);
  const hex2 = rgbToHex(rgb2);

  // fallback CSS (sem ângulo) — linear left->right
  const css = `linear-gradient(to right, ${hex1} 0%, ${hex2} 100%)`;

  // Tailwind JIT arbitrary color classes — exemplo: bg-gradient-to-r from-[#aabbcc] to-[#ddeeff]
  // Note: no Tailwind escape necessário aqui; use a string gerada diretamente no atributo `class`.
  const twClass = `bg-gradient-to-r from-[${hex1}] to-[${hex2}]`;

  // escolher cor de texto baseada na luminância média das duas cores
  const mixed = mixRgb(rgb1, rgb2);
  const L = relativeLuminance(mixed);
  const textColor = L > 0.5 ? '#000' : '#fff';

  return {
    from: hex1,
    to: hex2,
    class: twClass,
    css,
    textColor: textColor as '#000' | '#fff',
  } as const;
}
