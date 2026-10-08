import { describe, expect, it } from "vitest";
import { PBKDF2_ITERATIONS } from "./crypto";
import { MemoryStore } from "./storage";
import { STORAGE_KEY, Vault, VaultError } from "./vault";

// Solo credenciales ficticias (política local_fake_credentials_only).
const MASTER = "clave-maestra-ficticia";
const fast = (store = new MemoryStore()) => new Vault(store, { iterations: 1000 });

describe("clave maestra (FR-001)", () => {
  it("AC-1: exige al menos 12 caracteres y que las dos coincidan", async () => {
    const vault = fast();
    await expect(vault.create("corta", "corta")).rejects.toThrow(VaultError);
    await expect(vault.create(MASTER, `${MASTER}x`)).rejects.toThrow("no coinciden");
    expect(vault.exists()).toBe(false);
    await vault.create(MASTER, MASTER);
    expect(vault.exists()).toBe(true);
    expect(vault.unlocked).toBe(true);
  });

  it("AC-1: no permite crear una segunda bóveda", async () => {
    const store = new MemoryStore();
    await fast(store).create(MASTER, MASTER);
    await expect(fast(store).create(MASTER, MASTER)).rejects.toThrow("Ya existe");
  });

  it("AC-2: desbloquea con la clave correcta y rechaza una incorrecta", async () => {
    const store = new MemoryStore();
    await fast(store).create(MASTER, MASTER);
    const vault = fast(store);
    await expect(vault.unlock("clave-equivocada-123")).rejects.toThrow("Clave maestra incorrecta");
    expect(vault.unlocked).toBe(false);
    await vault.unlock(MASTER);
    expect(vault.unlocked).toBe(true);
  });

  it("AC-3: bloquear descarta la clave y exige desbloquear de nuevo", async () => {
    const store = new MemoryStore();
    const vault = fast(store);
    await vault.create(MASTER, MASTER);
    vault.lock();
    expect(vault.unlocked).toBe(false);
    await vault.unlock(MASTER);
    expect(vault.unlocked).toBe(true);
  });
});

describe("almacenamiento (NFR-001)", () => {
  it("guarda sal de 16 bytes y 600 000 iteraciones por defecto, y nunca la clave maestra", async () => {
    const store = new MemoryStore();
    await new Vault(store).create(MASTER, MASTER);
    const saved = JSON.parse(store.getItem(STORAGE_KEY)!);
    expect(saved.iterations).toBe(PBKDF2_ITERATIONS);
    expect(atob(saved.salt)).toHaveLength(16);
    expect(store.dump()).not.toContain(MASTER);
  });
});

async function unlockedVault(store = new MemoryStore()) {
  const vault = fast(store);
  await vault.create(MASTER, MASTER);
  return vault;
}

const site = (categoryId: string, overrides: Record<string, string> = {}) => ({
  name: "Campus virtual",
  url: "https://campus.example.edu",
  description: "Plataforma de estudio",
  username: "usuario.ficticio",
  password: "contraseña-ficticia-1",
  categoryId,
  ...overrides,
});

describe("categorías (FR-002)", () => {
  it("AC-1: crea categorías con nombre no vacío y no repetido", async () => {
    const vault = await unlockedVault();
    vault.addCategory("Estudio");
    vault.addCategory("  Administrativo ");
    expect(() => vault.addCategory("   ")).toThrow("vacío");
    expect(() => vault.addCategory("estudio")).toThrow("Ya existe");
    expect(vault.listCategories().map((c) => c.name)).toEqual(["Administrativo", "Estudio"]);
  });

  it("AC-2: elimina una categoría sin sitios e impide eliminar una con sitios", async () => {
    const vault = await unlockedVault();
    const empty = vault.addCategory("Correos electrónicos");
    const used = vault.addCategory("Estudio");
    await vault.addSite(site(used.id));
    expect(() => vault.removeCategory(used.id)).toThrow("tiene 1 sitio");
    vault.removeCategory(empty.id);
    expect(vault.listCategories().map((c) => c.name)).toEqual(["Estudio"]);
  });
});

describe("sitios (FR-003)", () => {
  it("AC-1: crea un sitio válido y rechaza campos vacíos, URL inválida o categoría inexistente", async () => {
    const vault = await unlockedVault();
    const cat = vault.addCategory("Estudio");
    await expect(vault.addSite(site(cat.id, { name: " " }))).rejects.toThrow("nombre");
    await expect(vault.addSite(site(cat.id, { username: "" }))).rejects.toThrow("usuario");
    await expect(vault.addSite(site(cat.id, { password: "" }))).rejects.toThrow("contraseña");
    await expect(vault.addSite(site(cat.id, { url: "ftp://x.example" }))).rejects.toThrow("URL");
    await expect(vault.addSite(site(cat.id, { url: "no es url" }))).rejects.toThrow("URL");
    await expect(vault.addSite(site("otra"))).rejects.toThrow("categoría");
    await vault.addSite(site(cat.id));
    expect(vault.listSites()).toHaveLength(1);
  });

  it("AC-2: lista y filtra por categoría sin exponer contraseñas", async () => {
    const vault = await unlockedVault();
    const study = vault.addCategory("Estudio");
    const mail = vault.addCategory("Correos electrónicos");
    await vault.addSite(site(study.id));
    await vault.addSite(site(mail.id, { name: "Correo personal", url: "https://mail.example.com" }));
    const all = vault.listSites();
    expect(all.map((s) => s.name)).toEqual(["Campus virtual", "Correo personal"]);
    expect(all[0]).toMatchObject({ url: "https://campus.example.edu/", username: "usuario.ficticio", categoryName: "Estudio" });
    expect(all.every((s) => !("password" in s))).toBe(true);
    expect(vault.listSites(mail.id).map((s) => s.name)).toEqual(["Correo personal"]);
  });

  it("AC-3: elimina un sitio", async () => {
    const vault = await unlockedVault();
    const cat = vault.addCategory("Estudio");
    const id = await vault.addSite(site(cat.id));
    vault.removeSite(id);
    expect(vault.listSites()).toEqual([]);
  });

  it("los datos persisten y se recuperan al desbloquear de nuevo", async () => {
    const store = new MemoryStore();
    const vault = await unlockedVault(store);
    const cat = vault.addCategory("Estudio");
    await vault.addSite(site(cat.id));
    vault.lock();
    expect(() => vault.listSites()).toThrow("bloqueada");
    await vault.unlock(MASTER);
    expect(vault.listSites().map((s) => s.name)).toEqual(["Campus virtual"]);
  });
});

describe("NFR-001 AC-2: nada sensible en claro en el almacenamiento", () => {
  it("el almacenamiento no contiene contraseñas de sitios ni la clave maestra", async () => {
    const store = new MemoryStore();
    const vault = await unlockedVault(store);
    const cat = vault.addCategory("Estudio");
    await vault.addSite(site(cat.id, { password: "Contraseña-Ficticia-Única-987" }));
    const raw = store.dump();
    expect(raw).not.toContain("Contraseña-Ficticia-Única-987");
    expect(raw).not.toContain(MASTER);
    const saved = JSON.parse(store.getItem(STORAGE_KEY)!);
    expect(saved.sites[0].password).toEqual({ iv: expect.any(String), data: expect.any(String) });
  });
});
