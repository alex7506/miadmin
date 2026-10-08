---
document_id: INTAKE-001
document_type: PROJECT_INTAKE
title: Intake MiAdmin
version: 0.1.0
status: IN_REVIEW
project: miadmin
methodology_version: 0.9.0
created_at: 2026-10-08
updated_at: 2026-10-08
author: Claude Code
approved_by: null
source_of_truth: true
relations: []
---

# Intake — MiAdmin

## Problema
Las personas acumulan accesos a decenas de sitios (estudio, trámites administrativos, correo, etc.), con su URL, usuario y contraseña dispersos en notas, navegadores o memoria. No tienen un espacio personal propio, ordenado y seguro donde centralizar esa información y, más adelante, documentos y otros datos personales.

## Objetivo
Construir **MiAdmin**, una plataforma SaaS de administración personal que el propietario vende a sus clientes. Cada cliente obtiene su propio espacio aislado, con su tema visual y su subdominio, donde gestiona sus accesos a sitios web de forma segura. La plataforma crece por módulos.

Este primer ciclo tiene un **doble objetivo**: entregar un MVP funcional de MiAdmin y validar de punta a punta la metodología Software AI Development y su herramienta `ai-dev`, para dejarla aprobada como estándar de los siguientes desarrollos. **Plazo: 2 días.**

Éxito del MVP:
- Un cliente se registra solo, obtiene 1 mes de prueba, crea su clave maestra y gestiona sus sitios por categorías en su espacio aislado.
- Ni el propietario ni una filtración de la base de datos permiten leer las contraseñas de los clientes.
- El propietario gestiona los clientes desde su panel de superadministrador.
- La aplicación queda desplegada en Vercel.
- El proyecto recorre todas las fases de la metodología hasta RELEASE con trazabilidad `INTEGRITY_OK`.
- Métricas de negocio (clientes activos, conversión, retención): UNKNOWN.

## Usuarios
| Usuario | Necesidad |
|---|---|
| **Superadministrador** (propietario de MiAdmin) | Crear, suspender y supervisar clientes; ver el estado de sus suscripciones; configurar la plataforma. No accede al contenido de los clientes. |
| **Cliente** (tenant: una persona) | Tener su espacio privado, personalizar sus colores, organizar sus sitios por categorías y consultar sus credenciales de forma segura. |

## Alcance inicial
- Multi-tenant: cada cliente es una persona con datos aislados del resto.
- Registro libre de clientes con **periodo de prueba de 1 mes**; al vencer, el acceso queda restringido hasta activar una suscripción.
- Panel de superadministrador: consulta, suspensión y reactivación de clientes y estado de su prueba o suscripción.
- Autenticación de clientes y del superadministrador, con segundo factor.
- Identificación del espacio del cliente por ruta (`/c/<cliente>`) mientras no haya dominio propio; el modelo de datos queda preparado para subdominios.
- Personalización de tema por cliente (colores, modo claro/oscuro).
- Módulo **Sitios**: nombre, URL, descripción, usuario, contraseña y categoría.
- Categorías gestionables por el cliente (p. ej. estudio, administrativo, correos electrónicos).
- Contraseñas cifradas en el navegador con una clave maestra del cliente (zero-knowledge).
- Arquitectura preparada para añadir módulos.

## Fuera de alcance
- Módulos de documentos e información (fases posteriores).
- Varios usuarios por cliente (equipos u organizaciones).
- Logo propio y dominio propio del cliente.
- Recuperación de la clave maestra (por diseño zero-knowledge, si se pierde no se puede recuperar el contenido).
- **Cobro con pasarela de pago**: los planes y precios no están definidos. Se aplaza a un ciclo posterior (solicitud de cambio cuando se definan); el MVP solo gestiona el periodo de prueba y el estado de la suscripción.
- **Subdominio por cliente**: requiere dominio propio (Vercel no admite subdominios comodín sobre `*.vercel.app`). Se activará al registrar el dominio.
- Aplicaciones móviles nativas y extensiones de navegador.
- Autocompletado de contraseñas en otros sitios.

## Restricciones conocidas
- Equipo: una persona (propietario) apoyada por agentes de IA.
- Tecnología: se decidirá en la fase TECHNOLOGY. Debe permitir aislamiento por tenant en la capa de datos, subdominios comodín, criptografía en el navegador (WebCrypto) y una pasarela de suscripciones.
- Plazo: **2 días** para el ciclo completo. Presupuesto: UNKNOWN (se prioriza infraestructura con capa gratuita).
- Despliegue: **Vercel**, con su dominio gratuito (`*.vercel.app`) mientras se define el dominio.
- País de operación: **Colombia**. Normativa aplicable: Ley 1581 de 2012 de protección de datos personales (Habeas Data) y Decreto 1377 de 2013: requieren autorización del titular, política de tratamiento de datos y atención de consultas y reclamos.
- Desarrollo asistido con Claude Code sobre un plan **Claude Pro** (plan de consumo, sin contrato empresarial).

## Datos que manejará
| Dato | Clasificación |
|---|---|
| Contraseñas de sitios de los clientes | **RESTRICTED**: solo existen en claro en el navegador del cliente; se almacenan cifradas. |
| Usuarios de acceso, URLs y descripciones de sitios | CONFIDENTIAL |
| Datos de cuenta del cliente (nombre, email) | CONFIDENTIAL |
| Estado de suscripción y facturación | CONFIDENTIAL (los datos de tarjeta los gestiona la pasarela) |
| Tema y categorías | INTERNAL |

## Modo de rigor propuesto
**STANDARD**, con controles de seguridad adicionales como políticas locales (plan de calidad y seguridad obligatorio, aislamiento por tenant, cifrado en el navegador y credenciales ficticias en desarrollo). Se descarta CRITICAL porque exige doble aprobación humana y el proyecto tiene un solo responsable.

## Incógnitas
| Pregunta | Estado | Responsable |
|---|---|---|
| Planes y precios de suscripción | UNKNOWN (aún no definido) | Propietario |
| Límites por plan (número de sitios, categorías, módulos) | UNKNOWN (aún no definido) | Propietario |
| Moneda de cobro | UNKNOWN (previsiblemente COP; se decide con los planes) | Propietario |
| Región donde se alojarán los datos | UNKNOWN (se decide en TECHNOLOGY según el proveedor de base de datos) | Propietario |
| Dominio principal | UNKNOWN (temporalmente `*.vercel.app`) | Propietario |
| ¿Está desactivada la opción de Claude Pro que permite usar las conversaciones para entrenar modelos? Define qué datos del proyecto puede recibir el agente. | UNKNOWN | Propietario |
| País de operación | Resuelto: Colombia | — |
| Registro de clientes | Resuelto: registro libre con prueba de 1 mes | — |
| Plazo | Resuelto: 2 días | — |
