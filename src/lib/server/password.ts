// src/lib/server/password.ts
import { Scrypt } from "oslo/password";

const scrypt = new Scrypt();

export async function hashPassword(password: string): Promise<string> {
  return await scrypt.hash(password);
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return await scrypt.verify(hash, password);
}
