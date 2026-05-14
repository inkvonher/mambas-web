"use client";

import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { content } from "../lib/content";

export default function Hero() {
  const { language } = useLanguage();
  const t = content[language];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center"
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(212,175,55,0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(212,175,55,0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(212,175,55,0.05) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div
          variants={itemVariants}
          className="mb-8 sm:mb-12 flex justify-center"
        >
          <img
            src="/logo.png"
            alt="Mambas Tattoo & Cuts"
            className="h-32 sm:h-40 lg:h-48 w-auto opacity-95"
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-gold text-xs sm:text-sm tracking-[0.3em] uppercase mb-8 sm:mb-12"
        >
          {t.hero.subtitle}
        </motion.p>

        {/* Main Headline */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-none mb-4">
            {t.hero.title}
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-gray-300 text-sm sm:text-base max-w-lg mx-auto mb-8 sm:mb-12 leading-relaxed"
        >
          {t.hero.description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
        >
          <motion.button
            onClick={() =>
              document
                .getElementById("barberia")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3 sm:py-4 bg-gold text-black font-semibold tracking-widest uppercase text-sm hover:bg-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.hero.cta}
          </motion.button>
          <motion.button
            onClick={() =>
              document
                .getElementById("tattoo")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3 sm:py-4 border border-gold text-gold font-semibold tracking-widest uppercase text-sm hover:bg-gold hover:text-black transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            TATTOO & PIERCING
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
