---
document_id: ADR-001
document_type: ADR
title: Stack Vite y TypeScript sin backend
version: 0.1.0
status: PROPOSED
project: miadmin
methodology_version: 0.9.0
created_at: 2026-10-08
updated_at: 2026-10-08
author: Claude Code
approved_by: null
source_of_truth: true
decision_date: "2026-10-08"
deciders: []
relations:
  - type: DERIVED_FROM
    target: ARCH-001
---

# ADR-001 — Stack Vite y TypeScript sin backend

## Contexto
El piloto debe completarse en 2 días, funcionar solo en el navegador (ARCH-001) y tener pruebas automatizadas y un build reproducible para ejercitar los gates de la metodología.

## Decisión
Usar **TypeScript** con **Vite** como herramienta de build y **Vitest** para las pruebas, sin framework de interfaz (DOM directo) y sin backend.

## Alternativas consideradas
| Alternativa | Ventajas | Desventajas | Motivo de descarte |
|---|---|---|---|
| Next.js | Escala a la visión SaaS completa | Servidor, más dependencias y configuración | Excesivo para un piloto local de 2 días |
| React + Vite | Componentes reutilizables | Dependencia adicional sin necesidad real | La interfaz es pequeña |
| JavaScript sin build | Cero dependencias | Sin tipos ni pruebas cómodas | Menos verificable |

## Consecuencias
- **Positivas:** pocas dependencias (`vite`, `typescript`, `vitest`); pruebas rápidas en Node, que incluye WebCrypto.
- **Negativas / costes:** la visión completa probablemente requerirá otro stack con backend; se decidirá entonces con un nuevo ADR.
- **Riesgos:** ninguno relevante para el piloto.

## Alcance
Solo el piloto MiAdmin mínimo.
