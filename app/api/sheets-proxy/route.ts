import { NextRequest, NextResponse } from "next/server";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRmqcIxfVpta89UlgPPN91qQse8-crJ-_Gvugdf9-1ithLE88ey0XOxzAnoFlhel0/exec";

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    
    // El servidor Node.js hace la petición a Google sin restricciones de CORS ni bloqueos de extensiones
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: bodyText,
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script respondió con código ${response.status}`);
    }

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { status: "success", message: responseText };
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Sheets proxy POST error:", err);
    return NextResponse.json(
      { status: "error", message: err.message || "Error al conectar con Google Sheets." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = new URL(SCRIPT_URL);
    
    // Copiar todos los parámetros de búsqueda del cliente al url de destino
    searchParams.forEach((value, key) => {
      targetUrl.searchParams.append(key, value);
    });

    const response = await fetch(targetUrl.toString(), {
      method: "GET",
      // Evitar almacenamiento en caché para obtener los datos más recientes
      headers: {
        "Cache-Control": "no-cache",
      }
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script respondió con código ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Sheets proxy GET error:", err);
    return NextResponse.json(
      { status: "error", message: err.message || "Error al conectar con Google Sheets." },
      { status: 500 }
    );
  }
}
