---
document_id: PRD-001
document_type: PRD
title: Bóveda de sitios
version: 0.1.0
status: APPROVED
project: miadmin
methodology_version: 0.9.0
created_at: 2026-10-08
updated_at: 2026-10-08
author: Claude Code
approved_by: alexander
source_of_truth: true
relations:
  - type: DERIVED_FROM
    target: INTAKE-001
approved_at: 2026-10-08
---

# PRD — Bóveda de sitios (MiAdmin mínimo)

## Visión
Un lugar personal y seguro, dentro del navegador, para guardar y consultar los accesos a los sitios web que uso, ordenados por categorías.

## Objetivos y métricas de éxito
| Objetivo | Métrica | Meta |
|---|---|---|
| Validar la metodología y `ai-dev` | Fases recorridas con aprobación registrada | INTAKE → RELEASE completas |
| Guardar accesos de forma segura | Contraseñas en claro en el almacenamiento | 0 (verificado por prueba) |
| Uso básico completo | Requisitos MUST con evidencia | 100 % |

## Usuarios
Una persona que usa la bóveda en su propio navegador. No hay cuentas ni servidor.

## Requisitos funcionales
| ID | Requisito | Prioridad |
|---|---|---|
| FR-001 | Clave maestra y desbloqueo | MUST |
| FR-002 | Categorías | MUST |
| FR-003 | Sitios | MUST |
| FR-004 | Consultar contraseña | MUST |

## Requisitos no funcionales
| ID | Atributo | Requisito medible | Prioridad |
|---|---|---|---|
| NFR-001 | Seguridad | AES-GCM 256 con clave PBKDF2-SHA-256 (≥ 600 000 iteraciones); nada en claro en el almacenamiento | MUST |

Criterios de aceptación detallados: `docs/01-product/requirements.yaml`.

## Reglas de negocio
- Una categoría con sitios no se puede eliminar.
- Todo sitio pertenece a una categoría existente.
- La clave maestra no se guarda ni se puede recuperar: si se olvida, el contenido no se puede descifrar.

## Fuera de alcance
Ver INTAKE-001: multi-tenant, superadministrador, suscripciones, backend, tema, subdominios y despliegue público.

## Dependencias y supuestos
- Navegador moderno con WebCrypto (`crypto.subtle`) y `localStorage`.
- La persona entiende que borrar los datos del navegador borra la bóveda.
