---
document_id: CHANGE-001
document_type: CHANGE_REQUEST
title: Rediseño visual y metodología 1.0.0
version: 0.1.0
status: DONE
project: miadmin
methodology_version: 0.9.0
created_at: 2026-10-08
updated_at: 2026-10-08
author: Claude Code
approved_by: alexander
source_of_truth: true
reason: Publicar MiAdmin como proyecto de ejemplo de la metodología con una interfaz cuidada, y alinearlo con la metodología 1.0.0.
requested_by: alexander
impact_level: LOW
reentry_phase: PLANNING
relations:
  - type: AFFECTS
    target: ARCH-001
approved_at: 2026-10-08
---

# CHANGE-001 — Rediseño visual y metodología 1.0.0

## Motivo
MiAdmin se publicará como proyecto de ejemplo de Software AI Development. La interfaz de la v0.1.0 es funcional pero básica; como ejemplo público debe mostrar un resultado cuidado. Además, el proyecto fija la metodología 0.9.0 y la herramienta ya está en 1.0.0, lo que genera advertencias en `ai-dev validate`.

## Cambio propuesto
1. **Rediseño visual completo** de la interfaz: sistema de diseño con tokens de color, tipografía y espaciado; modo claro y oscuro; diseño adaptable a móvil; pantallas de creación y desbloqueo, navegación por categorías y tarjetas de sitios. Sin cambiar el comportamiento: los requisitos FR-001 a FR-004 y NFR-001 no se modifican.
2. **Actualizar la metodología fijada a 1.0.0** y regenerar las instrucciones de los asistentes.

## Análisis de impacto
| Área | Afectada | Detalle |
|---|---|---|
| Requisitos | no | Mismo comportamiento; las pruebas existentes deben pasar sin cambios. |
| Arquitectura y datos | no | Solo cambian `src/app.ts`, `src/dom.ts`, `src/style.css` e `index.html`. El formato de la bóveda no cambia. |
| Tecnología | no | Sin dependencias nuevas: CSS propio, sin framework de interfaz ni fuentes externas (ADR-001). |
| Seguridad | no | No se toca la criptografía. Se mantiene: contraseñas visibles solo a petición y descartadas al bloquear. |
| Tareas en curso | no | Todas las tareas anteriores están cerradas. |
| Coste y plazo | sí | Una tarea (TASK-005) y una release v0.2.0. |

## Fase de reingreso propuesta
**PLANNING**: es un cambio solo de implementación. No altera requisitos (DEFINITION) ni arquitectura o tecnología (ARCHITECTURE, TECHNOLOGY).

## Decisión
<!-- La completa la persona que aprueba o rechaza. -->
