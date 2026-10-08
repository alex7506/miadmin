# AI-CONTEXT — MiAdmin

<!-- Resumen vivo para agentes. Máximo catalog/limits.yaml#max_ai_context_md_lines líneas.
     No duplica documentos: los referencia. Se actualiza al cerrar tareas que cambien su contenido. -->

## Propósito
Piloto mínimo para validar la metodología y `ai-dev`: bóveda personal de accesos a sitios web que funciona solo en el navegador, con contraseñas cifradas mediante una clave maestra (WebCrypto).

## Estado
- Fase y estado: ver `.ai-dev/state.yaml`
- Modo de rigor: LITE

## Stack aprobado
Vite 8 + TypeScript 5.7 + Vitest 5, sin backend ni framework de interfaz (ADR-001). Cifrado PBKDF2-SHA-256 + AES-GCM con WebCrypto (ADR-002). Código: `src/crypto.ts` (criptografía), `src/vault.ts` (reglas y almacenamiento cifrado), `src/app.ts` (interfaz).

## Alcance
Ver `docs/01-product/PRD-001-boveda-de-sitios.md` y `docs/01-product/requirements.yaml`.

## Fuera de alcance
- Multi-tenant, superadministrador, suscripciones, backend, tema, subdominios y despliegue público (visión completa, proyecto posterior).
- Recuperación de la clave maestra.

## Fuentes de verdad
| Tema | Documento |
|---|---|
| Requisitos | `docs/01-product/requirements.yaml` |
| Arquitectura | `docs/03-architecture/` |
| Decisiones | `docs/08-decisions/adr/` |
| Tareas | `docs/06-execution/tasks/` |

## Reglas
- No añadir funcionalidad ni tecnología sin requisito o cambio aprobado.
- Antes de trabajar en una tarea: `ai-dev context <TASK-ID>`.
- Antes de cerrarla: `ai-dev validate` y `ai-dev trace`.
- Nunca ejecutar `ai-dev approve`: la aprobación es humana.
- Las contraseñas nunca se guardan en claro; usa solo credenciales ficticias (ver `.ai-dev/policies.yaml`).
