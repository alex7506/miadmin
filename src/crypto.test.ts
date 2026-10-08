import { describe, expect, it } from "vitest";
import { IV_BYTES, PBKDF2_ITERATIONS, SALT_BYTES, decrypt, deriveKey, encrypt, fromBase64, randomBytes } from "./crypto";

// NFR-001 AC-1
describe("crypto", () => {
  const salt = randomBytes(SALT_BYTES);

  it("usa los parámetros exigidos por NFR-001", () => {
    expect(PBKDF2_ITERATIONS).toBeGreaterThanOrEqual(600_000);
    expect(SALT_BYTES).toBe(16);
    expect(IV_BYTES).toBe(12);
  });

  it("deriva una clave AES-GCM de 256 bits no exportable", async () => {
    const key = await deriveKey("clave-ficticia-123", salt, 1000);
    expect(key.algorithm).toMatchObject({ name: "AES-GCM", length: 256 });
    expect(key.extractable).toBe(false);
  });

  it("cifra y descifra; cada cifrado usa un IV distinto de 12 bytes", async () => {
    const key = await deriveKey("clave-ficticia-123", salt, 1000);
    const a = await encrypt(key, "contraseña-ficticia");
    const b = await encrypt(key, "contraseña-ficticia");
    expect(fromBase64(a.iv)).toHaveLength(12);
    expect(a.iv).not.toBe(b.iv);
    expect(a.data).not.toBe(b.data);
    expect(a.data).not.toContain("contraseña");
    expect(await decrypt(key, a)).toBe("contraseña-ficticia");
  });

  it("una clave distinta no descifra", async () => {
    const good = await deriveKey("clave-ficticia-123", salt, 1000);
    const bad = await deriveKey("otra-clave-ficticia", salt, 1000);
    await expect(decrypt(bad, await encrypt(good, "secreto"))).rejects.toThrow();
  });
});
