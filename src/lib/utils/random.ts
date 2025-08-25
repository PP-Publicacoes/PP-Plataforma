// lib/slug.ts
/** Gera slugs no formato: animal-adjetivo-XXX
 *  - XXX é derivado do userId (por hash) por padrão
 *  - opção useRawSuffix tenta extrair dígitos do userId
 */
import { adjectives } from '../consts/adjectives';
import { animals } from '../consts/animals';

// normalização para slug: remove acentos, lower-case, substitui tudo que não for alfanum por '-'
function slugify(s: string) {
  return s
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '') // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const ANIMALS = animals.map(slugify);
const ADJECTIVES = adjectives.map(slugify);

/** djb2 hash (32-bit unsigned) */
function djb2(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) + h + str.charCodeAt(i);
  }
  return h >>> 0;
}

/** converte userId -> sufixo numérico de `digits` com padStart.
 *  options.useRawSuffix: se true e userId contém dígitos, usa os últimos `digits` dígitos do userId.
 */
function idToSuffix(userId: string, digits = 3, options?: { useRawSuffix?: boolean }): string {
  const useRaw = options?.useRawSuffix ?? false;
  if (useRaw) {
    const digitsOnly = userId.replace(/\D/g, '');
    if (digitsOnly.length > 0) {
      return digitsOnly.slice(-digits).padStart(digits, '0');
    }
    // se não houver dígitos, caímos pro hash abaixo
  }
  const mod = 10 ** digits;
  const num = djb2(userId) % mod;
  return String(num).padStart(digits, '0');
}

/** índice aleatório seguro quando disponível */
function randIndex(max: number): number {
  try {
    if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
      const arr = new Uint32Array(1);
      (crypto as any).getRandomValues(arr);
      return arr[0] % max;
    }
  } catch {}
  return Math.floor(Math.random() * max);
}

/** Gera slug com animal+adjetivo aleatórios + sufixo derivado do userId */
export function generateRandomSlug(
  userId: string,
  digits = 3,
  options?: { useRawSuffix?: boolean },
): string {
  const animal = ANIMALS[randIndex(ANIMALS.length)];
  const adjective = ADJECTIVES[randIndex(ADJECTIVES.length)];
  const suffix = idToSuffix(userId, digits, options);
  return `${animal}-${adjective}-${suffix}`;
}

/** Gera slug totalmente determinístico a partir do userId (sempre igual para o mesmo id) */
export function generateDeterministicSlug(
  userId: string,
  digits = 3,
  options?: { useRawSuffix?: boolean },
): string {
  const hash = djb2(userId);
  const animal = ANIMALS[hash % ANIMALS.length];
  const adjective = ADJECTIVES[Math.floor(hash / ANIMALS.length) % ADJECTIVES.length];
  const suffix = idToSuffix(userId, digits, options);
  return `${animal}-${adjective}-${suffix}`;
}
