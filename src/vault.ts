import { PBKDF2_ITERATIONS, SALT_BYTES, decrypt, deriveKey, encrypt, fromBase64, randomBytes, toBase64, type Encrypted } from "./crypto";
import type { KeyValueStore } from "./storage";

export const STORAGE_KEY = "miadmin.vault.v1";
export const MIN_MASTER_LENGTH = 12;
const CHECK_VALUE = "miadmin-vault-check";

/** Error esperado de uso: su mensaje se muestra a la persona. */
export class VaultError extends Error {}

/** Lo que se guarda en el almacenamiento: nunca la clave maestra ni contraseñas en claro. */
interface VaultData {
  version: 1;
  salt: string;
  iterations: number;
  check: Encrypted;
}

export interface VaultOptions {
  /** Solo para pruebas: menos iteraciones aceleran la derivación. Por defecto, PBKDF2_ITERATIONS. */
  iterations?: number;
}

export class Vault {
  private key: CryptoKey | null = null;
  private data: VaultData | null = null;

  constructor(
    private readonly store: KeyValueStore,
    private readonly options: VaultOptions = {},
  ) {}

  /** ¿Existe una bóveda creada en este almacenamiento? */
  exists(): boolean {
    return this.store.getItem(STORAGE_KEY) !== null;
  }

  get unlocked(): boolean {
    return this.key !== null;
  }

  /** Crea la bóveda con una clave maestra nueva (FR-001 AC-1) y la deja desbloqueada. */
  async create(master: string, confirmation: string): Promise<void> {
    if (this.exists()) throw new VaultError("Ya existe una bóveda en este navegador.");
    if (master.length < MIN_MASTER_LENGTH) throw new VaultError(`La clave maestra debe tener al menos ${MIN_MASTER_LENGTH} caracteres.`);
    if (master !== confirmation) throw new VaultError("Las dos claves no coinciden.");
    const salt = randomBytes(SALT_BYTES);
    const iterations = this.options.iterations ?? PBKDF2_ITERATIONS;
    const key = await deriveKey(master, salt, iterations);
    this.data = { version: 1, salt: toBase64(salt), iterations, check: await encrypt(key, CHECK_VALUE) };
    this.key = key;
    this.save();
  }

  /** Desbloquea con la clave maestra (FR-001 AC-2). Con una clave incorrecta no descifra nada. */
  async unlock(master: string): Promise<void> {
    const data = this.load();
    const key = await deriveKey(master, fromBase64(data.salt), data.iterations);
    try {
      if ((await decrypt(key, data.check)) !== CHECK_VALUE) throw new Error("check");
    } catch {
      throw new VaultError("Clave maestra incorrecta.");
    }
    this.data = data;
    this.key = key;
  }

  /** Bloquea la bóveda: descarta la clave y los datos de memoria (FR-001 AC-3). */
  lock(): void {
    this.key = null;
    this.data = null;
  }

  protected requireKey(): CryptoKey {
    if (!this.key) throw new VaultError("La bóveda está bloqueada.");
    return this.key;
  }

  protected requireData(): VaultData {
    if (!this.data) throw new VaultError("La bóveda está bloqueada.");
    return this.data;
  }

  private load(): VaultData {
    const raw = this.store.getItem(STORAGE_KEY);
    if (!raw) throw new VaultError("No hay ninguna bóveda creada.");
    return JSON.parse(raw) as VaultData;
  }

  protected save(): void {
    this.store.setItem(STORAGE_KEY, JSON.stringify(this.requireData()));
  }
}
