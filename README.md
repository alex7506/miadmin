# MiAdmin

Bóveda personal de accesos a sitios web que funciona íntegramente en el navegador: las contraseñas se cifran con tu clave maestra (PBKDF2 + AES-GCM, WebCrypto) y nunca se guardan en claro.

![Bóveda en modo claro](docs/capturas/boveda-claro.png)

| Modo oscuro | Móvil |
|---|---|
| ![Bóveda en modo oscuro](docs/capturas/boveda-oscuro.png) | ![Bóveda en móvil](docs/capturas/boveda-movil.png) |

Es el proyecto piloto con el que se validó la metodología [Software AI Development](https://github.com/alex7506/software-ai-development) y su herramienta `ai-dev`. El [tutorial del manual](https://alex7506.github.io/software-ai-development/tutorial/primer-proyecto) recorre paso a paso cómo se construyó.

## Uso
```bash
npm ci
npm run dev        # desarrollo
npm run build && npm run preview
```

## Calidad
```bash
npm run typecheck && npm test && npm audit --audit-level=high
ai-dev validate && ai-dev trace --git
```

Documentación del proyecto (requisitos, arquitectura, decisiones, tareas, validación y release): `docs/`. Estado: `ai-dev status`.

## Licencia
Licencia de uso: puedes usar MiAdmin y estudiarlo como ejemplo, también con fines comerciales, y adaptarlo para uso interno; no se permite distribuir versiones modificadas. Texto completo en [LICENSE](LICENSE).

© 2026 Ing. Alexander Patiño Londoño.
