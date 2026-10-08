---
document_id: TASK-003
document_type: TASK
title: Categorías y sitios
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
objective: Categorías y sitios
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
    description: Crear categorías con nombre no vacío y no repetido, y eliminar solo las que no tienen sitios (FR-002 AC-1, AC-2), con pruebas
  - id: AC-2
    description: Crear sitios con validación de campos obligatorios, URL http(s) y categoría existente, y eliminarlos (FR-003 AC-1, AC-3), con pruebas
  - id: AC-3
    description: Listar y filtrar sitios por categoría sin mostrar contraseñas (FR-003 AC-2), con pruebas
  - id: AC-4
    description: El almacenamiento nunca contiene contraseñas ni la clave maestra en claro (NFR-001 AC-2), con prueba que inspecciona localStorage
blocked_by:
  - TASK-002
evidence: []
auto_fix_attempts: 0
relations:
  - type: IMPLEMENTS
    target: FR-002
  - type: IMPLEMENTS
    target: FR-003
  - type: IMPLEMENTS
    target: NFR-001
  - type: DEPENDS_ON
    target: TASK-002
---

# TASK-003 — Categorías y sitios

<!-- Los campos estructurados (riesgo, capacidades, criterios, evidencia) viven en el frontmatter.
     Si kind no es FEATURE, sustituye la relación IMPLEMENTS por `justification`. -->

## Contexto
<!-- Qué necesita saber quien ejecute la tarea y dónde está (enlaces a requisitos, ADR, archivos). -->

## Enfoque propuesto
<!-- Pasos previstos. Lo completa quien ejecuta antes de empezar (Plan). -->

## Notas de ejecución
<!-- Decisiones tomadas durante la ejecución, intentos fallidos, preguntas abiertas. -->
