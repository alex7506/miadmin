---
document_id: TASK-004
document_type: TASK
title: Ver y copiar contraseña
version: 0.1.0
status: PENDING
project: miadmin
methodology_version: 0.9.0
created_at: 2026-10-08
updated_at: 2026-10-08
author: Claude Code
approved_by: null
source_of_truth: true
kind: FEATURE
objective: Ver y copiar contraseña
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
    description: Mostrar a petición la contraseña descifrada de un sitio (FR-004 AC-1), con pruebas
  - id: AC-2
    description: Copiar la contraseña descifrada al portapapeles (FR-004 AC-2), con prueba
blocked_by:
  - TASK-003
evidence: []
auto_fix_attempts: 0
relations:
  - type: IMPLEMENTS
    target: FR-004
  - type: DEPENDS_ON
    target: TASK-003
---

# TASK-004 — Ver y copiar contraseña

<!-- Los campos estructurados (riesgo, capacidades, criterios, evidencia) viven en el frontmatter.
     Si kind no es FEATURE, sustituye la relación IMPLEMENTS por `justification`. -->

## Contexto
<!-- Qué necesita saber quien ejecute la tarea y dónde está (enlaces a requisitos, ADR, archivos). -->

## Enfoque propuesto
<!-- Pasos previstos. Lo completa quien ejecuta antes de empezar (Plan). -->

## Notas de ejecución
<!-- Decisiones tomadas durante la ejecución, intentos fallidos, preguntas abiertas. -->
