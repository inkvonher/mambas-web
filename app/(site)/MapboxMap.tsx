"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const LNG = -87.07942999344887;
const LAT = 20.623873555147917;

export default function MapboxMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [LNG, LAT],
      zoom: 15.2,
      cooperativeGestures: true, // avoids hijacking page scroll on mobile
    });

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-right",
    );

    const popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML(
        `<div style="color: black; padding: 4px;">
          <h4 style="font-weight: 900; margin: 0 0 4px 0; font-size: 13px; text-transform: uppercase; tracking: 0.05em; color: #111;">Mambas Tattoo & Cuts</h4>
          <p style="margin: 0; font-size: 11px; color: #555; line-height: 1.4;">Calle 1 Sur esquina Av. 25 Sur<br/>Playa del Carmen, Q.R.</p>
        </div>`
      );

    new mapboxgl.Marker({ color: "#d6ad4a" })
      .setLngLat([LNG, LAT])
      .setPopup(popup)
      .addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-2xl border border-[#d6ad4a]/20 sm:h-[380px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <style>{`
        .mapboxgl-ctrl-logo,
        .mapboxgl-ctrl-attrib {
          display: none !important;
        }
      `}</style>
      <div
        ref={containerRef}
        className="h-full w-full"
        aria-label="Mapa de Mambas Tattoo & Cuts"
      />
    </div>
  );
}
