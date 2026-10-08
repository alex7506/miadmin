---
document_id: ADR-002
document_type: ADR
title: Cifrado PBKDF2 y AES-GCM con WebCrypto
version: 0.1.0
status: ACCEPTED
project: miadmin
methodology_version: 0.9.0
created_at: 2026-10-08
updated_at: 2026-10-08
author: Claude Code
approved_by: alexander
source_of_truth: true
decision_date: 2026-10-08
deciders: []
relations:
  - type: IMPLEMENTS
    target: NFR-001
approved_at: 2026-10-08
---

# ADR-002 — Cifrado PBKDF2 y AES-GCM con WebCrypto

## Contexto
NFR-001 exige que las contraseñas solo existan en claro en memoria del navegador. Se necesita derivar una clave de la clave maestra y cifrar cada contraseña sin dependencias criptográficas propias.

## Decisión
Usar la API **WebCrypto** del navegador: **PBKDF2-SHA-256** con 600 000 iteraciones y sal aleatoria de 16 bytes para derivar una clave **AES-GCM de 256 bits** no exportable, e **IV aleatorio de 12 bytes** por cada cifrado. La clave maestra se verifica descifrando un valor de control.

## Alternativas consideradas
| Alternativa | Ventajas | Desventajas | Motivo de descarte |
|---|---|---|---|
| Argon2id (librería WASM) | Más resistente a ataques con GPU | Dependencia externa y más peso | WebCrypto no lo ofrece de forma nativa; PBKDF2 con iteraciones altas es aceptable para el piloto |
| Librería de terceros (p. ej. libsodium) | API de alto nivel | Dependencia a auditar | Innecesaria con WebCrypto |

## Consecuencias
- **Positivas:** sin dependencias criptográficas; clave no exportable; AES-GCM detecta claves erróneas y datos alterados.
- **Negativas / costes:** derivar la clave tarda unos cientos de milisegundos al desbloquear.
- **Riesgos:** una clave maestra débil sigue siendo débil; se exige un mínimo de 12 caracteres (FR-001).

## Alcance
Cifrado de contraseñas de la bóveda del piloto. Revisar (Argon2id) al construir la visión completa.
