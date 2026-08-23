import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "llms-full.txt");
    const content = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, "utf-8")
      : `# Mambas Tattoo & Cuts\n\nEstudio de tatuajes, piercing y barbería tradicional mexicana en Playa del Carmen.`;

    // Approximate token count (~4 characters per token)
    const tokenCount = Math.ceil(content.length / 4);

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "x-markdown-tokens": tokenCount.toString(),
        "Vary": "Accept",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch {
    return new NextResponse("Error generating markdown content", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
