type Attrs = Record<string, string | boolean | ((event: Event) => void)>;

/** Crea un elemento con atributos, manejadores (`on*`) e hijos. El texto se inserta siempre como texto, nunca como HTML. */
export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Attrs = {}, ...children: (Node | string | null)[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) {
    if (typeof value === "function") el.addEventListener(name.slice(2).toLowerCase(), value);
    else if (typeof value === "boolean") el.toggleAttribute(name, value);
    else el.setAttribute(name, value);
  }
  for (const child of children) if (child !== null) el.append(child);
  return el;
}

export function field(label: string, input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): HTMLLabelElement {
  return h("label", {}, h("span", {}, label), input);
}

export function formValues(form: HTMLFormElement): Record<string, string> {
  return Object.fromEntries([...new FormData(form).entries()].map(([k, v]) => [k, String(v)]));
}
