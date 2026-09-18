import { NextResponse } from "next/server";

const siteUrl = (process.env.SITE_URL || "https://mambas-web.vercel.app").replace(
  /\/$/,
  "",
);
const lastModified = new Date().toISOString().split("T")[0];

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
      <image:title>Mambas Tattoo &amp; Cuts Playa del Carmen - Estudio y Barbería</image:title>
      <image:caption>Fachada de Mambas Tattoo and Cuts en el centro de Playa del Carmen cerca del ferry a Cozumel</image:caption>
    </image:image>
    <image:image>
      <image:loc>${siteUrl}/gallery/tattoo/tatuaje1.png</image:loc>
      <image:title>Tatuaje Blackwork de Pantera en Mambas Tattoo Playa del Carmen</image:title>
      <image:caption>Tatuaje personalizado estilo blackwork realizado en Playa del Carmen</image:caption>
    </image:image>
    <image:image>
      <image:loc>${siteUrl}/gallery/tattoo/tnew1.jpg</image:loc>
      <image:title>Tatuaje detallado en muslo por artista de Mambas Tattoo</image:title>
    </image:image>
    <image:image>
      <image:loc>${siteUrl}/gallery/tattoo/tatuaje2.png</image:loc>
      <image:title>Tatuaje de pecho con serpiente y cráneo por Mambas Tattoo</image:title>
    </image:image>
    <image:image>
      <image:loc>${siteUrl}/gallery/tattoo/piercing/piercing11.png</image:loc>
      <image:title>Body Piercing profesional con titanio grado implante en Playa del Carmen</image:title>
      <image:caption>Perforación corporal segura y estéril certificada ante COFEPRIS en Mambas</image:caption>
    </image:image>
    <image:image>
      <image:loc>${siteUrl}/gallery/barber/IMG_3036.jpg</image:loc>
      <image:title>Barbería tradicional mexicana en Playa del Carmen - Fade y Barba</image:title>
      <image:caption>Corte de cabello fade con trenzas y perfilado de barba en Mambas Barbería</image:caption>
    </image:image>
    <image:image>
      <image:loc>${siteUrl}/gallery/barber/barber11.png</image:loc>
      <image:title>Ritual de Barba con toalla caliente y navaja libre en Mambas</image:title>
    </image:image>
  </url>
  <url>
    <loc>${siteUrl}/privacidad</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
