import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { method, params } = body;

    if (method === "tools/list") {
      return NextResponse.json({
        tools: [
          {
            name: "get_services",
            description: "Obtiene información de tatuajes, piercings y barbería.",
            inputSchema: { type: "object", properties: {} },
          },
          {
            name: "get_location_and_hours",
            description: "Dirección en Playa del Carmen y horarios.",
            inputSchema: { type: "object", properties: {} },
          },
        ],
      });
    }

    if (method === "tools/call") {
      const toolName = params?.name;
      if (toolName === "get_location_and_hours") {
        return NextResponse.json({
          content: [
            {
              type: "text",
              text: "Mambas Tattoo & Cuts: Calle 1 Sur esquina Av. 25 Sur, Centro, Playa del Carmen, Quintana Roo. Horario: Lun-Sáb 9am-9pm, Dom 12pm-9pm. Tel: +52 984 367 5261.",
            },
          ],
        });
      }

      if (toolName === "get_services") {
        return NextResponse.json({
          content: [
            {
              type: "text",
              text: "Servicios: Tatuajes profesionales (blackwork, fineline, realismo), Perforaciones / Piercing con titanio grado implante (COFEPRIS), Barbería tradicional mexicana (cortes fade, ritual de toalla caliente y navaja libre).",
            },
          ],
        });
      }
    }

    return NextResponse.json({
      status: "ok",
      server: "mambas-mcp",
    });
  } catch {
    return NextResponse.json({ error: "Invalid MCP request" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    name: "Mambas Tattoo & Cuts MCP Server",
    status: "online",
    transport: "http-post",
  });
}
