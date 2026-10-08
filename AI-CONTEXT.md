# AI-CONTEXT — MiAdmin

<!-- Resumen vivo para agentes. Máximo catalog/limits.yaml#max_ai_context_md_lines líneas.
     No duplica documentos: los referencia. Se actualiza al cerrar tareas que cambien su contenido. -->

## Propósito
Piloto mínimo para validar la metodología y `ai-dev`: bóveda personal de accesos a sitios web que funciona solo en el navegador, con contraseñas cifradas mediante una clave maestra (WebCrypto).

## Estado
- Fase y estado: ver `.ai-dev/state.yaml`
- Modo de rigor: LITE

## Stack aprobado
Sin decidir hasta la fase TECHNOLOGY. No elijas ni instales tecnologías antes.

## Alcance
Ver `docs/00-intake/INTAKE-001-intake-miadmin.md` (y el PRD cuando exista).

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
