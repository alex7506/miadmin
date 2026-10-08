---
document_id: TASK-002
document_type: TASK
title: Cifrado y clave maestra
version: 0.1.0
status: COMPLETED
project: miadmin
methodology_version: 0.9.0
created_at: 2026-10-08
updated_at: 2026-10-08
author: Claude Code
approved_by: null
source_of_truth: true
kind: FEATURE
objective: Cifrado y clave maestra
risk: MEDIUM
data_classification: INTERNAL
capabilities:
  - code_generation
  - test_generation
  - test_execution
  - commit
executor: AGENT
reviewed_by: null
context_sources: []
constraints: []
acceptance_criteria:
  - id: AC-1
    description: "Módulo crypto: PBKDF2-SHA-256 (600000 iteraciones, sal de 16 bytes) y AES-GCM 256 con IV aleatorio de 12 bytes por cifrado (NFR-001 AC-1), con pruebas"
  - id: AC-2
    description: Crear clave maestra de al menos 12 caracteres confirmada dos veces (FR-001 AC-1), con pruebas
  - id: AC-3
    description: Desbloquear con la clave correcta y error sin descifrar nada con una incorrecta (FR-001 AC-2), con pruebas
  - id: AC-4
    description: Bloquear descarta la clave de memoria (FR-001 AC-3), con pruebas
blocked_by:
  - TASK-001
evidence:
  - criterion: AC-1
    type: TEST_RUN
    ref: "src/crypto.test.ts (4 pruebas: parámetros, clave no exportable AES-GCM 256, IV único de 12 bytes, clave errónea no descifra) en verde; commit 363964a"
    recorded_at: 2026-10-08
  - criterion: AC-2
    type: TEST_RUN
    ref: "src/vault.test.ts › FR-001 AC-1: longitud mínima, coincidencia y bóveda única; commit 363964a"
    recorded_at: 2026-10-08
  - criterion: AC-3
    type: TEST_RUN
    ref: "src/vault.test.ts › FR-001 AC-2: clave incorrecta rechazada sin desbloquear; commit 363964a"
    recorded_at: 2026-10-08
  - criterion: AC-4
    type: TEST_RUN
    ref: "src/vault.test.ts › FR-001 AC-3: lock descarta la clave; commit 363964a"
    recorded_at: 2026-10-08
auto_fix_attempts: 0
relations:
  - type: IMPLEMENTS
    target: FR-001
  - type: IMPLEMENTS
    target: NFR-001
  - type: DEPENDS_ON
    target: TASK-001
provenance:
  generated_by: claude-code
  model: claude-opus-5-5
---

# TASK-002 — Cifrado y clave maestra

<!-- Los campos estructurados (riesgo, capacidades, criterios, evidencia) viven en el frontmatter.
     Si kind no es FEATURE, sustituye la relación IMPLEMENTS por `justification`. -->

## Contexto
<!-- Qué necesita saber quien ejecute la tarea y dónde está (enlaces a requisitos, ADR, archivos). -->

## Enfoque propuesto
<!-- Pasos previstos. Lo completa quien ejecuta antes de empezar (Plan). -->

## Notas de ejecución
<!-- Decisiones tomadas durante la ejecución, intentos fallidos, preguntas abiertas. -->
