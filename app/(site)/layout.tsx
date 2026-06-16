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
        latitude: 20.623873555147917,
        longitude: -87.07942999344887,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "09:00",
          closes: "21:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Sunday",
          opens: "12:00",
          closes: "21:00",
        },
      ],
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
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5.0",
        reviewCount: "6",
        bestRating: "5",
        worstRating: "1",
      },
      review: [
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Lorena Rosas" },
          datePublished: "2025-06-01",
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5",
          },
          reviewBody:
            "Super recomendado, ya me he tatuado ahí varias veces y todo súper bien. También los servicios de barbería excelentes.",
        },
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Iván Castellón" },
          datePublished: "2025-06-01",
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5",
          },
          reviewBody:
            "A todos mis amigos y conocidos les recomiendo rayarse ahí. Solo iba por un tatuaje y ya llevo 10, y no cambio ese estudio para nada. Qué buen trabajo.",
        },
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Javier Monroy" },
          datePublished: "2023-06-01",
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5",
          },
          reviewBody:
            "El lugar siempre se encuentra limpio y fresco, las personas que trabajan ahí son super amables y atentos. Excelentes personas y un servicio increíble.",
        },
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Marlon Benítez" },
          datePublished: "2025-06-01",
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5",
          },
          reviewBody:
            "Quedé muy feliz con mis tatuajes. La calidad del trabajo es excelente, con un ambiente cómodo y servicio muy ameno. No puedo esperar para regresar.",
        },
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Didiel Estrella" },
          datePublished: "2025-06-01",
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5",
          },
          reviewBody:
            "Muy buenos. La chica Karen es excelente, amé mi tatuaje. Muy limpio y todo higiénico con las herramientas.",
        },
        {
          "@type": "Review",
          author: { "@type": "Person", name: "Alex Pérez" },
          datePublished: "2022-06-01",
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5",
          },
          reviewBody:
            "¡Definitivamente el mejor lugar de Playa para tener el mejor look! Atendido por la mismísima Yam, quien es una experta y cada corte lo convierte en una obra de arte.",
        },
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
