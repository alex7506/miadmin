---
document_id: REL-001
document_type: RELEASE
title: Release v0.1.0
version: 0.1.0
status: APPROVED
project: miadmin
methodology_version: 0.9.0
created_at: 2026-10-08
updated_at: 2026-10-08
author: Claude Code
approved_by: alexander
source_of_truth: true
release_version: 0.1.0
environment: development
validation_ref: VAL-001
traceability_status: WARNINGS
rollback_verified: true
released_at: 2026-10-08
relations:
  - type: DEPENDS_ON
    target: VAL-001
approved_at: 2026-10-08
---

# REL-001 — Release v0.1.0

## Contenido
| Tipo | Elemento | Referencia |
|---|---|---|
| Funcionalidad | Clave maestra, desbloqueo y bloqueo | FR-001 |
| Funcionalidad | Categorías | FR-002 |
| Funcionalidad | Sitios | FR-003 |
| Funcionalidad | Ver y copiar contraseña | FR-004 |
| Seguridad | Cifrado PBKDF2 + AES-GCM en el navegador | NFR-001 |

## Validación
VAL-001 — APPROVED_WITH_WARNINGS (interfaz verificada manualmente por QA_LEAD; commits de documentación sin trailer).

## Despliegue
Release **local** (entorno `development`): no hay despliegue público en este piloto (fuera de alcance según INTAKE-001). La versión se publica como etiqueta Git `v0.1.0` sobre el commit `0cca191` o el commit de cierre de la release, y se ejecuta con:

```bash
git checkout v0.1.0
npm ci
npm run build && npm run preview
```

## Rollback
Volver a la versión anterior es reconstruir desde el commit previo: `git checkout <commit> && npm ci && npm run build`. **Verificado** el 2026-10-08 reconstruyendo en un worktree aparte el commit de TASK-003 (`b50685d`): build correcto. Los datos de la bóveda viven en el `localStorage` del navegador y no cambian de formato en esta versión.

## Notas de versión
Primera versión de MiAdmin: bóveda personal de accesos a sitios web en el navegador. Crea una clave maestra, organiza tus sitios por categorías y consulta o copia sus contraseñas, que se guardan cifradas. Si olvidas la clave maestra, el contenido no se puede recuperar.
