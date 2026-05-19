import { NextResponse } from "next/server";

const siteUrl = process.env.SITE_URL || "https://mambas-web.vercel.app";

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
