---
document_id: PLAN-001
document_type: IMPLEMENTATION_PLAN
title: Plan de implementación del piloto
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
    target: PRD-001
  - type: DERIVED_FROM
    target: ARCH-001
approved_at: 2026-10-08
---

# Plan de implementación — Piloto MiAdmin

## Estrategia
Riesgo primero: la base técnica y el cifrado (lo más crítico) antes que la gestión de datos y la interfaz. Cada tarea entrega lógica probada sin navegador más su parte de interfaz.

## Épicas
| Épica | Objetivo | Requisitos | Tareas |
|---|---|---|---|
| EPIC-001 Base | Proyecto, build, pruebas y gates | — | TASK-001 |
| EPIC-002 Seguridad | Clave maestra y cifrado | FR-001, NFR-001 | TASK-002 |
| EPIC-003 Bóveda | Categorías, sitios y consulta de contraseñas | FR-002, FR-003, FR-004, NFR-001 | TASK-003, TASK-004 |

## Dependencias críticas
TASK-001 → TASK-002 → TASK-003 → TASK-004 (cada una usa la anterior).

## Estrategia de pruebas
| Nivel | Qué cubre | Herramienta |
|---|---|---|
| Unitarias | `crypto` y `vault`: cada criterio de aceptación de FR-001 a FR-004 y NFR-001 | Vitest (Node incluye WebCrypto) |
| Seguridad | Ninguna contraseña ni la clave maestra en claro en el almacenamiento; clave errónea no descifra | Vitest con almacenamiento simulado |
| Manual | Flujo completo en el navegador (`npm run dev`) | Checklist en el informe de validación |

Gates (`gate_commands`): CODE = `npm run typecheck`, BUILD = `npm run build`, TEST = `npm test`, SECURITY = `npm audit --audit-level=high`. Solo credenciales ficticias en pruebas.

## Hitos
| Hito | Criterio | Fecha objetivo |
|---|---|---|
| Planificación aprobada | Sesión de revisión 1 hasta DEVELOPMENT | 2026-10-08 |
| Release v0.1.0 | Sesión de revisión 2 hasta EVOLUTION | 2026-10-10 |
