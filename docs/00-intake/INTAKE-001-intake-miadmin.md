---
document_id: INTAKE-001
document_type: PROJECT_INTAKE
title: Intake MiAdmin
version: 0.1.0
status: DRAFT
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

Éxito del MVP:
- Un cliente puede suscribirse, entrar en su subdominio, crear su clave maestra y gestionar sus sitios por categorías.
- Ni el propietario ni una filtración de la base de datos permiten leer las contraseñas de los clientes.
- El propietario gestiona los clientes desde su panel de superadministrador.
- Métricas de negocio (clientes activos, conversión, retención): UNKNOWN.

## Usuarios
| Usuario | Necesidad |
|---|---|
| **Superadministrador** (propietario de MiAdmin) | Crear, suspender y supervisar clientes; ver el estado de sus suscripciones; configurar la plataforma. No accede al contenido de los clientes. |
| **Cliente** (tenant: una persona) | Tener su espacio privado, personalizar sus colores, organizar sus sitios por categorías y consultar sus credenciales de forma segura. |

## Alcance inicial
- Multi-tenant: cada cliente es una persona con datos aislados del resto.
- Panel de superadministrador: alta, suspensión y consulta de clientes y de su suscripción.
- Suscripciones: planes y pago con pasarela externa (checkout alojado, sin manejar datos de tarjeta).
- Autenticación de clientes y del superadministrador, con segundo factor.
- Subdominio por cliente (`cliente.miadmin.com`).
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
- Aplicaciones móviles nativas y extensiones de navegador.
- Autocompletado de contraseñas en otros sitios.

## Restricciones conocidas
- Equipo: una persona (propietario) apoyada por agentes de IA.
- Tecnología: se decidirá en la fase TECHNOLOGY. Debe permitir aislamiento por tenant en la capa de datos, subdominios comodín, criptografía en el navegador (WebCrypto) y una pasarela de suscripciones.
- Plazo y presupuesto: UNKNOWN.
- Normativa de protección de datos aplicable: UNKNOWN (depende del país de operación y de los clientes).

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
| Planes y precios de suscripción (cuántos planes, qué incluye cada uno, periodo de prueba) | UNKNOWN | Propietario |
| Límites por plan (número de sitios, categorías, módulos) | UNKNOWN | Propietario |
| Moneda, país de operación y normativa de datos aplicable | UNKNOWN | Propietario |
| Región donde se alojarán los datos | UNKNOWN | Propietario |
| Dominio principal (¿miadmin.com u otro?) | UNKNOWN | Propietario |
| ¿Registro libre de clientes o solo por invitación del superadministrador? | UNKNOWN | Propietario |
| Proveedor y plan de IA usado en el desarrollo y sus condiciones de privacidad (define qué datos pueden enviarse al agente) | UNKNOWN | Propietario |
| Plazo objetivo del MVP | UNKNOWN | Propietario |
