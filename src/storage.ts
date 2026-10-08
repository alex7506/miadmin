/** Subconjunto de `localStorage` que usa la bóveda; permite probarla sin navegador. */
export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export class MemoryStore implements KeyValueStore {
  private readonly items = new Map<string, string>();

  getItem(key: string): string | null {
    return this.items.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.items.set(key, value);
  }

  removeItem(key: string): void {
    this.items.delete(key);
  }

  /** Todo lo almacenado, tal como lo vería quien inspeccione el almacenamiento. */
  dump(): string {
    return [...this.items.values()].join("\n");
  }
}
