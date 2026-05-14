"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { content } from "../lib/content";

export default function Location() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section
      id="location"
      className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-black border-t border-gold/20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-4 sm:mb-6">
            {t.location.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Maps Placeholder */}
          <motion.div
            className="relative h-80 sm:h-96 lg:h-full min-h-96 bg-gray-900 overflow-hidden rounded-lg hover:bg-gray-800 transition-colors"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Placeholder for Google Maps embed */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gold text-lg font-bold mb-2">
                  📍 {t.location.mapsTitle}
                </p>
                <p className="text-gray-400 text-sm">Google Maps Integration</p>
                <p className="text-gray-500 text-xs mt-4 max-w-xs">
                  {t.location.address}
                </p>
              </div>
            </div>

            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <pattern
                    id="grid"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 10 0 L 0 0 0 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>
          </motion.div>

          {/* Address & Hours */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Address */}
            <div className="p-8 hover:bg-gold/5 transition-all duration-300 rounded-lg">
              <p className="text-gold text-sm font-bold tracking-widest uppercase mb-2">
                📍 {language === "es" ? "Dirección" : "Address"}
              </p>
              <p className="text-white text-lg font-semibold">
                {t.location.address}
              </p>
            </div>

            {/* Hours */}
            <div className="p-8 hover:bg-gold/5 transition-all duration-300 rounded-lg">
              <p className="text-gold text-sm font-bold tracking-widest uppercase mb-2">
                🕐 {language === "es" ? "Horario" : "Hours"}
              </p>
              <p className="text-white text-lg font-semibold">
                {language === "es" ? "Lunes - Sábado:" : "Monday - Saturday:"}{" "}
                12PM - 10PM
              </p>
              <p className="text-white text-lg font-semibold mt-2">
                {language === "es" ? "Domingo:" : "Sunday:"}{" "}
                {language === "es" ? "Cerrado" : "Closed"}
              </p>
            </div>

            {/* Directions CTA */}
            <motion.a
              href="https://maps.google.com/maps/search/Calle+1+Sur+Av+25+Sur+Playa+del+Carmen"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-8 hover:bg-gold/5 transition-all duration-300 text-center rounded-lg group"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-gold font-bold tracking-widest uppercase group-hover:text-white transition-colors">
                {language === "es" ? "Ver en Mapa" : "View on Map"}
              </p>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
