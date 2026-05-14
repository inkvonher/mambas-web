"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const portfolioItems = [
  {
    id: 1,
    title: "Geometric Visions",
    category: "Tattoo",
    image: "▲",
  },
  {
    id: 2,
    title: "Blackwork Mastery",
    category: "Tattoo",
    image: "■",
  },
  {
    id: 3,
    title: "Fine Lines",
    category: "Tattoo",
    image: "◇",
  },
  {
    id: 4,
    title: "Precision Fade",
    category: "Barber",
    image: "✂️",
  },
  {
    id: 5,
    title: "Abstract Flow",
    category: "Tattoo",
    image: "◆",
  },
  {
    id: 6,
    title: "Color Portrait",
    category: "Tattoo",
    image: "●",
  },
  {
    id: 7,
    title: "Clean Cuts",
    category: "Barber",
    image: "✨",
  },
  {
    id: 8,
    title: "Underground Art",
    category: "Tattoo",
    image: "◈",
  },
];

const categories = ["All", "Tattoo", "Barber"];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems =
    activeCategory === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

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
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section
      id="portfolio"
      className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-4 sm:mb-6">
            PORTFOLIO
          </h2>
          <p className="text-gray-400 text-sm sm:text-base tracking-widest uppercase">
            Gallery of premium work
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap gap-3 sm:gap-4 justify-center mb-12 sm:mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 text-sm font-semibold tracking-widest uppercase transition-all ${
                activeCategory === category
                  ? "bg-white text-black"
                  : "border border-gray-400 text-gray-400 hover:border-white hover:text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="group portfolio-item aspect-square bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-white transition-colors cursor-pointer relative"
              whileHover={{ scale: 1.02 }}
            >
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
                <div className="text-5xl sm:text-6xl opacity-60 group-hover:opacity-100 transition-opacity">
                  {item.image}
                </div>
                <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-white font-semibold text-sm sm:text-base">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-xs uppercase tracking-widest mt-1">
                    {item.category}
                  </p>
                </div>
              </div>

              {/* Hover overlay line animation */}
              <motion.div
                className="absolute inset-0 border border-white opacity-0"
                whileHover={{ opacity: 0.5 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
