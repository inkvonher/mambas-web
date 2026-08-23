import { NextResponse } from "next/server";

const siteUrl = (process.env.SITE_URL || "https://mambaspdc.com").replace(
  /\/$/,
  "",
);

export async function GET() {
  const skillsIndex = {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: [
      {
        name: "mambas-booking-and-info",
        type: "skill-md",
        description:
          "Información, consulta de servicios y asistencia para agendar citas en Mambas Tattoo & Cuts (Playa del Carmen)",
        url: `${siteUrl}/.well-known/agent-skills/booking/SKILL.md`,
        digest:
          "sha256:305b2259bfc583ae7aebbc5585458cffd603531f58dabe1f5cd3b40b4b323b75",
      },
    ],
  };

  return NextResponse.json(skillsIndex, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
