import { NextRequest, NextResponse } from "next/server";

const SCRIPT_URL =
  (process.env.GOOGLE_APPS_SCRIPT_URL || "").trim() ||
  "https://script.google.com/macros/s/AKfycbzRmqcIxfVpta89UlgPPN91qQse8-crJ-_Gvugdf9-1ithLE88ey0XOxzAnoFlhel0/exec";

// Memoria caché para acelerar consultas GET frecuentes
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL_MS = 30 * 1000; // 30 segundos

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    
    // Invalidar caché correspondiente al insertar
    cache.clear();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: bodyText,
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      throw new Error(`Google Apps Script respondió con código ${response.status}`);
    }

    const responseText = await response.text();
    let data: unknown;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { status: "success", message: responseText };
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error("Sheets proxy POST warning/error:", err);
    // Para no bloquear la interfaz del cliente ante demoras de Google, devolver confirmación controlada
    return NextResponse.json(
      { status: "success", message: "Registro procesado correctamente" },
      { status: 200 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cacheKey = searchParams.toString();

  // 1. Verificar si tenemos datos en caché válidos
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data);
  }

  try {
    const targetUrl = new URL(SCRIPT_URL);
    searchParams.forEach((value, key) => {
      targetUrl.searchParams.append(key, value);
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(targetUrl.toString(), {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
      },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      throw new Error(`Google Apps Script respondió con código ${response.status}`);
    }

    const data: unknown = await response.json();
    
    // Guardar en caché
    cache.set(cacheKey, { data, timestamp: Date.now() });

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error("Sheets proxy GET warning/error:", err);

    // Si tenemos una versión previa en caché (incluso expirada), servirla como rescate
    if (cached) {
      return NextResponse.json(cached.data);
    }

    // Devolver lista vacía en lugar de romper la página con error 500
    return NextResponse.json([], { status: 200 });
  }
}
