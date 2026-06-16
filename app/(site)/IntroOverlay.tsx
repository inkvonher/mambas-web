"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Brand intro: shows the Mambas logo once per session, then fades out to
// reveal the site. Skipped for returning sessions and reduced-motion users.
export default function IntroOverlay() {
  const [show, setShow] = useState(true);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const seen =
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem("mambas-intro-seen");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (seen || reduceMotion) {
      const skip = setTimeout(() => setShow(false), 0);
      return () => clearTimeout(skip);
    }

    document.body.style.overflow = "hidden";
    const startFade = setTimeout(() => setHide(true), 1600);
    const remove = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("mambas-intro-seen", "1");
      document.body.style.overflow = "";
    }, 2250);

    return () => {
      clearTimeout(startFade);
      clearTimeout(remove);
      document.body.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`intro-overlay${hide ? " intro-hide" : ""}`}
      aria-hidden="true"
    >
      <div className="intro-logo">
        <Image
          src="/logo.png"
          alt=""
          width={200}
          height={200}
          priority
          className="h-44 w-44 object-contain"
        />
      </div>
    </div>
  );
}
