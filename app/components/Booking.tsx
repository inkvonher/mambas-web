"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Booking() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    artist: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      artist: "",
      message: "",
    });
  };

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
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      id="booking"
      className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-black border-t border-gray-800"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-4 sm:mb-6">
            GET INKED
          </h2>
          <p className="text-gray-400 text-sm sm:text-base tracking-widest uppercase">
            Secure your spot in our studio
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 sm:space-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Name */}
            <motion.div variants={itemVariants}>
              <label className="block text-white font-semibold text-sm mb-3 tracking-widest uppercase">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-black border border-gray-800 text-white px-4 py-3 focus:border-white focus:outline-none transition-colors"
                placeholder="Your name"
              />
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="block text-white font-semibold text-sm mb-3 tracking-widest uppercase">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-black border border-gray-800 text-white px-4 py-3 focus:border-white focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </motion.div>

            {/* Phone */}
            <motion.div variants={itemVariants}>
              <label className="block text-white font-semibold text-sm mb-3 tracking-widest uppercase">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-black border border-gray-800 text-white px-4 py-3 focus:border-white focus:outline-none transition-colors"
                placeholder="+1 (555) 123-4567"
              />
            </motion.div>

            {/* Service */}
            <motion.div variants={itemVariants}>
              <label className="block text-white font-semibold text-sm mb-3 tracking-widest uppercase">
                Service
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full bg-black border border-gray-800 text-white px-4 py-3 focus:border-white focus:outline-none transition-colors cursor-pointer"
              >
                <option value="">Select a service</option>
                <option value="tattoo">Tattoo</option>
                <option value="barber">Barber</option>
                <option value="both">Both</option>
              </select>
            </motion.div>

            {/* Artist */}
            <motion.div variants={itemVariants}>
              <label className="block text-white font-semibold text-sm mb-3 tracking-widest uppercase">
                Preferred Artist
              </label>
              <select
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                required
                className="w-full bg-black border border-gray-800 text-white px-4 py-3 focus:border-white focus:outline-none transition-colors cursor-pointer"
              >
                <option value="">Select an artist</option>
                <option value="kenzo">KENZO</option>
                <option value="cipher">CIPHER</option>
                <option value="vera">VERA</option>
                <option value="nexus">NEXUS</option>
              </select>
            </motion.div>
          </div>

          {/* Message */}
          <motion.div variants={itemVariants}>
            <label className="block text-white font-semibold text-sm mb-3 tracking-widest uppercase">
              Design Details / Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full bg-black border border-gray-800 text-white px-4 py-3 focus:border-white focus:outline-none transition-colors resize-none"
              placeholder="Tell us about your vision..."
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="flex gap-4 pt-4">
            <motion.button
              type="submit"
              className="flex-1 px-8 py-4 bg-white text-black font-semibold tracking-widest uppercase text-sm hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Submit Booking Request
            </motion.button>
          </motion.div>

          {/* Success Message */}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-green-900 border border-green-600 text-green-100 text-center text-sm"
            >
              ✓ Booking request submitted! We&apos;ll contact you within 24 hours.
            </motion.div>
          )}
        </motion.form>
      </div>
    </section>
  );
}
