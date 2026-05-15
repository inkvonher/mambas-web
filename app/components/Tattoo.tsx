"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { content } from "../lib/content";

export default function Tattoo() {
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
      id="tattoo"
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
            {t.tattoo.title}
          </h2>
          <p className="text-gold text-lg sm:text-2xl tracking-widest uppercase mb-4">
            {t.tattoo.slogan}
          </p>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
            {t.tattoo.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 mb-12 sm:mb-16">
          {/* Tattoo Services */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gold mb-8 tracking-widest uppercase">
              TATTOO
            </h3>
            <div className="space-y-6">
              {t.tattoo.tattooServices.map((service, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="p-6 sm:p-8 hover:bg-gold/5 transition-all duration-300 rounded-lg group"
                  whileHover={{ x: 10, scale: 1.02 }}
                >
                  <h4 className="text-white font-semibold text-base sm:text-lg mb-2 group-hover:text-gold transition-colors">
                    {service.name}
                  </h4>
                  <p className="text-gold text-sm sm:text-base font-bold">
                    {service.price}
                  </p>
                </motion.div>
              ))}
              <p className="text-gray-400 text-sm italic pt-4">
                {t.tattoo.tattooNote}
              </p>
            </div>
          </motion.div>

          {/* Piercing Services */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gold mb-8 tracking-widest uppercase">
              PIERCING
            </h3>
            <div className="space-y-6">
              {t.tattoo.pierceServices.map((service, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="p-6 sm:p-8 hover:bg-gold/5 transition-all duration-300 rounded-lg group"
                  whileHover={{ x: 10, scale: 1.02 }}
                >
                  <h4 className="text-white font-semibold text-base sm:text-lg mb-2 group-hover:text-gold transition-colors">
                    {service.name}
                  </h4>
                  <p className="text-gold text-sm sm:text-base font-bold">
                    {service.price}
                  </p>
                </motion.div>
              ))}
              <p className="text-gray-400 text-sm italic pt-4">
                {t.tattoo.pierceNote}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Contact Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <a
            href={`https://wa.me/${t.tattoo.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 sm:py-4 bg-gold text-black font-semibold tracking-widest uppercase text-sm hover:bg-white transition-colors"
          >
            WhatsApp
          </a>
          <a
            href={t.tattoo.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 sm:py-4 border border-gold text-gold font-semibold tracking-widest uppercase text-sm hover:bg-gold hover:text-black transition-colors"
          >
            Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}
