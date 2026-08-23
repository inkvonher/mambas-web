import { NextResponse } from "next/server";

const siteUrl = (process.env.SITE_URL || "https://mambaspdc.com").replace(
  /\/$/,
  "",
);

export async function GET() {
  const mcpServerCard = {
    $schema: "https://modelcontextprotocol.io/schemas/server-card.json",
    serverInfo: {
      name: "Mambas Tattoo & Cuts Assistant",
      version: "1.0.0",
      description:
        "Agent capabilities for Mambas Tattoo, Piercing & Barbershop in Playa del Carmen.",
    },
    endpoint: `${siteUrl}/api/mcp`,
    capabilities: {
      tools: [
        {
          name: "get_services",
          description:
            "Obtiene la lista de servicios disponibles (tatuajes personalizados, piercings, barbería tradicional) con información de estilos y cuidados.",
          inputSchema: {
            type: "object",
            properties: {
              category: {
                type: "string",
                enum: ["all", "tattoos", "piercings", "barbershop"],
                description: "Categoría de servicio a consultar",
              },
            },
          },
        },
        {
          name: "get_location_and_hours",
          description:
            "Devuelve la dirección física exacta, horarios de atención y cómo llegar desde el ferry a Cozumel o 5ta Avenida.",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "get_booking_info",
          description:
            "Instrucciones y enlaces directos de WhatsApp para cotizar tatuajes o reservar cita.",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
      ],
      resources: [],
      prompts: [],
    },
  };

  return NextResponse.json(mcpServerCard, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
