---
document_id: REL-002
document_type: RELEASE
title: Release v0.2.0
version: 0.1.0
status: IN_REVIEW
project: miadmin
methodology_version: 1.0.0
created_at: 2026-10-08
updated_at: 2026-10-08
author: Claude Code
approved_by: null
source_of_truth: true
release_version: 0.2.0
environment: development
validation_ref: VAL-002
traceability_status: INTEGRITY_OK
rollback_verified: true
released_at: null
relations:
  - type: DEPENDS_ON
    target: VAL-002
  - type: IMPLEMENTS
    target: CHANGE-001
---

# REL-002 — Release v0.2.0

## Contenido
| Tipo | Elemento | Referencia |
|---|---|---|
| Mejora | Rediseño visual completo: tema claro y oscuro, navegación por categorías, tarjetas de sitios, diálogo de alta y diseño adaptable | CHANGE-001 |
| Mantenimiento | Metodología fijada en 1.0.0; Claude Pro clasificado como `consumer_llm_no_training` | CHANGE-001 |

Sin cambios de comportamiento ni en el formato de los datos guardados.

## Validación
VAL-002 — APPROVED.

## Despliegue
Release local (entorno `development`), publicada como etiqueta `v0.2.0`:

```bash
git checkout v0.2.0 && npm ci && npm run build && npm run preview
```

## Rollback
Volver a v0.1.0: `git checkout v0.1.0 && npm ci && npm run build`. **Verificado** el 2026-10-08 reconstruyendo `v0.1.0` en un worktree aparte. Los datos de `localStorage` son compatibles en ambos sentidos, porque el formato no cambia.

## Notas de versión
Nuevo diseño de MiAdmin: modo claro y oscuro automáticos, categorías en un panel lateral, tarjetas para cada sitio con acciones para ver y copiar la contraseña, y una experiencia cuidada en móvil.
