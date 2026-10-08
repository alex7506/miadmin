import { PBKDF2_ITERATIONS, SALT_BYTES, decrypt, deriveKey, encrypt, fromBase64, randomBytes, toBase64, type Encrypted } from "./crypto";
import type { KeyValueStore } from "./storage";

export const STORAGE_KEY = "miadmin.vault.v1";
export const MIN_MASTER_LENGTH = 12;
const CHECK_VALUE = "miadmin-vault-check";

/** Error esperado de uso: su mensaje se muestra a la persona. */
export class VaultError extends Error {}

export interface Category {
  id: string;
  name: string;
}

/** Sitio tal como se guarda: la contraseña solo cifrada. */
interface StoredSite {
  id: string;
  name: string;
  url: string;
  description: string;
  username: string;
  categoryId: string;
  password: Encrypted;
}

/** Sitio tal como se muestra en listas: sin contraseña (FR-003 AC-2). */
export type SiteView = Omit<StoredSite, "password"> & { categoryName: string };

export interface NewSite {
  name: string;
  url: string;
  description?: string;
  username: string;
  password: string;
  categoryId: string;
}

/** Lo que se guarda en el almacenamiento: nunca la clave maestra ni contraseñas en claro. */
interface VaultData {
  version: 1;
  salt: string;
  iterations: number;
  check: Encrypted;
  categories: Category[];
  sites: StoredSite[];
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
    this.data = { version: 1, salt: toBase64(salt), iterations, check: await encrypt(key, CHECK_VALUE), categories: [], sites: [] };
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

  // --- Categorías (FR-002) -------------------------------------------------------

  listCategories(): Category[] {
    return [...this.requireData().categories].sort((a, b) => a.name.localeCompare(b.name, "es"));
  }

  addCategory(rawName: string): Category {
    const data = this.requireData();
    const name = rawName.trim();
    if (!name) throw new VaultError("El nombre de la categoría no puede estar vacío.");
    if (data.categories.some((c) => c.name.toLocaleLowerCase("es") === name.toLocaleLowerCase("es"))) {
      throw new VaultError(`Ya existe la categoría "${name}".`);
    }
    const category = { id: crypto.randomUUID(), name };
    data.categories.push(category);
    this.save();
    return category;
  }

  removeCategory(id: string): void {
    const data = this.requireData();
    const used = data.sites.filter((s) => s.categoryId === id).length;
    if (used) throw new VaultError(`No se puede eliminar: la categoría tiene ${used} ${used === 1 ? "sitio" : "sitios"}.`);
    data.categories = data.categories.filter((c) => c.id !== id);
    this.save();
  }

  // --- Sitios (FR-003) -----------------------------------------------------------

  /** Crea un sitio; la contraseña se cifra antes de guardarse (NFR-001). */
  async addSite(input: NewSite): Promise<string> {
    const data = this.requireData();
    const name = input.name.trim();
    const username = input.username.trim();
    if (!name) throw new VaultError("El nombre del sitio es obligatorio.");
    if (!username) throw new VaultError("El usuario es obligatorio.");
    if (!input.password) throw new VaultError("La contraseña es obligatoria.");
    const url = validUrl(input.url);
    if (!data.categories.some((c) => c.id === input.categoryId)) throw new VaultError("Elige una categoría existente.");
    const site: StoredSite = {
      id: crypto.randomUUID(),
      name,
      url,
      description: (input.description ?? "").trim(),
      username,
      categoryId: input.categoryId,
      password: await encrypt(this.requireKey(), input.password),
    };
    data.sites.push(site);
    this.save();
    return site.id;
  }

  removeSite(id: string): void {
    const data = this.requireData();
    data.sites = data.sites.filter((s) => s.id !== id);
    this.save();
  }

  /** Sitios ordenados por nombre, opcionalmente de una categoría; nunca incluyen la contraseña. */
  listSites(categoryId?: string): SiteView[] {
    const data = this.requireData();
    const names = new Map(data.categories.map((c) => [c.id, c.name]));
    return data.sites
      .filter((s) => !categoryId || s.categoryId === categoryId)
      .map(({ password: _password, ...site }) => ({ ...site, categoryName: names.get(site.categoryId) ?? "" }))
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
  }

  // --- Consultar contraseña (FR-004) ---------------------------------------------

  /** Descifra la contraseña de un sitio, solo a petición (FR-004 AC-1). */
  async revealPassword(siteId: string): Promise<string> {
    const site = this.requireData().sites.find((s) => s.id === siteId);
    if (!site) throw new VaultError("El sitio no existe.");
    return decrypt(this.requireKey(), site.password);
  }

  /** Copia la contraseña descifrada al portapapeles (FR-004 AC-2). */
  async copyPassword(siteId: string, clipboard: Pick<Clipboard, "writeText">): Promise<void> {
    await clipboard.writeText(await this.revealPassword(siteId));
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
    const data = JSON.parse(raw) as VaultData;
    data.categories ??= [];
    data.sites ??= [];
    return data;
  }

  protected save(): void {
    this.store.setItem(STORAGE_KEY, JSON.stringify(this.requireData()));
  }
}

function validUrl(raw: string): string {
  try {
    const url = new URL(raw.trim());
    if (url.protocol === "http:" || url.protocol === "https:") return url.toString();
  } catch {
    // se informa abajo
  }
  throw new VaultError("La URL debe empezar por http:// o https:// y ser válida.");
}
