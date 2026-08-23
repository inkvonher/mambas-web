import { NextResponse } from "next/server";

const siteUrl = (process.env.SITE_URL || "https://mambaspdc.com").replace(
  /\/$/,
  "",
);

export async function GET() {
  const openApiDoc = {
    openapi: "3.1.0",
    info: {
      title: "Mambas Tattoo & Cuts Public API",
      version: "1.0.0",
      description:
        "Public API for Mambas Tattoo & Cuts studio in Playa del Carmen, Mexico.",
    },
    servers: [
      {
        url: siteUrl,
        description: "Production Server",
      },
    ],
    paths: {
      "/api/health": {
        get: {
          summary: "Service Health Check",
          responses: {
            "200": {
              description: "API is healthy",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                      version: { type: "string", example: "1.0.0" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/llms.txt": {
        get: {
          summary: "LLM Knowledge Base",
          responses: {
            "200": {
              description: "Markdown knowledge base for AI agents",
              content: {
                "text/markdown": {
                  schema: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  };

  return NextResponse.json(openApiDoc, {
    status: 200,
    headers: {
      "Content-Type": "application/openapi+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
