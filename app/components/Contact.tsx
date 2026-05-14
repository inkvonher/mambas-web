"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { content } from "../lib/content";

export default function Contact() {
  const { language } = useLanguage();
  const t = content[language];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      id="contact"
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
            {t.contact.title}
          </h2>
          <p className="text-gold text-sm sm:text-base tracking-widest uppercase">
            {t.contact.subtitle}
          </p>
        </motion.div>

        {/* WhatsApp CTAs */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 max-w-2xl mx-auto mb-16 sm:mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Barbería WhatsApp */}
          <motion.a
            href={`https://wa.me/${t.barberia.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            variants={itemVariants}
            className="p-8 hover:bg-gold/5 transition-all duration-300 text-center group rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-4xl mb-4">💈</p>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors">
              {t.contact.barberaButton}
            </h3>
            <p className="text-gold font-semibold tracking-widest">
              +52 984 367 5261
            </p>
            <p className="text-gray-400 text-xs mt-2 uppercase tracking-wide">
              WhatsApp
            </p>
          </motion.a>

          {/* Tattoo WhatsApp */}
          <motion.a
            href={`https://wa.me/${t.tattoo.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            variants={itemVariants}
            className="p-8 hover:bg-gold/5 transition-all duration-300 text-center group rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-4xl mb-4">🎨</p>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors">
              {t.contact.tattooButton}
            </h3>
            <p className="text-gold font-semibold tracking-widest">
              +52 984 182 0414
            </p>
            <p className="text-gray-400 text-xs mt-2 uppercase tracking-wide">
              WhatsApp
            </p>
          </motion.a>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-30 mb-12 sm:mb-16"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        {/* Footer */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">
            {t.footer.copyright}
          </p>
          <p className="text-gold text-xs uppercase tracking-widest">
            ✓ {t.footer.certified}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
