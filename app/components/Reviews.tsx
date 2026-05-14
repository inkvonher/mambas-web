"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { content } from "../lib/content";

export default function Reviews() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section
      id="reviews"
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
            {t.reviews.title}
          </h2>
          <p className="text-gold text-sm sm:text-base tracking-widest uppercase">
            {t.reviews.subtitle}
          </p>
        </motion.div>

        {/* Placeholder for Google Reviews */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="p-8 hover:bg-gold/5 transition-all duration-300 rounded-lg group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-gold text-lg">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-300 text-sm mb-4 italic">
                {language === "es"
                  ? "Aquí aparecerán las reseñas de Google Maps..."
                  : "Google Maps reviews will appear here..."}
              </p>
              <p className="text-gold text-xs uppercase tracking-widest font-semibold">
                {language === "es" ? "Cliente" : "Client"} {i}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA to Google Reviews */}
        <motion.div
          className="text-center mt-12 sm:mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <a
            href="https://www.google.com/maps/search/Mambas+Tattoo+Playa+del+Carmen"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 border border-gold text-gold font-semibold tracking-widest uppercase text-sm hover:bg-gold hover:text-black transition-colors"
          >
            {language === "es" ? "Ver todas las opiniones" : "View all reviews"}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
