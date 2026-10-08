---
document_id: ARCH-001
document_type: ARCHITECTURE
title: Arquitectura de la bóveda
version: 0.1.0
status: IN_REVIEW
project: miadmin
methodology_version: 0.9.0
created_at: 2026-10-08
updated_at: 2026-10-08
author: Claude Code
approved_by: null
source_of_truth: true
relations:
  - type: DERIVED_FROM
    target: PRD-001
  - type: IMPLEMENTS
    target: NFR-001
---

# Arquitectura — Bóveda de sitios

## Contexto del sistema
Aplicación web estática que se ejecuta íntegramente en el navegador. No hay servidor de aplicación, base de datos remota ni servicios externos.

## Estilo arquitectónico
Aplicación de una sola página sin backend. Es la estructura más simple que cumple los requisitos: con un único usuario por navegador no hace falta servidor, y sin servidor las contraseñas nunca salen del dispositivo (NFR-001).

## Componentes
| Componente | Responsabilidad | Se comunica con |
|---|---|---|
| `crypto` | Derivar la clave (PBKDF2), cifrar y descifrar (AES-GCM), verificar la clave maestra | WebCrypto |
| `vault` | Reglas de negocio: categorías, sitios, validaciones, bloqueo y desbloqueo | `crypto`, `storage` |
| `storage` | Leer y escribir el estado cifrado de la bóveda | `localStorage` |
| `ui` | Pantallas: crear clave, desbloquear, categorías, sitios, ver/copiar contraseña | `vault` |

`vault` no conoce el DOM y `ui` no conoce la criptografía: así la lógica y la seguridad se prueban sin navegador.

## Datos
Un único registro en `localStorage` con: sal, verificador cifrado de la clave maestra, categorías y sitios. En cada sitio, la contraseña se guarda como `{ iv, ciphertext }`; el resto de campos en claro (CONFIDENTIAL, aceptado para el piloto local).

## Seguridad
- La clave maestra nunca se guarda; se deriva una clave AES con PBKDF2 y se mantiene solo en memoria mientras la bóveda está desbloqueada.
- La clave correcta se verifica descifrando un valor de control cifrado (AES-GCM autentica: una clave errónea falla).
- Bloquear descarta la clave de memoria.

## Cobertura de requisitos no funcionales
| NFR | Cómo lo cubre la arquitectura |
|---|---|
| NFR-001 | `crypto` aísla PBKDF2 + AES-GCM; `storage` solo recibe datos ya cifrados; una prueba inspecciona el almacenamiento. |

## Lo que explícitamente no se hará
Servidor, sincronización, cuentas de usuario, cifrado de los campos no sensibles y recuperación de la clave maestra.

## Decisiones
| ADR | Decisión |
|---|---|
| ADR-001 | Vite + TypeScript sin backend |
| ADR-002 | PBKDF2-SHA-256 + AES-GCM con WebCrypto |
