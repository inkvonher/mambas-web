import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = (process.env.SITE_URL || "https://mambas-web.vercel.app").replace(
  /\/$/,
  "",
);
const siteName = "Mambas Tattoo & Cuts";
const siteTitle =
  "Mambas Tattoo & Cuts | Tattoo, piercing y barbería en Playa del Carmen";
const siteDescription =
  "Estudio premium de tatuajes, piercing y barbería tradicional mexicana en el centro de Playa del Carmen, cerca del ferry a Cozumel. Certificados ante COFEPRIS.";
const address =
  "Calle 1 Sur esquina Av. 25 Sur, Centro, Playa del Carmen, Quintana Roo";
const ogImage = "/gallery/mbs3.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "tatuajes Playa del Carmen",
    "tattoo studio Playa del Carmen",
    "barbería Playa del Carmen",
    "barber shop Playa del Carmen",
    "piercing Playa del Carmen",
    "blackwork tattoo México",
    "barbería tradicional mexicana",
    "Mambas Tattoo & Cuts",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  category: "Tattoo studio and barbershop",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName,
    type: "website",
    locale: "es_MX",
    alternateLocale: ["en_US"],
    images: [
      {
        url: ogImage,
        width: 1061,
        height: 618,
        alt: `${siteName} en Playa del Carmen`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Mambas",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "1JcDDPcAvO6t7EzD_3q7R2kzMQnolG0_O4Er4x-arM4",
  },
  other: {
    "geo.region": "MX-ROO",
    "geo.placename": "Playa del Carmen",
    "geo.position": "20.623873555147917;-87.07942999344887",
    ICBM: "20.623873555147917, -87.07942999344887",
    "business:contact_data:street_address": address,
    "business:contact_data:locality": "Playa del Carmen",
    "business:contact_data:region": "Quintana Roo",
    "business:contact_data:country_name": "Mexico",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
