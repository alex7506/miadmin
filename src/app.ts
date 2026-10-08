import { field, formValues, h } from "./dom";
import { MIN_MASTER_LENGTH, Vault, VaultError } from "./vault";

/** Interfaz de la bóveda. La lógica y la seguridad viven en `Vault`; aquí solo se presentan. */
export class App {
  private message: { text: string; kind: "error" | "info" } | null = null;

  constructor(
    private readonly root: HTMLElement,
    private readonly vault: Vault,
  ) {}

  render(): void {
    const view = !this.vault.exists() ? this.createView() : !this.vault.unlocked ? this.unlockView() : this.unlockedView();
    const message = this.message ? h("p", { class: `message ${this.message.kind}`, role: this.message.kind === "error" ? "alert" : "status" }, this.message.text) : null;
    this.root.replaceChildren(
      ...[h("header", {}, h("h1", {}, "MiAdmin"), this.vault.unlocked ? h("button", { type: "button", onclick: () => this.lock() }, "Bloquear") : null), message, view].filter(
        (node): node is HTMLElement => node !== null,
      ),
    );
  }

  /** Ejecuta una acción y muestra su error de uso, si lo hay, sin perder el estado. */
  protected async run(action: () => Promise<void> | void, success?: string): Promise<void> {
    try {
      await action();
      this.message = success ? { text: success, kind: "info" } : null;
    } catch (e) {
      if (!(e instanceof VaultError)) throw e;
      this.message = { text: e.message, kind: "error" };
    }
    this.render();
  }

  private createView(): HTMLElement {
    const form = h(
      "form",
      { onsubmit: (e) => { e.preventDefault(); const v = formValues(form); void this.run(() => this.vault.create(v.master ?? "", v.confirmation ?? ""), "Bóveda creada."); } },
      h("h2", {}, "Crea tu clave maestra"),
      h("p", {}, `Al menos ${MIN_MASTER_LENGTH} caracteres. No se puede recuperar: si la olvidas, perderás el contenido.`),
      field("Clave maestra", h("input", { name: "master", type: "password", autocomplete: "new-password", required: true })),
      field("Repite la clave", h("input", { name: "confirmation", type: "password", autocomplete: "new-password", required: true })),
      h("button", { type: "submit" }, "Crear bóveda"),
    );
    return form;
  }

  private unlockView(): HTMLElement {
    const form = h(
      "form",
      { onsubmit: (e) => { e.preventDefault(); const v = formValues(form); void this.run(() => this.vault.unlock(v.master ?? "")); } },
      h("h2", {}, "Desbloquea tu bóveda"),
      field("Clave maestra", h("input", { name: "master", type: "password", autocomplete: "current-password", required: true })),
      h("button", { type: "submit" }, "Desbloquear"),
    );
    return form;
  }

  /** Contenido de la bóveda desbloqueada; lo amplían las tareas de categorías y sitios. */
  protected unlockedView(): HTMLElement {
    return h("section", {}, h("p", {}, "Bóveda desbloqueada."));
  }

  private lock(): void {
    this.vault.lock();
    this.message = { text: "Bóveda bloqueada.", kind: "info" };
    this.render();
  }
}
