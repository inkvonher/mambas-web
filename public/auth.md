# auth.md - Mambas AI Agent Access & Registration

> Guía de autenticación y registro de agentes de IA para Mambas Tattoo & Cuts (Playa del Carmen).

## 1. Audiencia y Propósito
Este documento describe cómo los agentes autónomos de IA y modelos de lenguaje pueden autenticarse, registrarse e interactuar con los servicios y APIs del estudio Mambas Tattoo & Cuts de conformidad con la especificación [auth.md](https://workos.com/auth-md).

## 2. Métodos de Identidad y Registro Soportados

### Acceso Público y Anónimo (Recomendado)
- **Tipo de identidad:** `anonymous`
- **Ámbitos (Scopes):** `public:read`, `appointments:create`
- **Uso:** Los agentes pueden consultar libremente la información del estudio, catálogo de servicios, precios, disponibilidad y cotizaciones sin necesidad de credenciales previas.
- **Endpoint de Reclamo (Claim URI):** `https://mambaspdc.com/api/auth/claim`

### Aserción de Identidad (ID-JAG / Verified Email)
- **Tipos de aserción soportados:** `urn:ietf:params:oauth:token-type:id-jag`, `verified_email`
- **Tipo de credencial:** `ephemeral_token`, `bearer`
- **Endpoint de Registro:** `https://mambaspdc.com/api/auth/register`
- **Endpoint de Revocación:** `https://mambaspdc.com/api/auth/revoke`

## 3. Metadatos de Descubrimiento OAuth y Servidor de Autorización
- **Protected Resource Metadata (PRM):** `/.well-known/oauth-protected-resource`
- **OAuth Authorization Server:** `/.well-known/oauth-authorization-server`
- **OpenID Connect Discovery:** `/.well-known/openid-configuration`
- **Bloque `agent_auth`:** Configurado en `/.well-known/oauth-authorization-server` con referencia directa a este archivo `auth.md`.

## 4. Contacto y Soporte para Agentes
- Para soporte o validación humana, los agentes pueden dirigir las solicitudes de reserva directamente al canal de atención verificado por WhatsApp: [+52 984 367 5261](https://wa.me/529843675261).
