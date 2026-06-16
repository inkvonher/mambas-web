"use client";

import { useEffect } from "react";

// Adds subtle fade-up entrances to each section as it scrolls into view.
// Hidden state is applied via JS (not base CSS), so content stays visible
// for no-JS / SEO crawlers and reduced-motion users.
export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main > section"),
    );
    // Skip the first section (hero) so it shows immediately.
    const targets = sections.slice(1);
    targets.forEach((el) => el.classList.add("reveal-init"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            entry.target.classList.remove("reveal-init");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
