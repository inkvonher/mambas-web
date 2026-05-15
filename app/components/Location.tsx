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
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-4 sm:mb-6">
            UBICACIÓN / LOCATION
          </h2>
          <p className="text-gold text-sm sm:text-base tracking-widest uppercase">
            {language === "es" ? "Encuéntranos" : "Visit Us"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Google Maps Section */}
          <motion.div
            className="relative group"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Premium Container */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-gold/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />

            {/* Map Container */}
            <div className="relative bg-black rounded-2xl overflow-hidden border border-gold/30 group-hover:border-gold transition-all duration-300 shadow-2xl">
              {/* Responsive iframe wrapper */}
              <div className="relative w-full aspect-[16/10] bg-gray-800">
                <iframe
                  title="Mambas Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.3456123456!2d-87.07894!3d20.62951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4e5a8c8c8c8c8d%3A0x8c8c8c8c8c8c8c8c!2sCalle%201%20Sur%20%26%20Av.%2025%20Sur%2C%20Centro%2C%20Playa%20del%20Carmen%2C%20Quintana%20Roo!5e0!3m2!1sen!2smx!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, position: "absolute", inset: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Overlay gradient on hover */}
              <motion.div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Decorative corner accents */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-gold/40 rounded-tl-lg group-hover:border-gold transition-colors duration-300" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-gold/40 rounded-tr-lg group-hover:border-gold transition-colors duration-300" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-gold/40 rounded-bl-lg group-hover:border-gold transition-colors duration-300" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-gold/40 rounded-br-lg group-hover:border-gold transition-colors duration-300" />
          </motion.div>

          {/* Address, Hours & Button Section */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Address Card */}
            <motion.div
              className="relative group/card p-8 rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent hover:from-gold/10 hover:border-gold/40 transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/5 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <p className="text-gold text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                  <span className="text-lg">📍</span>
                  {language === "es" ? "Dirección" : "Address"}
                </p>
                <p className="text-white text-lg font-semibold leading-relaxed">
                  {t.location.address}
                </p>
              </div>
            </motion.div>

            {/* Hours Card */}
            <motion.div
              className="relative group/card p-8 rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent hover:from-gold/10 hover:border-gold/40 transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/5 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <p className="text-gold text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                  <span className="text-lg">🕐</span>
                  {language === "es" ? "Horario" : "Hours"}
                </p>
                <div className="space-y-2">
                  <p className="text-white text-base font-semibold">
                    {language === "es"
                      ? "Lunes - Sábado:"
                      : "Monday - Saturday:"}{" "}
                    <span className="text-gold">12PM - 10PM</span>
                  </p>
                  <p className="text-white text-base font-semibold">
                    {language === "es" ? "Domingo:" : "Sunday:"}{" "}
                    <span className="text-gold">
                      {language === "es" ? "Cerrado" : "Closed"}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Directions Button */}
            <motion.a
              href="https://www.google.com/maps/dir/?api=1&destination=Calle+1+Sur+Av+25+Sur+Playa+del+Carmen"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center justify-center w-full group/btn mt-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-gold/10 rounded-xl blur opacity-75 group-hover/btn:opacity-100 group-hover/btn:blur-md transition-all duration-300" />
              <div className="relative w-full px-8 py-4 bg-black border-2 border-gold/40 rounded-xl hover:border-gold transition-all duration-300 text-center">
                <p className="text-gold font-bold tracking-widest uppercase text-sm group-hover/btn:text-white transition-colors">
                  {language === "es" ? "🗺️ Cómo llegar" : "🗺️ Get Directions"}
                </p>
              </div>
            </motion.a>

            {/* Info Text */}
            <motion.p
              className="text-gray-400 text-sm italic pt-4 text-center lg:text-left"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              {language === "es"
                ? "¡Estamos justo en el corazón de Playa del Carmen, a pasos del centro histórico!"
                : "We're right in the heart of Playa del Carmen, steps from the historic center!"}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
