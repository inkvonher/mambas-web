"use client";

import { motion } from "framer-motion";

const artists = [
  {
    name: "KENZO",
    title: "Tattoo Visionary",
    specialty: "Geometric & Blackwork",
    image: "🎨",
  },
  {
    name: "CIPHER",
    title: "Master Barber",
    specialty: "Precision Fades",
    image: "✂️",
  },
  {
    name: "VERA",
    title: "Fine Line Artist",
    specialty: "Abstract & Minimal",
    image: "✨",
  },
  {
    name: "NEXUS",
    title: "Color Specialist",
    specialty: "Portrait & Realism",
    image: "🎭",
  },
];

export default function Artists() {
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
      transition: { duration: 0.8 },
    },
  };

  return (
    <section
      id="artists"
      className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-black border-t border-b border-gray-800"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-4 sm:mb-6">
            THE COLLECTIVE
          </h2>
          <p className="text-gray-400 text-sm sm:text-base tracking-widest uppercase max-w-2xl mx-auto">
            Curated masters of the craft. Each artist brings their own vision
            and expertise.
          </p>
        </motion.div>

        {/* Artists Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {artists.map((artist) => (
            <motion.div
              key={artist.name}
              variants={itemVariants}
              className="group"
              whileHover={{ y: -5 }}
            >
              <div className="relative mb-6 overflow-hidden aspect-square bg-gradient-to-br from-gray-900 to-black border border-gray-800 group-hover:border-gray-700 transition-colors">
                {/* Background emoji */}
                <div className="absolute inset-0 flex items-center justify-center text-6xl sm:text-7xl opacity-20 group-hover:opacity-30 transition-opacity">
                  {artist.image}
                </div>

                {/* Overlay on hover */}
                <motion.div
                  className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.6 }}
                >
                  <button className="text-white text-sm font-semibold tracking-widest uppercase border border-white px-6 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Book {artist.name}
                  </button>
                </motion.div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  {artist.name}
                </h3>
                <p className="text-xs sm:text-sm tracking-widest uppercase text-gray-400">
                  {artist.title}
                </p>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {artist.specialty}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
