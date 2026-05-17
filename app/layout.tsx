import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";

const siteUrl = process.env.SITE_URL || "http://localhost:3000";

export const metadataBase = new URL(siteUrl);

export const metadata: Metadata = {
  title: "Mambas Tattoo & Cuts | Tattoo Studio & Barbería in Playa del Carmen",
  description:
    "Premium tattoo studio, traditional Mexican barbershop and piercing space located in the heart of Playa del Carmen near the Cozumel ferry.",
  applicationName: "Mambas Tattoo & Cuts",
  keywords: [
    "Tattoo Studio Playa del Carmen",
    "Barbería Playa del Carmen",
    "Tattoo Shop Playa del Carmen",
    "Piercing Playa del Carmen",
    "Blackwork Tattoo Mexico",
    "Traditional Mexican Barbershop",
  ],
  openGraph: {
    title:
      "Mambas Tattoo & Cuts | Tattoo Studio & Barbería in Playa del Carmen",
    description:
      "Premium tattoo studio, traditional Mexican barbershop and piercing space located in the heart of Playa del Carmen near the Cozumel ferry.",
    url: siteUrl,
    siteName: "Mambas Tattoo & Cuts",
    type: "website",
    locale: "es_MX",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 1200,
        alt: "Mambas Tattoo & Cuts logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Mambas Tattoo & Cuts | Tattoo Studio & Barbería in Playa del Carmen",
    description:
      "Premium tattoo studio, traditional Mexican barbershop and piercing space located in the heart of Playa del Carmen near the Cozumel ferry.",
    images: ["/logo.png"],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Mambas",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
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
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
