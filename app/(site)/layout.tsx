import type { ReactNode } from "react";

const siteUrl = (process.env.SITE_URL || "https://mambas-web.vercel.app").replace(
  /\/$/,
  "",
);
const siteName = "Mambas Tattoo & Cuts";
const siteDescription =
  "Estudio premium de tatuajes, piercing y barbería tradicional mexicana en el centro de Playa del Carmen, cerca del ferry a Cozumel. Certificados ante COFEPRIS.";
const ogImage = "/gallery/mbs3.jpg";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      inLanguage: ["es-MX", "en"],
      publisher: {
        "@id": `${siteUrl}/#business`,
      },
    },
    {
      "@type": ["LocalBusiness", "HealthAndBeautyBusiness"],
      "@id": `${siteUrl}/#business`,
      name: siteName,
      url: siteUrl,
      image: `${siteUrl}${ogImage}`,
      logo: `${siteUrl}/logo.png`,
      description: siteDescription,
      priceRange: "$$",
      telephone: ["+52 984 367 5261", "+52 984 182 0414"],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Calle 1 Sur esquina Av. 25 Sur",
        addressLocality: "Playa del Carmen",
        addressRegion: "Quintana Roo",
        addressCountry: "MX",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 20.62951,
        longitude: -87.07894,
      },
      areaServed: [
        "Playa del Carmen",
        "Riviera Maya",
        "Cozumel",
        "Quintana Roo",
      ],
      makesOffer: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Tatuajes personalizados",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Piercing",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Corte de cabello y ritual de barba",
          },
        },
      ],
      sameAs: [
        "https://www.instagram.com/mambas_barberia.pdc/",
        "https://www.instagram.com/mambas.tattoocuts/",
      ],
    },
  ],
};

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
