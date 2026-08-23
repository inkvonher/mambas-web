import { NextResponse } from "next/server";

const siteUrl = (process.env.SITE_URL || "https://mambaspdc.com").replace(
  /\/$/,
  "",
);

const domain = siteUrl.replace(/^https?:\/\//, "");

export async function GET() {
  const ardCatalog = {
    specVersion: "1.0",
    host: {
      displayName: "Mambas Tattoo & Cuts",
      identifier: `did:web:${domain}`,
    },
    entries: [
      {
        identifier: `urn:air:${domain}:server:mcp`,
        displayName: "Mambas Tattoo & Cuts MCP Server",
        type: "application/mcp-server-card+json",
        url: `${siteUrl}/.well-known/mcp/server-card.json`,
        representativeQueries: [
          "estudio de tatuajes en playa del carmen",
          "barberia tradicional cerca del ferry de cozumel",
          "perforaciones y piercing certificado cofepris playa del carmen",
          "agendar cita de tatuaje o barberia en mambas",
        ],
      },
      {
        identifier: `urn:air:${domain}:catalog:api`,
        displayName: "Mambas API Catalog",
        type: "application/linkset+json",
        url: `${siteUrl}/.well-known/api-catalog`,
        representativeQueries: [
          "api catalog for mambas services",
          "mambas openapi documentation",
        ],
      },
      {
        identifier: `urn:air:${domain}:doc:llms`,
        displayName: "Mambas LLM Knowledge Base",
        type: "text/markdown",
        url: `${siteUrl}/llms.txt`,
        representativeQueries: [
          "servicios y precios de mambas tattoo and cuts",
          "horarios y ubicacion de mambas en playa del carmen",
          "medidas de higiene y certificacion cofepris",
        ],
      },
    ],
  };

  return NextResponse.json(ardCatalog, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
