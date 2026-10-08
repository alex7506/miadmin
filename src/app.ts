import { field, formValues, h } from "./dom";
import { MIN_MASTER_LENGTH, Vault, VaultError } from "./vault";

/** Interfaz de la bóveda. La lógica y la seguridad viven en `Vault`; aquí solo se presentan. */
export class App {
  private message: { text: string; kind: "error" | "info" } | null = null;
  private filter = "";

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

  private unlockedView(): HTMLElement {
    return h("div", {}, this.categoriesView(), this.sitesView());
  }

  private categoriesView(): HTMLElement {
    const form = h(
      "form",
      { class: "row", onsubmit: (e) => { e.preventDefault(); const v = formValues(form); void this.run(() => void this.vault.addCategory(v.name ?? ""), "Categoría creada."); } },
      h("input", { name: "name", placeholder: "Nueva categoría (p. ej. Estudio)", required: true }),
      h("button", { type: "submit" }, "Añadir"),
    );
    const items = this.vault.listCategories().map((c) =>
      h("li", { class: "row" }, c.name, h("button", { type: "button", onclick: () => void this.run(() => this.vault.removeCategory(c.id), "Categoría eliminada.") }, "Eliminar")),
    );
    return h("section", {}, h("h2", {}, "Categorías"), form, items.length ? h("ul", {}, ...items) : h("p", {}, "Aún no hay categorías."));
  }

  private sitesView(): HTMLElement {
    const categories = this.vault.listCategories();
    if (!categories.length) return h("section", {}, h("h2", {}, "Sitios"), h("p", {}, "Crea una categoría para empezar a guardar sitios."));

    const options = () => categories.map((c) => h("option", { value: c.id }, c.name));
    const form = h(
      "form",
      {
        onsubmit: (e) => {
          e.preventDefault();
          const v = formValues(form);
          void this.run(
            () => this.vault.addSite({ name: v.name ?? "", url: v.url ?? "", description: v.description, username: v.username ?? "", password: v.password ?? "", categoryId: v.categoryId ?? "" }).then(() => undefined),
            "Sitio guardado.",
          );
        },
      },
      h("h3", {}, "Nuevo sitio"),
      field("Nombre", h("input", { name: "name", required: true })),
      field("URL", h("input", { name: "url", type: "url", placeholder: "https://", required: true })),
      field("Descripción", h("textarea", { name: "description", rows: "2" })),
      field("Usuario", h("input", { name: "username", autocomplete: "off", required: true })),
      field("Contraseña", h("input", { name: "password", type: "password", autocomplete: "new-password", required: true })),
      field("Categoría", h("select", { name: "categoryId", required: true }, ...options())),
      h("button", { type: "submit" }, "Guardar sitio"),
    );

    const filter = h("select", { onchange: (e) => { this.filter = (e.target as HTMLSelectElement).value; this.render(); } }, h("option", { value: "" }, "Todas las categorías"), ...options());
    filter.value = this.filter;
    const sites = this.vault.listSites(this.filter || undefined);
    const rows = sites.map((s) =>
      h(
        "tr",
        {},
        h("td", {}, h("strong", {}, s.name), s.description ? h("div", {}, s.description) : null),
        h("td", {}, h("a", { href: s.url, target: "_blank", rel: "noopener noreferrer" }, s.url)),
        h("td", {}, s.username),
        h("td", {}, s.categoryName),
        h("td", { class: "row" }, ...this.siteActions(s.id)),
      ),
    );
    const table = rows.length
      ? h("table", {}, h("thead", {}, h("tr", {}, ...["Sitio", "URL", "Usuario", "Categoría", ""].map((t) => h("th", {}, t)))), h("tbody", {}, ...rows))
      : h("p", {}, "No hay sitios en esta vista.");
    return h("section", {}, h("h2", {}, "Sitios"), field("Filtrar", filter), table, form);
  }

  /** Acciones por sitio; nunca se muestra la contraseña en la lista (FR-003 AC-2). */
  protected siteActions(id: string): HTMLElement[] {
    return [h("button", { type: "button", onclick: () => void this.run(() => this.vault.removeSite(id), "Sitio eliminado.") }, "Eliminar")];
  }

  private lock(): void {
    this.vault.lock();
    this.message = { text: "Bóveda bloqueada.", kind: "info" };
    this.render();
  }
}
