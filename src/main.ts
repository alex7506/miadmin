import { App } from "./app";
import "./style.css";
import { Vault } from "./vault";

const root = document.querySelector<HTMLElement>("#app");
if (root) new App(root, new Vault(window.localStorage)).render();
