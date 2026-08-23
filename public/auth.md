# auth.md - Mambas AI Agent Access & Registration

## Visión General
Mambas Tattoo & Cuts proporciona acceso público y estructurado para modelos de lenguaje y agentes de IA autónomos para consultar servicios, disponibilidad y ubicación.

## Modelo de Acceso para Agentes
- **Lectura Pública (Sin autenticación requerida):**
  - Catálogo de servicios y base de conocimientos: `GET /llms.txt` y `GET /llms-full.txt`
  - Descubrimiento de API: `GET /.well-known/api-catalog`
  - Descubrimiento MCP: `GET /.well-known/mcp/server-card.json`
  - Manifiesto ARD: `GET /.well-known/ai-catalog.json`
  - Habilidades de agente: `GET /.well-known/agent-skills/index.json`

## Registro de Agentes
- **Tipo de identidad soportada:** `anonymous` / `public`
- **Ámbitos (Scopes):** `public:read`, `appointments:create`
- **Flujo de interacción:** Los agentes pueden interactuar a través de las herramientas MCP publicadas o derivar usuarios directamente a nuestro canal de WhatsApp verificado: [+52 984 367 5261](https://wa.me/529843675261).

## Metadatos OAuth / Descubrimiento
- Recurso protegido: `/.well-known/oauth-protected-resource`
- Servidor de autorización: `/.well-known/oauth-authorization-server`
