export function valuesToTuple<T extends Record<string, string>>(obj: T) {
  // Object.values retorna em runtime; o cast garante o tipo exigido pelo Drizzle.
  return Object.values(obj) as unknown as readonly [T[keyof T], ...T[keyof T][]];
  // return Object.values(obj);
}
