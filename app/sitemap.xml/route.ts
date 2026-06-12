import { NextResponse } from "next/server";

const siteUrl = (process.env.SITE_URL || "https://mambas-web.vercel.app").replace(
  /\/$/,
  "",
);
const lastModified = "2026-06-01";

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${siteUrl}/gallery/mbs3.jpg</image:loc>
      <image:title>Mambas Tattoo &amp; Cuts Playa del Carmen</image:title>
    </image:image>
    <image:image>
      <image:loc>${siteUrl}/gallery/tattoo/tatuaje1.png</image:loc>
      <image:title>Tatuaje blackwork en Mambas Tattoo</image:title>
    </image:image>
    <image:image>
      <image:loc>${siteUrl}/gallery/barber/IMG_3036.jpg</image:loc>
      <image:title>Barbería Mambas en Playa del Carmen</image:title>
    </image:image>
  </url>
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
