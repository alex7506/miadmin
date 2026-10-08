// Criptografía de la bóveda (ADR-002): PBKDF2-SHA-256 para derivar la clave y AES-GCM 256 para cifrar.
// Todo ocurre en el navegador con WebCrypto; la clave derivada no es exportable.

export const PBKDF2_ITERATIONS = 600_000;
export const SALT_BYTES = 16;
export const IV_BYTES = 12;

/** Texto cifrado con su IV, ambos en base64. */
export interface Encrypted {
  iv: string;
  data: string;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function randomBytes(length: number): Uint8Array<ArrayBuffer> {
  return crypto.getRandomValues(new Uint8Array(length));
}

export function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

export function fromBase64(text: string): Uint8Array<ArrayBuffer> {
  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function deriveKey(masterPassword: string, salt: Uint8Array<ArrayBuffer>, iterations = PBKDF2_ITERATIONS): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey("raw", encoder.encode(masterPassword), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encrypt(key: CryptoKey, plaintext: string): Promise<Encrypted> {
  const iv = randomBytes(IV_BYTES);
  const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(plaintext));
  return { iv: toBase64(iv), data: toBase64(new Uint8Array(data)) };
}

/** Descifra; lanza un error si la clave no es la correcta o los datos fueron alterados (AES-GCM los autentica). */
export async function decrypt(key: CryptoKey, encrypted: Encrypted): Promise<string> {
  const data = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromBase64(encrypted.iv) }, key, fromBase64(encrypted.data));
  return decoder.decode(data);
}
