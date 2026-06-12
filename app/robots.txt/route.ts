import { NextResponse } from "next/server";

const siteUrl = (process.env.SITE_URL || "https://mambas-web.vercel.app").replace(
  /\/$/,
  "",
);

export async function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Sitemap: ${siteUrl}/sitemap.xml
`;

  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
