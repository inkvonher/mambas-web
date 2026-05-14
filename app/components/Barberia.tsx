"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { content } from "../lib/content";

export default function Barberia() {
  const { language } = useLanguage();
  const t = content[language];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section
      id="barberia"
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
            {t.barberia.title}
          </h2>
          <p className="text-gold text-lg sm:text-2xl tracking-widest uppercase mb-4">
            {t.barberia.slogan}
          </p>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
            {t.barberia.description}
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {t.barberia.services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group p-6 sm:p-8 hover:bg-gold/5 transition-all duration-300 rounded-lg"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <h3 className="text-white font-semibold text-base sm:text-lg mb-2 group-hover:text-gold transition-colors">
                {service.name}
              </h3>
              <p className="text-gold text-sm sm:text-base font-bold">
                {service.price}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Note */}
        <motion.p
          className="text-center text-gray-400 text-sm mb-8 italic"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {t.barberia.note}
        </motion.p>

        {/* Contact Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <a
            href={`https://wa.me/${t.barberia.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 sm:py-4 bg-gold text-black font-semibold tracking-widest uppercase text-sm hover:bg-white transition-colors"
          >
            WhatsApp
          </a>
          <a
            href={`https://instagram.com/${t.barberia.instagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 sm:py-4 border border-gold text-gold font-semibold tracking-widest uppercase text-sm hover:bg-gold hover:text-black transition-colors"
          >
            {t.barberia.instagram}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
