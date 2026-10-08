---
document_id: INTAKE-001
document_type: PROJECT_INTAKE
title: Intake MiAdmin
version: 0.2.0
status: APPROVED
project: miadmin
methodology_version: 0.9.0
created_at: 2026-10-08
updated_at: 2026-10-08
author: Claude Code
approved_by: alexander
source_of_truth: true
relations: []
approved_at: 2026-10-08
---

# Intake — MiAdmin (piloto mínimo)

## Problema
Validar de punta a punta la metodología Software AI Development y su herramienta `ai-dev` en un proyecto real e independiente, antes de usarlas como estándar en desarrollos productivos. Se necesita un producto pequeño pero con decisiones reales (requisitos, arquitectura, seguridad, pruebas y release) para ejercitar todo el ciclo.

## Objetivo
Construir **MiAdmin mínimo**: una bóveda personal de accesos a sitios web que funciona íntegramente en el navegador. Es el primer módulo de la visión completa de MiAdmin (SaaS multi-tenant), reducido a lo indispensable.

Éxito:
- El ciclo completo (INTAKE → RELEASE) se recorre con `ai-dev`, con aprobaciones humanas registradas y trazabilidad aceptable para el modo LITE.
- La bóveda permite crear una clave maestra, gestionar categorías y sitios y consultar contraseñas descifradas.
- Las contraseñas nunca se almacenan en claro.
- Plazo: 2 días.

## Usuarios
| Usuario | Necesidad |
|---|---|
| Persona usuaria (una sola, en su navegador) | Guardar y consultar de forma segura sus accesos a sitios, organizados por categorías. |
| Propietario (responsable de la metodología) | Comprobar que la metodología y `ai-dev` funcionan en un caso real. |

## Alcance inicial
- Clave maestra: creación y desbloqueo de la bóveda.
- Categorías: crear y eliminar (p. ej. estudio, administrativo, correos electrónicos).
- Sitios: crear, listar y eliminar, con nombre, URL, descripción, usuario, contraseña y categoría.
- Ver y copiar la contraseña descifrada de un sitio.
- Cifrado de las contraseñas en el navegador (WebCrypto); datos guardados en el almacenamiento local del navegador.
- Release etiquetado (`v0.1.0`) con build reproducible.

## Fuera de alcance
- Multi-tenant, panel de superadministrador, registro de clientes y periodo de prueba.
- Suscripciones y cobros.
- Backend, base de datos en servidor y sincronización entre dispositivos.
- Subdominios, personalización de tema, despliegue público en Vercel (se hará al retomar la visión completa).
- Recuperación de la clave maestra (por diseño, si se pierde no se recupera el contenido).

La visión completa (SaaS multi-tenant con superadministrador, prueba de 1 mes, suscripciones, tema y subdominio por cliente, operación en Colombia bajo la Ley 1581 de 2012) queda registrada para un proyecto posterior.

## Restricciones conocidas
- Plazo: 2 días. Criterio de recorte: se prioriza recorrer todas las fases sobre la amplitud funcional.
- Equipo: una persona responsable; el desarrollo lo ejecuta un agente de IA (Claude Code).
- Sin backend: todo funciona en el navegador.

## Datos que manejará
| Dato | Clasificación |
|---|---|
| Contraseñas de sitios | **RESTRICTED**: solo existen en claro en memoria del navegador; se guardan cifradas. |
| Usuarios de acceso, URLs y descripciones | CONFIDENTIAL |
| Categorías | INTERNAL |
| Código y documentación del proyecto | INTERNAL |

En desarrollo y pruebas solo se usan credenciales ficticias.

## Modo de rigor propuesto
**LITE**: piloto de validación sin usuarios externos ni datos reales; una sola persona aprueba todas las fases. Las políticas locales mantienen los controles críticos (cifrado obligatorio y credenciales ficticias).

## Incógnitas
| Pregunta | Estado | Responsable |
|---|---|---|
| ¿Está desactivada en Claude Pro la opción de usar conversaciones para entrenar modelos? | UNKNOWN (no afecta al piloto: solo se comparten código y datos ficticios) | Propietario |
| País de operación | Resuelto: Colombia (aplica a la visión completa) | — |
| Plazo | Resuelto: 2 días | — |
