"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { content } from "../lib/content";

export default function Loyalty() {
  const { language } = useLanguage();
  const t = content[language];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
      id="loyalty"
      className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-black border-t border-gold/20"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-4 sm:mb-6">
            {t.loyalty.title}
          </h2>
          <p className="text-gold text-lg sm:text-2xl tracking-widest uppercase">
            {t.loyalty.slogan}
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {t.loyalty.benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-6 sm:p-8 hover:bg-gold/5 transition-all duration-300 rounded-lg group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start gap-4">
                <div className="text-gold text-2xl mt-1 group-hover:scale-110 transition-transform">✓</div>
                <p className="text-white text-base sm:text-lg font-semibold group-hover:text-gold transition-colors">
                  {benefit}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* About Section */}
        <motion.div
          className="p-8 sm:p-12 hover:bg-gold/5 transition-all duration-300 rounded-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-gold mb-4 tracking-widest uppercase">
            {t.about.title}
          </h3>
          <p className="text-gray-300 mb-6 text-base leading-relaxed">
            {t.about.description}
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-30 my-6" />
          <p className="text-gold text-sm sm:text-base tracking-wide italic">
            {t.about.inclusive}
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12 sm:mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="px-8 py-4 sm:py-5 bg-gold text-black font-semibold tracking-widest uppercase text-sm sm:text-base hover:bg-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.loyalty.cta}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
