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
