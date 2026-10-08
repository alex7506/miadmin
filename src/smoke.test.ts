import { describe, expect, it } from "vitest";

describe("entorno de pruebas", () => {
  it("dispone de WebCrypto", () => {
    expect(globalThis.crypto?.subtle).toBeDefined();
  });
});
