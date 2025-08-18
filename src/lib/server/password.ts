import bcrypt from "bcryptjs";

// custo padrão; ajuste se precisar (10–12 é comum no edge)
const ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  // a versão "async" do bcryptjs não usa .node; é compatível com Workers
  return await bcrypt.hash(password, ROUNDS);
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
