import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";

export const metadata: Metadata = {
  title: "Mambas Tattoo & Cuts | Playa del Carmen",
  description:
    "Barbería tradicional mexicana, tatuajes rituales y piercing en Playa del Carmen. Registro de lealtad, precios, cotizador y contacto directo.",
  applicationName: "Mambas Tattoo & Cuts",
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
    <html
      lang="es"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
