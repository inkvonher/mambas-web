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
      "@type": ["TattooParlor", "BarberShop", "HealthAndBeautyBusiness", "LocalBusiness"],
      "@id": `${siteUrl}/#business`,
      name: siteName,
      url: siteUrl,
      image: `${siteUrl}${ogImage}`,
      logo: `${siteUrl}/logo.png`,
      description: siteDescription,
      priceRange: "$$",
      currenciesAccepted: "MXN, USD",
      paymentAccepted: "Transferencia SPEI, Mercado Pago, Efectivo en tienda",
      telephone: ["+52 984 367 5261", "+52 984 182 0414"],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Calle 1 Sur esquina Av. 25 Sur, Colonia Centro",
        addressLocality: "Playa del Carmen",
        addressRegion: "Quintana Roo",
        postalCode: "77710",
        addressCountry: "MX",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 20.623873555147917,
        longitude: -87.07942999344887,
      },
      hasMap: "https://www.google.com/maps/search/?api=1&query=Mambas%20Tattoo%20%26%20Cuts%20Calle%201%20Sur%20Av.%2025%20Sur%20Playa%20del%20Carmen",
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
        {
          "@type": "City",
          name: "Playa del Carmen",
        },
        {
          "@type": "AdministrativeArea",
          name: "Riviera Maya",
        },
        {
          "@type": "AdministrativeArea",
          name: "Quintana Roo",
        },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Servicios Mambas Tattoo & Cuts",
        itemListElement: [
          {
            "@type": "OfferCatalog",
            name: "Servicios de Barbería Tradicional",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Corte de cabello",
                  description: "Corte clásico, degradado / fade, asesoría de imagen y lavado.",
                },
                price: "320",
                priceCurrency: "MXN",
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Ritual de barba Mambas",
                  description: "Tratamiento de toalla caliente aromatizada, navaja libre y bálsamo refrescante.",
                },
                price: "290",
                priceCurrency: "MXN",
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Servicio VIP",
                  description: "Corte completo, ritual de barba, toalla caliente y facial purificante.",
                },
                price: "900",
                priceCurrency: "MXN",
              },
            ],
          },
          {
            "@type": "OfferCatalog",
            name: "Servicios de Tatuaje y Piercing",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Tatuaje personalizado (Precio mínimo)",
                  description: "Tatuaje en estilos blackwork, fineline, microrealismo o tradicional. Material 100% estéril desechable COFEPRIS.",
                },
                price: "1600",
                priceCurrency: "MXN",
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Sesión completa de tatuaje (4-5 hrs)",
                  description: "Sesión intensiva para piezas medianas o grandes y proyectos detallados.",
                },
                price: "6500",
                priceCurrency: "MXN",
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Body Piercing (Facial / Corporal)",
                  description: "Perforación con aguja estéril y joyería biocompatible en titanio grado implante ASTM F-136.",
                },
                price: "550",
                priceCurrency: "MXN",
              },
            ],
          },
          {
            "@type": "OfferCatalog",
            name: "Tienda Oficial y Aftercare Mambas",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Product",
                  name: "Bálsamo Cicatrizante Tattoo Mambas (50g)",
                  description: "Fórmula 100% orgánica y vegana con caléndula, karité y vitamina E.",
                },
                price: "220",
                priceCurrency: "MXN",
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Product",
                  name: "Espuma Limpiadora Antiséptica Foam Soap (150ml)",
                  description: "Jabón antibacteriano en espuma para higiene de tatuajes y piercings.",
                },
                price: "180",
                priceCurrency: "MXN",
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Product",
                  name: "Playera Mambas 'Black & Gold' (Edición 2026)",
                  description: "Algodón peinado premium de 240g con serigrafía dorada de alta densidad.",
                },
                price: "450",
                priceCurrency: "MXN",
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Product",
                  name: "Argolla Clicker Titanio ASTM F-136",
                  description: "Joyería estéril de titanio grado implante biocompatible.",
                },
                price: "350",
                priceCurrency: "MXN",
              },
            ],
          },
        ],
      },
      sameAs: [
        "https://www.instagram.com/mambas_barberia.pdc/",
        "https://www.instagram.com/mambas.tattoocuts/",
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5.0",
        reviewCount: "48",
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
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Dónde está ubicado el estudio Mambas Tattoo & Cuts en Playa del Carmen?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Estamos ubicados en Calle 1 Sur esquina con Avenida 25 Sur, en el Centro de Playa del Carmen, Quintana Roo (C.P. 77710), a solo 5 minutos caminando de la terminal del ferry a Cozumel y a 3 cuadras de la Quinta Avenida.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuánto cuesta un tatuaje o corte de barbería en Mambas?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "El precio mínimo para tatuajes es de $1,600 MXN ($100 USD) y la sesión de 4 a 5 horas es de $6,500 MXN ($400 USD). El corte de cabello en barbería cuesta $320 MXN ($20 USD) y el ritual de barba con toalla caliente cuesta $290 MXN ($18 USD).",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué normas de higiene y certificaciones sanitarias tienen?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "El estudio cuenta con certificación oficial de COFEPRIS (Reg. Sanitario 33/TT0467/2024, Responsable Sanitario: Karen Muñoz González). Todo el material punzocortante es nuevo, estéril y 100% desechable de un solo uso. La joyería de piercing es de titanio grado implante ASTM F-136.",
          },
        },
        {
          "@type": "Question",
          name: "¿Aceptan clientes sin cita previa (walk-ins)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí, aceptamos walk-ins según la disponibilidad del día para cortes de barbería, piercings y tatuajes pequeños. Para piezas medianas o grandes se recomienda reservar vía WhatsApp al +52 984 367 5261.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué métodos de pago aceptan?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Aceptamos transferencias bancarias SPEI, Mercado Pago y pago directo en efectivo en nuestro estudio en Playa del Carmen.",
          },
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
