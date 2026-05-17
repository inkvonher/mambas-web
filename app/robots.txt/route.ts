import { NextResponse } from "next/server";

const siteUrl = process.env.SITE_URL || "http://localhost:3000";

export async function GET() {
  const robots = `User-agent: *
Allow: /
Sitemap: ${siteUrl}/sitemap.xml

# Directives for crawlers
Host: ${siteUrl}`;

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
