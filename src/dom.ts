type Attrs = Record<string, string | boolean | ((event: Event) => void)>;
type Child = Node | string | null | false;

/** Crea un elemento con atributos, manejadores (`on*`) e hijos. El texto se inserta siempre como texto, nunca como HTML. */
export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Attrs = {}, ...children: Child[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) {
    if (typeof value === "function") el.addEventListener(name.slice(2).toLowerCase(), value);
    else if (typeof value === "boolean") el.toggleAttribute(name, value);
    else el.setAttribute(name, value);
  }
  for (const child of children) if (child !== null && child !== false) el.append(child);
  return el;
}

export function field(label: string, input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, hint?: string): HTMLLabelElement {
  return h("label", { class: "field" }, h("span", { class: "field-label" }, label), input, hint ? h("span", { class: "field-hint" }, hint) : null);
}

export function formValues(form: HTMLFormElement): Record<string, string> {
  return Object.fromEntries([...new FormData(form).entries()].map(([k, v]) => [k, String(v)]));
}

const SVG_NS = "http://www.w3.org/2000/svg";

/** Trazos de iconos de 24×24 (estilo lineal). */
const ICONS = {
  shield: ["M12 3 4.5 6v5.5c0 4.6 3.2 8.6 7.5 9.5 4.3-.9 7.5-4.9 7.5-9.5V6L12 3Z", "m9 12 2 2 4-4"],
  lock: ["M7 11V8a5 5 0 0 1 10 0v3", "M5.5 11h13a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5v-7A1.5 1.5 0 0 1 5.5 11Z"],
  key: ["M15.5 7.5a3.5 3.5 0 1 1-3.4 4.3L4 20H2v-2l1.5-1.5H5V15h1.5l2.2-2.2A3.5 3.5 0 0 1 15.5 7.5Z", "M16.5 10.5h.01"],
  plus: ["M12 5v14", "M5 12h14"],
  layers: ["m12 3 9 5-9 5-9-5 9-5Z", "m3 13 9 5 9-5"],
  folder: ["M3.5 6.5A1.5 1.5 0 0 1 5 5h4l2 2.5h8A1.5 1.5 0 0 1 20.5 9v9a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18V6.5Z"],
  trash: ["M4 7h16", "M9.5 7V4.5h5V7", "M6 7l1 12.5h10L18 7", "M10 11v5", "M14 11v5"],
  eye: ["M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z", "M12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"],
  eyeOff: ["M3 3l18 18", "M10.6 6.1A9.8 9.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3 3.7", "M6.6 6.7A16.6 16.6 0 0 0 2.5 12S6 18 12 18a9.4 9.4 0 0 0 4.5-1.1", "M9.9 9.9a2.5 2.5 0 0 0 3.5 3.5"],
  copy: ["M9 9h10.5v10.5H9z", "M15 9V4.5H4.5V15H9"],
  external: ["M14 4.5h5.5V10", "M19.5 4.5 11 13", "M17 14v5.5H4.5V7H10"],
  user: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M4.5 20.5a7.5 7.5 0 0 1 15 0"],
  x: ["M6 6l12 12", "M18 6 6 18"],
  check: ["m5 12.5 4.5 4.5L19 7.5"],
  alert: ["M12 8v5", "M12 16.5h.01", "M10.3 3.9 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"],
} as const;

export type IconName = keyof typeof ICONS;

/** Icono SVG decorativo (oculto a lectores de pantalla: el texto o la etiqueta del control lo describen). */
export function icon(name: IconName, size = 18): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  for (const [k, v] of Object.entries({ viewBox: "0 0 24 24", width: String(size), height: String(size), fill: "none", stroke: "currentColor", "stroke-width": "1.8", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true", class: "icon" })) {
    svg.setAttribute(k, v);
  }
  for (const d of ICONS[name]) {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    svg.append(path);
  }
  return svg;
}
