import { field, formValues, h, icon, type IconName } from "./dom";
import { MIN_MASTER_LENGTH, Vault, VaultError, type SiteView } from "./vault";

type Message = { text: string; kind: "error" | "info" };

/** Interfaz de la bóveda. La lógica y la seguridad viven en `Vault`; aquí solo se presentan. */
export class App {
  private message: Message | null = null;
  private messageTimer: number | undefined;
  /** Categoría seleccionada; vacía = todas (FR-003 AC-2). */
  private filter = "";
  /** Contraseñas mostradas a petición; se descartan al bloquear. */
  private readonly revealed = new Map<string, string>();

  constructor(
    private readonly root: HTMLElement,
    private readonly vault: Vault,
  ) {}

  render(): void {
    const view = !this.vault.exists() ? this.createView() : !this.vault.unlocked ? this.unlockView() : this.unlockedView();
    this.root.replaceChildren(view, this.toast());
  }

  /** Ejecuta una acción y muestra su error de uso, si lo hay, sin perder el estado. */
  protected async run(action: () => Promise<void> | void, success?: string): Promise<void> {
    try {
      await action();
      this.notify(success ? { text: success, kind: "info" } : null);
    } catch (e) {
      if (!(e instanceof VaultError)) throw e;
      this.notify({ text: e.message, kind: "error" });
    }
    this.render();
  }

  private notify(message: Message | null): void {
    this.message = message;
    window.clearTimeout(this.messageTimer);
    if (message?.kind === "info") {
      this.messageTimer = window.setTimeout(() => {
        this.message = null;
        this.root.querySelector(".toast")?.remove();
      }, 3200);
    }
  }

  private toast(): HTMLElement | string {
    if (!this.message) return "";
    const { text, kind } = this.message;
    return h(
      "div",
      { class: `toast toast-${kind}`, role: kind === "error" ? "alert" : "status" },
      icon(kind === "error" ? "alert" : "check"),
      h("span", {}, text),
      h("button", { type: "button", class: "icon-button", "aria-label": "Cerrar aviso", onclick: () => { this.notify(null); this.render(); } }, icon("x", 16)),
    );
  }

  // --- Acceso ------------------------------------------------------------------

  private authLayout(iconName: IconName, title: string, subtitle: string, form: HTMLFormElement, note?: string): HTMLElement {
    return h(
      "main",
      { class: "auth" },
      h(
        "section",
        { class: "auth-card" },
        h("div", { class: "brand brand-lg" }, h("span", { class: "brand-mark" }, icon("shield", 26)), h("span", { class: "brand-name" }, "MiAdmin")),
        h("div", { class: "auth-icon" }, icon(iconName, 22)),
        h("h1", {}, title),
        h("p", { class: "muted" }, subtitle),
        form,
        note ? h("p", { class: "auth-note" }, icon("alert", 16), note) : null,
      ),
      h("p", { class: "auth-footer" }, "Cifrado en tu navegador con AES-GCM 256. Tu clave maestra nunca se guarda."),
    );
  }

  private createView(): HTMLElement {
    const form = h(
      "form",
      { class: "stack", onsubmit: (e) => { e.preventDefault(); const v = formValues(form); void this.run(() => this.vault.create(v.master ?? "", v.confirmation ?? ""), "Bóveda creada."); } },
      field("Clave maestra", h("input", { name: "master", type: "password", autocomplete: "new-password", required: true, autofocus: true }), `Al menos ${MIN_MASTER_LENGTH} caracteres.`),
      field("Repite la clave", h("input", { name: "confirmation", type: "password", autocomplete: "new-password", required: true })),
      h("button", { type: "submit", class: "button button-primary button-block" }, icon("key"), "Crear bóveda"),
    );
    return this.authLayout("key", "Crea tu bóveda", "Guarda tus accesos a sitios web en un solo lugar, cifrados con una clave que solo tú conoces.", form, "La clave maestra no se puede recuperar: si la olvidas, perderás el contenido.");
  }

  private unlockView(): HTMLElement {
    const form = h(
      "form",
      { class: "stack", onsubmit: (e) => { e.preventDefault(); const v = formValues(form); void this.run(() => this.vault.unlock(v.master ?? "")); } },
      field("Clave maestra", h("input", { name: "master", type: "password", autocomplete: "current-password", required: true, autofocus: true })),
      h("button", { type: "submit", class: "button button-primary button-block" }, icon("lock"), "Desbloquear"),
    );
    return this.authLayout("lock", "Bienvenido de nuevo", "Introduce tu clave maestra para desbloquear tu bóveda.", form);
  }

  // --- Bóveda desbloqueada -----------------------------------------------------------

  private unlockedView(): HTMLElement {
    const categories = this.vault.listCategories();
    if (this.filter && !categories.some((c) => c.id === this.filter)) this.filter = "";
    return h(
      "div",
      { class: "shell" },
      h(
        "header",
        { class: "topbar" },
        h("div", { class: "brand" }, h("span", { class: "brand-mark" }, icon("shield", 20)), h("span", { class: "brand-name" }, "MiAdmin")),
        h("button", { type: "button", class: "button button-ghost", onclick: () => this.lock() }, icon("lock"), "Bloquear"),
      ),
      h("div", { class: "layout" }, this.sidebar(), this.content()),
      this.siteDialog(),
    );
  }

  private sidebar(): HTMLElement {
    const categories = this.vault.listCategories();
    const all = this.vault.listSites();
    const count = (id: string) => all.filter((s) => s.categoryId === id).length;
    const item = (id: string, label: string, n: number, iconName: IconName, removable: boolean) =>
      h(
        "li",
        { class: `nav-item${this.filter === id ? " is-active" : ""}` },
        h(
          "button",
          { type: "button", class: "nav-link", "aria-current": this.filter === id ? "true" : "false", onclick: () => { this.filter = id; this.render(); } },
          icon(iconName, 17),
          h("span", { class: "nav-label" }, label),
          h("span", { class: "badge" }, String(n)),
        ),
        removable
          ? h("button", { type: "button", class: "icon-button nav-remove", "aria-label": `Eliminar categoría ${label}`, title: "Eliminar categoría", onclick: () => void this.run(() => this.vault.removeCategory(id), "Categoría eliminada.") }, icon("trash", 15))
          : null,
      );

    const form = h(
      "form",
      { class: "add-category", onsubmit: (e) => { e.preventDefault(); const v = formValues(form); void this.run(() => void this.vault.addCategory(v.name ?? ""), "Categoría creada."); } },
      h("input", { name: "name", placeholder: "Nueva categoría", "aria-label": "Nombre de la nueva categoría", required: true }),
      h("button", { type: "submit", class: "icon-button icon-button-filled", "aria-label": "Añadir categoría", title: "Añadir categoría" }, icon("plus", 17)),
    );

    return h(
      "aside",
      { class: "sidebar", "aria-label": "Categorías" },
      h("p", { class: "sidebar-title" }, "Categorías"),
      h("ul", { class: "nav" }, item("", "Todos los sitios", all.length, "layers", false), ...categories.map((c) => item(c.id, c.name, count(c.id), "folder", true))),
      form,
    );
  }

  private content(): HTMLElement {
    const categories = this.vault.listCategories();
    const current = categories.find((c) => c.id === this.filter);
    const sites = this.vault.listSites(this.filter || undefined);
    const canAdd = categories.length > 0;

    const header = h(
      "div",
      { class: "content-header" },
      h("div", {}, h("h1", {}, current?.name ?? "Todos los sitios"), h("p", { class: "muted" }, sites.length === 1 ? "1 sitio" : `${sites.length} sitios`)),
      h("button", { type: "button", class: "button button-primary", disabled: !canAdd, title: canAdd ? "" : "Crea antes una categoría", onclick: () => this.root.querySelector<HTMLDialogElement>("#site-dialog")?.showModal() }, icon("plus"), "Nuevo sitio"),
    );

    let body: HTMLElement;
    if (!canAdd) body = this.empty("folder", "Empieza creando una categoría", "Organiza tus sitios por temas, por ejemplo Estudio, Administrativo o Correos electrónicos. Usa el campo «Nueva categoría».");
    else if (!sites.length) body = this.empty("key", "Aún no hay sitios aquí", "Guarda tu primer acceso con «Nuevo sitio». La contraseña se cifra antes de guardarse.");
    else body = h("div", { class: "grid" }, ...sites.map((s) => this.siteCard(s)));

    return h("main", { class: "content" }, header, body);
  }

  private empty(iconName: IconName, title: string, text: string): HTMLElement {
    return h("div", { class: "empty" }, h("div", { class: "empty-icon" }, icon(iconName, 26)), h("h2", {}, title), h("p", { class: "muted" }, text));
  }

  /** Tarjeta de un sitio. La contraseña solo se muestra a petición (FR-004) y nunca por defecto (FR-003 AC-2). */
  private siteCard(site: SiteView): HTMLElement {
    const shown = this.revealed.get(site.id);
    const host = hostOf(site.url);
    return h(
      "article",
      { class: "card" },
      h(
        "div",
        { class: "card-head" },
        h("span", { class: "avatar", style: `--hue: ${hueOf(site.name)}`, "aria-hidden": "true" }, site.name.trim().charAt(0).toUpperCase()),
        h("div", { class: "card-title" }, h("h3", {}, site.name), h("a", { href: site.url, target: "_blank", rel: "noopener noreferrer", class: "card-link" }, h("span", { class: "card-host" }, host), icon("external", 13))),
        h("span", { class: "chip" }, site.categoryName),
      ),
      site.description ? h("p", { class: "card-desc" }, site.description) : null,
      h(
        "dl",
        { class: "card-fields" },
        h("div", { class: "card-field" }, h("dt", {}, icon("user", 15), "Usuario"), h("dd", {}, site.username)),
        h(
          "div",
          { class: "card-field" },
          h("dt", {}, icon("key", 15), "Contraseña"),
          h(
            "dd",
            { class: "secret" },
            shown !== undefined ? h("span", { class: "secret-value" }, shown) : h("span", { class: "secret-mask", "aria-label": "Contraseña oculta" }, "••••••••••"),
            h(
              "span",
              { class: "secret-actions" },
              h(
                "button",
                {
                  type: "button",
                  class: "icon-button",
                  "aria-label": shown !== undefined ? `Ocultar contraseña de ${site.name}` : `Ver contraseña de ${site.name}`,
                  title: shown !== undefined ? "Ocultar" : "Ver",
                  onclick: () =>
                    void this.run(async () => {
                      if (this.revealed.has(site.id)) this.revealed.delete(site.id);
                      else this.revealed.set(site.id, await this.vault.revealPassword(site.id));
                    }),
                },
                icon(shown !== undefined ? "eyeOff" : "eye", 17),
              ),
              h("button", { type: "button", class: "icon-button", "aria-label": `Copiar contraseña de ${site.name}`, title: "Copiar", onclick: () => void this.run(() => this.vault.copyPassword(site.id, navigator.clipboard), "Contraseña copiada.") }, icon("copy", 17)),
            ),
          ),
        ),
      ),
      h(
        "div",
        { class: "card-foot" },
        h("button", { type: "button", class: "button button-danger-ghost button-sm", onclick: () => void this.run(() => { this.revealed.delete(site.id); this.vault.removeSite(site.id); }, "Sitio eliminado.") }, icon("trash", 15), "Eliminar"),
      ),
    );
  }

  private siteDialog(): HTMLElement {
    const categories = this.vault.listCategories();
    const dialog = h("dialog", { id: "site-dialog", class: "dialog", "aria-labelledby": "site-dialog-title" }) as HTMLDialogElement;
    const close = () => dialog.close();
    const select = h("select", { name: "categoryId", required: true }, ...categories.map((c) => h("option", { value: c.id }, c.name)));
    if (this.filter) select.value = this.filter;
    const form = h(
      "form",
      {
        class: "dialog-form",
        onsubmit: (e) => {
          e.preventDefault();
          const v = formValues(form);
          void this.run(
            () => this.vault.addSite({ name: v.name ?? "", url: v.url ?? "", description: v.description, username: v.username ?? "", password: v.password ?? "", categoryId: v.categoryId ?? "" }).then(() => undefined),
            "Sitio guardado.",
          );
        },
      },
      h("div", { class: "dialog-head" }, h("h2", { id: "site-dialog-title" }, "Nuevo sitio"), h("button", { type: "button", class: "icon-button", "aria-label": "Cerrar", onclick: close }, icon("x"))),
      h(
        "div",
        { class: "form-grid" },
        field("Nombre", h("input", { name: "name", placeholder: "Campus virtual", required: true })),
        field("Categoría", select),
        h("div", { class: "span-2" }, field("URL", h("input", { name: "url", type: "url", placeholder: "https://", required: true }))),
        field("Usuario", h("input", { name: "username", autocomplete: "off", required: true })),
        field("Contraseña", h("input", { name: "password", type: "password", autocomplete: "new-password", required: true }), "Se cifra antes de guardarse."),
        h("div", { class: "span-2" }, field("Descripción", h("textarea", { name: "description", rows: "2", placeholder: "Opcional" }))),
      ),
      h("div", { class: "dialog-actions" }, h("button", { type: "button", class: "button button-ghost", onclick: close }, "Cancelar"), h("button", { type: "submit", class: "button button-primary" }, icon("check"), "Guardar sitio")),
    );
    dialog.append(form);
    return dialog;
  }

  private lock(): void {
    this.vault.lock();
    this.revealed.clear();
    this.notify({ text: "Bóveda bloqueada.", kind: "info" });
    this.render();
  }
}

function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Tono estable a partir del nombre, para el avatar de cada sitio. */
function hueOf(text: string): number {
  let hash = 0;
  for (const ch of text) hash = (hash * 31 + ch.charCodeAt(0)) % 360;
  return hash;
}
