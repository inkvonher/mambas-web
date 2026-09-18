"use client";

import { useEffect } from "react";

export default function WebMcpProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Suppress unhandled errors originated from browser extensions (MetaMask, Phantom, etc.)
    const isExtensionError = (err: unknown, filename?: string) => {
      const errStr = typeof err === "object" && err !== null ? (err as Error).message || String(err) : String(err || "");
      const fileStr = String(filename || "");
      return (
        errStr.toLowerCase().includes("metamask") ||
        errStr.includes("chrome-extension://") ||
        errStr.includes("moz-extension://") ||
        fileStr.includes("chrome-extension://") ||
        fileStr.includes("moz-extension://")
      );
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isExtensionError(event.reason)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    const handleError = (event: ErrorEvent) => {
      if (isExtensionError(event.error, event.filename)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    // WebMCP Tool Registration for AI Browser Agents
    const nav = navigator as unknown as {
      modelContext?: {
        registerTool?: (tool: {
          name: string;
          description: string;
          inputSchema: Record<string, unknown>;
          execute: (args: Record<string, unknown>) => Promise<unknown> | unknown;
        }) => void;
        provideContext?: (context: unknown) => void;
      };
    };

    if (nav.modelContext) {
      try {
        if (typeof nav.modelContext.provideContext === "function") {
          nav.modelContext.provideContext({
            siteName: "Mambas Tattoo & Cuts",
            location: "Calle 1 Sur esquina Av. 25 Sur, Centro, Playa del Carmen",
            services: ["Tatuajes", "Piercing", "Barbería Tradicional"],
            phone: "+52 984 367 5261",
            whatsapp: "https://wa.me/529843675261",
          });
        }

        if (typeof nav.modelContext.registerTool === "function") {
          nav.modelContext.registerTool({
            name: "get_mambas_studio_info",
            description:
              "Obtiene información de ubicación, servicios y citas de Mambas Tattoo & Cuts en Playa del Carmen.",
            inputSchema: {
              type: "object",
              properties: {},
            },
            execute: async () => ({
              name: "Mambas Tattoo & Cuts",
              city: "Playa del Carmen, Quintana Roo",
              address: "Calle 1 Sur esquina Av. 25 Sur, Centro",
              landmark: "A 5 minutos a pie del ferry a Cozumel",
              services: [
                "Tatuajes personalizados (Blackwork, Fineline, Realismo)",
                "Body Piercing con titanio grado implante (COFEPRIS)",
                "Barbería tradicional mexicana (Ritual de toalla caliente y navaja)",
              ],
              phone: "+52 984 367 5261",
              whatsappUrl: "https://wa.me/529843675261",
            }),
          });
        }
      } catch {
        // Fallback silently if unsupported
      }
    }

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null;
}
