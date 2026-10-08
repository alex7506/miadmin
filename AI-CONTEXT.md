# AI-CONTEXT — MiAdmin

<!-- Resumen vivo para agentes. Máximo catalog/limits.yaml#max_ai_context_md_lines líneas.
     No duplica documentos: los referencia. Se actualiza al cerrar tareas que cambien su contenido. -->

## Propósito
SaaS multi-tenant de administración personal. Un superadministrador (el propietario) vende espacios aislados a clientes (una persona por tenant), cada uno con su tema y su subdominio. Primer módulo: gestor de accesos a sitios web con contraseñas cifradas en el navegador (zero-knowledge).

## Estado
- Fase y estado: ver `.ai-dev/state.yaml`
- Modo de rigor: STANDARD

## Stack aprobado
Sin decidir hasta la fase TECHNOLOGY. No elijas ni instales tecnologías antes.

## Alcance
Ver `docs/00-intake/INTAKE-001-intake-miadmin.md` (y el PRD cuando exista).

## Fuera de alcance
- Documentos y otros módulos, equipos por cliente, logo y dominio propio, recuperación de la clave maestra.

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
- Las contraseñas nunca llegan en claro al servidor; usa solo credenciales ficticias (ver `.ai-dev/policies.yaml`).
