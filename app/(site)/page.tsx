"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import MapboxMap from "./MapboxMap";
import IntroOverlay from "./IntroOverlay";
import { motion, AnimatePresence } from "framer-motion";

import {
  type Language,
  type ServiceMode,
  type GalleryItem,
  copy,
  barberServices,
  tattooPrices,
  reviews,
  contacts,
  googleMapsUrl,
  depositPaymentUrl,
  barberBookingUrl,
  barberGallery,
  tattooGallery,
} from "./data";

export default function Home() {
  const [language, setLanguage] = useState<Language>("es");
  const [mode, setMode] = useState<ServiceMode>("barber");
  const [saved, setSaved] = useState(false);
  const [centimeters, setCentimeters] = useState(3);
  const [detail, setDetail] = useState(1);
  const [zone, setZone] = useState(1);
  const [copied, setCopied] = useState(false);
  const [floatingOpen, setFloatingOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const walletAddress = "0x620D311425385e60743a2e9f3cE0e476E07cdCA1";
  const t = copy[language];

  const tattooEstimate = useMemo(() => {
    const extraCentimeters = Math.max(centimeters - 10, 0);
    const calculated =
      1600 + extraCentimeters * 110 + (detail - 1) * 450 + (zone - 1) * 250;
    return Math.min(Math.max(Math.round(calculated / 50) * 50, 1600), 6500);
  }, [centimeters, detail, zone]);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const day = formData.get("birthdayDay");
    const month = formData.get("birthdayMonth");
    const birthday = day && month ? `2000-${month}-${day}` : null;

    const payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      birthday,
      interest: formData.get("interest"),
      company: formData.get("company"), // honeypot, must stay empty
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        alert(
          data.error ||
            (language === "es"
              ? "No se pudo guardar el registro. Inténtalo de nuevo."
              : "We could not save the registration. Please try again."),
        );
        return;
      }
    } catch {
      alert(
        language === "es"
          ? "No se pudo conectar. Revisa tu conexión e inténtalo de nuevo."
          : "Connection failed. Check your network and try again.",
      );
      return;
    }

    setSaved(true);
    form.reset();
  }

  function scrollTo(id: string) {
    setActiveSection(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <IntroOverlay />
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#d6ad4a]/20 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => scrollTo("inicio")}
            className="flex items-center gap-3"
          >
            <Image
              src="/logo.png"
              alt="Mambas Tattoo & Cuts"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <span className="hidden text-xs font-bold tracking-[0.28em] text-[#d6ad4a] sm:block">
              MAMBAS
            </span>
          </button>
          <nav
            aria-label="Primary site navigation"
            className="hidden items-center gap-6 lg:flex"
          >
            {["inicio", "barberia", "tattoo", "anticipo", "lealtad", "ubicacion"].map(
              (id, index) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`text-[11px] font-semibold uppercase tracking-[0.22em] transition ${
                    activeSection === id
                      ? "text-[#d6ad4a] border-b border-[#d6ad4a]/50 pb-0.5"
                      : "text-zinc-300 hover:text-[#d6ad4a]"
                  }`}
                >
                  {t.nav[index]}
                </button>
              ),
            )}
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === "es" ? "en" : "es")}
              className="border border-[#d6ad4a] px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d6ad4a] transition hover:bg-[#d6ad4a] hover:text-black"
            >
              {language === "es" ? "EN" : "ES"}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={language === "es" ? "Abrir menú" : "Open menu"}
              className="menu-pulse-button relative flex h-10 w-10 items-center justify-center rounded-full border border-[#d6ad4a]/30 bg-[#070707]/60 text-[#d6ad4a] transition-all duration-300 hover:scale-105 hover:bg-[#d6ad4a]/10 focus:outline-none lg:hidden shadow-[0_0_12px_rgba(214,173,74,0.18)] active:scale-95"
            >
              <div className="flex h-5 w-5 flex-col justify-between items-end">
                <span
                  className={`h-0.5 rounded-full bg-gradient-to-r from-[#d6ad4a] to-[#f3d27a] shadow-[0_0_6px_#d6ad4a] transition-all duration-300 ${
                    mobileMenuOpen ? "w-5 translate-y-[9px] rotate-45" : "w-5"
                  }`}
                />
                <span
                  className={`h-0.5 rounded-full bg-[#d6ad4a] shadow-[0_0_4px_#d6ad4a] transition-all duration-300 ${
                    mobileMenuOpen ? "w-0 opacity-0" : "w-3"
                  }`}
                />
                <span
                  className={`h-0.5 rounded-full bg-gradient-to-r from-[#d6ad4a] to-[#f3d27a] shadow-[0_0_6px_#d6ad4a] transition-all duration-300 ${
                    mobileMenuOpen ? "w-5 -translate-y-[9px] -rotate-45" : "w-4"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 border-b border-[#d6ad4a]/20 bg-black/95 px-6 py-8 backdrop-blur-2xl lg:hidden"
          >
            <nav className="flex flex-col gap-6">
              {["inicio", "barberia", "tattoo", "anticipo", "lealtad", "ubicacion"].map(
                (id, index) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className={`text-left text-sm font-bold uppercase tracking-[0.24em] transition py-2 ${
                      activeSection === id ? "text-[#d6ad4a]" : "text-zinc-300"
                    }`}
                  >
                    {t.nav[index]}
                  </button>
                )
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="w-full"
        >
          {activeSection === "inicio" && (
            <>
              <section
                id="inicio"
                aria-labelledby="hero-heading"
                className="relative flex min-h-[92vh] items-center overflow-hidden border-b border-[#d6ad4a]/20 px-4 pt-24 sm:px-6"
              >
                <Image
                  src="/gallery/mbs3.jpg"
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="absolute inset-0 object-cover opacity-55"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.96)_0%,rgba(5,5,5,0.78)_42%,rgba(5,5,5,0.42)_100%),linear-gradient(180deg,rgba(5,5,5,0.45)_0%,rgba(5,5,5,0.1)_45%,rgba(5,5,5,0.88)_100%)]" />
                <div className="hero-texture absolute inset-0 opacity-55 mix-blend-screen" />
                <div className="mx-auto grid w-full max-w-7xl items-center gap-10 py-12 lg:grid-cols-[1.08fr_0.92fr]">
                  <div className="relative z-10">
                    <p className="mb-5 text-xs font-bold uppercase tracking-[0.32em] text-[#d6ad4a]">
                      {t.heroKicker}
                    </p>
                    <h1
                      id="hero-heading"
                      className="max-w-4xl text-5xl font-black uppercase leading-[0.92] tracking-normal sm:text-7xl lg:text-8xl"
                    >
                      Mambas Tattoo & Cuts
                    </h1>
                    <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                      {t.heroText}
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <a
                        href={barberBookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gold"
                      >
                        {t.barberCta}
                      </a>
                      <button
                        onClick={() => scrollTo("tattoo")}
                        className="btn-outline"
                      >
                        {t.tattooCta}
                      </button>
                    </div>
                  </div>
                  <div className="relative z-10 mx-auto flex w-full max-w-md justify-center lg:max-w-none">
                    <Image
                      src="/logo.png"
                      alt="Mambas Tattoo & Cuts logo"
                      width={320}
                      height={320}
                      priority
                      className="w-full max-w-xs object-contain"
                    />
                  </div>
                </div>
              </section>

              <section
                id="quienes-somos"
                className="border-b border-[#d6ad4a]/20 px-4 py-16 sm:px-6"
              >
                <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                  <div>
                    <p className="section-kicker">MAMBAS · 2021</p>
                    <h2 className="section-title">{t.aboutTitle}</h2>
                  </div>
                  <div className="space-y-5 text-lg leading-8 text-zinc-300">
                    <p>{t.about}</p>
                    <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-[#d6ad4a]/24 bg-black shadow-[0_28px_80px_rgba(0,0,0,0.48)] sm:min-h-[340px]">
                      <Image
                        src="/gallery/mbs3.jpg"
                        alt={
                          language === "es"
                            ? "Fachada nocturna de Mambas Tattoo & Cuts en Playa del Carmen"
                            : "Mambas Tattoo & Cuts storefront at night in Playa del Carmen"
                        }
                        fill
                        sizes="(max-width: 1024px) 100vw, 760px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.5)),linear-gradient(90deg,rgba(0,0,0,0.42),transparent_55%)]" />
                      <div className="absolute bottom-5 left-5 right-5">
                        <p className="text-xs font-black uppercase tracking-[0.26em] text-[#d6ad4a]">
                          Playa del Carmen
                        </p>
                        <p className="mt-2 max-w-md text-2xl font-black uppercase leading-none text-white sm:text-4xl">
                          Mambas Tattoo & Cuts
                        </p>
                      </div>
                    </div>
                    <p className="discreet">{t.inclusive}</p>
                  </div>
                </div>
              </section>

              {/* Video Art & Motion Section */}
              <section className="border-b border-[#d6ad4a]/20 px-4 py-16 sm:px-6">
                <div className="relative mx-auto max-w-2xl overflow-hidden bg-[#050505]">
                  <video
                    src="/animacion/animacion.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto object-cover"
                  />
                </div>
              </section>

              <section className="border-b border-[#d6ad4a]/20 px-4 py-16 sm:px-6">
                <div className="mx-auto max-w-7xl">
                  <div className="text-center">
                    <p className="section-kicker">GOOGLE MAPS · 5.0 ★</p>
                    <h2 className="section-title">{t.reviewsTitle}</h2>
                  </div>
                  <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {reviews.map((review) => (
                      <figure
                        key={review.name}
                        className="flex flex-col rounded-2xl border border-[#d6ad4a]/16 bg-[#070707] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#d6ad4a]/15 text-sm font-bold text-[#d6ad4a]">
                            {review.initials}
                          </div>
                          <div className="min-w-0">
                            <figcaption className="truncate text-sm font-semibold text-white">
                              {review.name}
                            </figcaption>
                            <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                              {review.localGuide ? "Local Guide · " : ""}
                              {review.time[language]}
                            </p>
                          </div>
                        </div>
                        <div
                          className="mt-3 text-base text-[#d6ad4a]"
                          aria-label={`${review.stars} / 5`}
                        >
                          {"★".repeat(review.stars)}
                        </div>
                        <blockquote className="mt-3 text-sm leading-6 text-zinc-300">
                          {review.text}
                        </blockquote>
                      </figure>
                    ))}
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#d6ad4a]/30 bg-[#070707] p-5 text-center transition hover:border-[#d6ad4a]/60 hover:bg-[#0b0b0b]"
                    >
                      <span className="text-2xl text-[#d6ad4a]">★★★★★</span>
                      <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#d6ad4a]">
                        {t.viewReviews}
                      </span>
                    </a>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeSection === "barberia" && (
            <section id="barberia" className="service-section pt-24">
              <SectionHeader title={t.barberTitle} slogan={t.barberSlogan} />
              
              {/* Gallery at the top */}
              <div className="mx-auto mt-6 max-w-7xl">
                <div className="gallery-shell">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-[#d6ad4a]">
                        Galería
                      </p>
                      <h3 className="mt-3 text-3xl font-black uppercase tracking-[0.04em] text-white">
                        {language === "es" ? "Barbería" : "Barbershop"}
                      </h3>
                    </div>
                    <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                      Mambas
                    </p>
                  </div>
                  <Gallery items={barberGallery} language={language} speed={0.5} />
                  <p className="mt-5 text-sm leading-6 text-zinc-400">
                    {language === "es"
                      ? "Cortes de cabello modernos y servicio premium para caballeros."
                      : "Modern haircuts and premium service for gentlemen."}
                  </p>
                </div>
              </div>

              {/* Price list below the gallery */}
              <div className="mt-12">
                <PriceGrid rows={barberServices} language={language} />
              </div>

              <p className="mx-auto mt-8 max-w-2xl text-center text-sm italic text-zinc-400">
                {t.barberNote}
              </p>
              <ContactStrip kind="barber" language={language} />
            </section>
          )}

          {activeSection === "tattoo" && (
            <section id="tattoo" className="service-section bg-[#090909] pt-24">
              <SectionHeader title={t.tattooTitle} slogan={t.tattooSlogan} />
              
              {/* Gallery at the top */}
              <div className="mx-auto mt-6 max-w-7xl">
                <div className="gallery-shell">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-[#d6ad4a]">
                        Galería
                      </p>
                      <h3 className="mt-3 text-3xl font-black uppercase tracking-[0.04em] text-white">
                        {language === "es" ? "Tattoo & Piercing" : "Tattoo & Piercing"}
                      </h3>
                    </div>
                    <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                      Mambas
                    </p>
                  </div>
                  <Gallery items={tattooGallery} language={language} speed={0.35} />
                  <p className="mt-5 text-sm leading-6 text-zinc-400">
                    {language === "es"
                      ? "Piezas personalizadas, piercing profesional y procesos cuidados."
                      : "Custom pieces, professional piercing and careful process."}
                  </p>
                </div>
              </div>

              {/* Price list and cotizador below the gallery */}
              <div className="mx-auto mt-12 grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
                <div>
                  <PriceGrid rows={tattooPrices} language={language} compact />
                  <p className="mt-6 text-sm italic leading-6 text-zinc-400">
                    {t.tattooNote}
                  </p>
                  <p className="mt-2 text-sm italic leading-6 text-zinc-400">
                    {t.piercingNote}
                  </p>
                </div>
                <div className="panel">
                  <h3 className="mb-6 text-2xl font-black uppercase tracking-normal text-white">
                    {t.quoteTitle}
                  </h3>
                  <Range
                    label={t.centimeters}
                    value={centimeters}
                    min={3}
                    max={28}
                    onChange={setCentimeters}
                    suffix="cm"
                  />
                  <Range
                    label={t.detail}
                    value={detail}
                    min={1}
                    max={5}
                    onChange={setDetail}
                  />
                  <Range
                    label={t.zone}
                    value={zone}
                    min={1}
                    max={4}
                    onChange={setZone}
                  />
                  <div className="mt-7 border-t border-[#d6ad4a]/20 pt-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                      {t.estimated}
                    </p>
                    <p className="mt-1 text-4xl font-black text-[#d6ad4a]">
                      {tattooEstimate.toLocaleString("es-MX")} MXN
                    </p>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      {t.quoteHelp}
                    </p>
                    <a
                      href={`https://wa.me/${contacts.tattoo.phone}?text=${encodeURIComponent(`Hola Mambas, quiero cotizar un tattoo de ${centimeters}cm.`)}`}
                      className="btn-gold mt-6 w-full justify-center"
                    >
                      WhatsApp Tattoo
                    </a>
                  </div>
                </div>
              </div>
              <ContactStrip kind="tattoo" language={language} />
            </section>
          )}

          {activeSection === "anticipo" && (
            <section
              id="anticipo"
              className="overflow-hidden border-t border-[#d6ad4a]/20 bg-black px-4 py-24 sm:px-6"
            >
              <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div className="min-w-0">
                  <p className="section-kicker">{t.depositKicker}</p>
                  <h2 className="section-title">{t.depositTitle}</h2>
                  <p className="mt-6 max-w-xl leading-8 text-lg text-zinc-300">
                    {t.depositText}
                  </p>
                  <div className="mt-8 space-y-6">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <a
                        href={depositPaymentUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="btn-gold"
                      >
                        {t.depositPaymentButton}
                      </a>
                      <a
                        href={`https://wa.me/${contacts.tattoo.phone}?text=${encodeURIComponent(
                          language === "es"
                            ? "Hola Mambas, quiero reservar una cita de tatuaje. Entiendo que el anticipo mínimo es de 500 MXN. ¿Me pueden enviar las opciones de pago?"
                            : "Hi Mambas, I want to book a tattoo appointment. I understand the minimum deposit is 500 MXN. Can you send me the payment options?",
                        )}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="btn-outline"
                      >
                        {t.depositButton}
                      </a>
                    </div>

                    <div className="w-full max-w-full overflow-hidden rounded-2xl border border-[#d6ad4a]/28 bg-[linear-gradient(145deg,rgba(214,173,74,0.1),rgba(255,255,255,0.035)),#070707] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.62),0_0_44px_rgba(214,173,74,0.1)] sm:max-w-lg sm:p-5">
                      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-4">
                            <Image
                              src="/base-badge.svg"
                              alt="Base"
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full shadow-md"
                            />
                            <div>
                              <p className="text-xs text-zinc-400">
                                {language === "es" ? "Red recomendada" : "Preferred network"}
                              </p>
                              <p className="text-sm font-semibold text-[#0ea5ff]">
                                Base
                              </p>
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-zinc-400">
                            {language === "es"
                              ? "Comisiones bajas • Pagos rápidos • Pagos internacionales"
                              : "Low fees • Fast transactions • International payments"}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-2 rounded px-3 py-1 text-sm text-zinc-200 bg-[#0b0b0b] border border-[#d6ad4a]/10">
                              USDT on Base
                            </span>
                            <span className="inline-flex items-center gap-2 rounded px-3 py-1 text-sm text-zinc-200 bg-[#0b0b0b] border border-[#d6ad4a]/10">
                              ETH on Base
                            </span>
                          </div>
                        </div>

                        <div className="w-full min-w-0 flex-shrink-0 sm:w-auto">
                          <div className="mb-3 text-left sm:text-right">
                            <p className="text-sm text-zinc-400">
                              {language === "es" ? "Billetera" : "Wallet"}
                            </p>
                            <div className="mt-2 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
                              <code className="block w-full min-w-0 overflow-hidden break-all rounded border border-[#d6ad4a]/10 bg-[#0b0b0b] px-3 py-2 font-mono text-xs leading-5 text-zinc-200 sm:max-w-[220px] sm:text-sm">
                                {walletAddress}
                              </code>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(walletAddress);
                                  setCopied(true);
                                  setTimeout(() => setCopied(false), 2000);
                                }}
                                className="btn-gold w-full justify-center px-3 py-2 text-sm sm:w-auto"
                              >
                                {copied
                                  ? language === "es"
                                    ? "Copiado"
                                    : "Copied"
                                  : language === "es"
                                    ? "Copiar"
                                    : "Copy"}
                              </button>
                            </div>
                          </div>
                          <p className="mt-2 text-xs italic text-zinc-400">
                            {language === "es"
                              ? "Red recomendada: Base."
                              : "Recommended network: Base."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-8 text-sm italic text-zinc-400">
                    {t.paymentMethods}
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="symbol-pulse text-8xl text-[#d6ad4a] drop-shadow-lg">
                    ₿
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "lealtad" && (
            <section
              id="lealtad"
              className="border-b border-[#d6ad4a]/20 px-4 py-24 sm:px-6"
            >
              <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="section-kicker">MAMBAS CLUB</p>
                  <h2 className="section-title">{t.loyaltyTitle}</h2>
                  <p className="mt-5 max-w-xl leading-7 text-zinc-300">
                    {t.loyaltyText}
                  </p>
                  <p className="mt-3 text-sm text-zinc-400">
                    {t.loyaltySummary}
                  </p>
                </div>
                <div className="sm:col-span-1">
                  <form
                    onSubmit={handleRegister}
                    className="panel grid gap-4 sm:grid-cols-2 p-6 rounded-2xl border border-[#d6ad4a]/20 bg-gradient-to-b from-[#070707] to-[#030303] shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
                  >
                    <input
                      type="text"
                      name="company"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="hidden"
                    />
                    <input
                      name="name"
                      required
                      placeholder={t.fullName}
                      className="field sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#d6ad4a]/40 transition-shadow"
                    />
                    <label className="flex min-w-0 flex-col gap-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                        {t.phone}
                      </span>
                      <input
                        name="phone"
                        required
                        placeholder={t.phone}
                        className="field focus:outline-none focus:ring-2 focus:ring-[#d6ad4a]/40 transition-shadow"
                      />
                    </label>
                    <div className="flex min-w-0 flex-col gap-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                        {t.birthday}
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          name="birthdayDay"
                          className="field focus:outline-none focus:ring-2 focus:ring-[#d6ad4a]/40 transition-shadow py-3 px-2 text-sm text-white"
                        >
                          <option value="">{language === "es" ? "Día" : "Day"}</option>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                            <option key={d} value={String(d).padStart(2, "0")}>
                              {d}
                            </option>
                          ))}
                        </select>
                        <select
                          name="birthdayMonth"
                          className="field focus:outline-none focus:ring-2 focus:ring-[#d6ad4a]/40 transition-shadow py-3 px-2 text-sm text-white"
                        >
                          <option value="">{language === "es" ? "Mes" : "Month"}</option>
                          {[
                            { value: "01", label: language === "es" ? "Ene" : "Jan" },
                            { value: "02", label: language === "es" ? "Feb" : "Feb" },
                            { value: "03", label: language === "es" ? "Mar" : "Mar" },
                            { value: "04", label: language === "es" ? "Abr" : "Apr" },
                            { value: "05", label: language === "es" ? "May" : "May" },
                            { value: "06", label: language === "es" ? "Jun" : "Jun" },
                            { value: "07", label: language === "es" ? "Jul" : "Jul" },
                            { value: "08", label: language === "es" ? "Ago" : "Aug" },
                            { value: "09", label: language === "es" ? "Sep" : "Sep" },
                            { value: "10", label: language === "es" ? "Oct" : "Oct" },
                            { value: "11", label: language === "es" ? "Nov" : "Nov" },
                            { value: "12", label: language === "es" ? "Dic" : "Dec" },
                          ].map((m) => (
                            <option key={m.value} value={m.value}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <select
                      name="interest"
                      className="field sm:col-span-2"
                      defaultValue={mode}
                      onChange={(event) => setMode(event.target.value as ServiceMode)}
                    >
                      <option value="barber">{t.barberTitle}</option>
                      <option value="tattoo">{t.tattooTitle}</option>
                    </select>
                    <button className="btn-gold justify-center sm:col-span-2 px-6 py-3 text-sm font-semibold rounded-md shadow-[0_8px_30px_rgba(214,173,74,0.12)] hover:scale-[1.02] transform transition duration-200">
                      {t.register}
                    </button>
                    <p className="text-[11px] leading-5 text-zinc-500 sm:col-span-2">
                      {language === "es"
                        ? "Al registrarte aceptas nuestro "
                        : "By registering you accept our "}
                      <a
                        href="/privacidad"
                        className="text-[#d6ad4a] hover:underline"
                      >
                        {language === "es" ? "Aviso de Privacidad" : "Privacy Notice"}
                      </a>
                      .
                    </p>
                    {saved && (
                      <p className="text-sm text-[#d6ad4a] sm:col-span-2">
                        {t.saved}
                      </p>
                    )}
                  </form>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-4 rounded-lg border border-[#d6ad4a]/12 bg-[#070707] p-3 hover:translate-y-[-4px] transition-transform duration-200">
                      <div className="h-10 w-10 rounded-full bg-black/40 flex items-center justify-center text-[#d6ad4a] font-semibold">
                        B
                      </div>
                      <div>
                        <div className="text-xs text-zinc-400">BLACK MEMBER</div>
                        <div className="text-sm text-zinc-200">
                          {t.memberBlack}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-lg border border-[#d6ad4a]/12 bg-[#070707] p-3 hover:translate-y-[-4px] transition-transform duration-200">
                      <div className="h-10 w-10 rounded-full bg-black/40 flex items-center justify-center text-[#d6ad4a] font-semibold">
                        G
                      </div>
                      <div>
                        <div className="text-xs text-zinc-400">GOLD MEMBER</div>
                        <div className="text-sm text-zinc-200">
                          {t.memberGold}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-lg border border-[#d6ad4a]/12 bg-[#070707] p-3 hover:translate-y-[-4px] transition-transform duration-200">
                      <div className="h-10 w-10 rounded-full bg-black/40 flex items-center justify-center text-[#d6ad4a] font-semibold">
                        R
                      </div>
                      <div>
                        <div className="text-xs text-zinc-400">RITUAL MEMBER</div>
                        <div className="text-sm text-zinc-200">{t.memberRitual}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "ubicacion" && (
            <section id="ubicacion" className="px-4 py-24 sm:px-6">
              <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
                <div>
                  <p className="section-kicker">PLAYA DEL CARMEN</p>
                  <h2 className="section-title">{t.locationTitle}</h2>
                  <p className="mt-5 text-lg leading-8 text-zinc-300">
                    {t.locationText}
                  </p>
                  <p className="mt-5 text-xl font-bold text-white">{t.address}</p>
                  <div className="mt-6 rounded-xl border border-[#d6ad4a]/20 bg-[#070707] p-5">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-[#d6ad4a]">
                      {t.hoursTitle}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-4 border-b border-[#d6ad4a]/10 pb-2">
                      <span className="text-sm text-zinc-300">{t.hoursWeekdays}</span>
                      <span className="text-sm font-semibold text-white">
                        {t.hoursWeekdaysValue}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-4">
                      <span className="text-sm text-zinc-300">{t.hoursSunday}</span>
                      <span className="text-sm font-semibold text-white">
                        {t.hoursSundayValue}
                      </span>
                    </div>
                  </div>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-gold"
                    >
                      {t.map}
                    </a>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline"
                    >
                      {t.viewReviews}
                    </a>
                  </div>
                </div>
                <LocationMapCard language={language} />
              </div>
            </section>
          )}
        </motion.div>
      </AnimatePresence>

      <footer
        className="border-t border-[#d6ad4a]/20 px-4 py-10 text-center sm:px-6"
        aria-label="Footer"
      >
        <Image
          src="/logo.png"
          alt="Mambas Tattoo & Cuts logo"
          width={56}
          height={56}
          className="mx-auto mb-5 h-14 w-14 object-contain"
        />
        <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
          Mambas Tattoo & Cuts ·{" "}
          {language === "es" ? "MARCA REGISTRADA DESDE 2021" : "REGISTERED BRAND SINCE 2021"}{" "}
          · COFEPRIS ·{" "}
          {t.contact}
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.22em] text-zinc-500">
          <a href="/privacidad" className="transition hover:text-[#d6ad4a]">
            {language === "es" ? "Aviso de Privacidad" : "Privacy Notice"}
          </a>
        </p>
        <a
          href="https://www.freewillstudiotech.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block text-center text-zinc-600 transition hover:text-[#d6ad4a]"
        >
          <span className="block text-[10px] uppercase tracking-[0.18em]">
            {language === "es"
              ? "Diseño consciente. Tecnología con propósito"
              : "Conscious design. Purposeful technology"}
          </span>
          <span className="mt-1 block text-[11px] tracking-[0.1em] text-[#d6ad4a]/80">
            www.freewillstudiotech.com
          </span>
        </a>
      </footer>
      <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
        {floatingOpen && (
          <div className="w-[min(92vw,300px)] overflow-hidden rounded-2xl border border-[#d6ad4a]/28 bg-black/92 shadow-[0_22px_70px_rgba(0,0,0,0.58)] backdrop-blur-xl">
            <a
              href={`https://wa.me/${contacts.barber.phone}?text=${encodeURIComponent(
                language === "es"
                  ? "Hola Mambas, quiero reservar una cita de barbería."
                  : "Hi Mambas, I want to book a barbershop appointment.",
              )}`}
              target="_blank"
              rel="noreferrer noopener"
              className="block border-b border-[#d6ad4a]/16 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#d6ad4a] hover:text-black"
            >
              {t.floatingBarber}
              <span className="mt-1 block text-xs font-medium normal-case tracking-normal text-zinc-400">
                WhatsApp {contacts.barber.display}
              </span>
            </a>
            <a
              href={`https://wa.me/${contacts.tattoo.phone}?text=${encodeURIComponent(
                language === "es"
                  ? "Hola Mambas, quiero información para tattoo o piercing."
                  : "Hi Mambas, I want information for tattoo or piercing.",
              )}`}
              target="_blank"
              rel="noreferrer noopener"
              className="block px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#d6ad4a] hover:text-black"
            >
              {t.floatingTattoo}
              <span className="mt-1 block text-xs font-medium normal-case tracking-normal text-zinc-400">
                WhatsApp {contacts.tattoo.display}
              </span>
            </a>
          </div>
        )}
        <button
          onClick={() => setFloatingOpen((open) => !open)}
          aria-label={
            language === "es"
              ? "Abrir opciones de WhatsApp"
              : "Open WhatsApp options"
          }
          aria-expanded={floatingOpen}
          className="whatsapp-float-button grid h-[68px] w-[68px] place-items-center rounded-full border border-[#d6ad4a]/70 bg-black text-[#d6ad4a] shadow-[0_18px_54px_rgba(0,0,0,0.5),0_0_34px_rgba(214,173,74,0.2)] transition hover:-translate-y-0.5 hover:border-[#d6ad4a] hover:bg-[#d6ad4a] hover:text-black"
        >
          <WhatsAppIcon />
        </button>
      </div>
    </main>
  );
}

function WhatsAppIcon() {
  return (
    <span
      className="grid h-12 w-12 place-items-center rounded-full border border-current bg-[rgba(214,173,74,0.08)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_0_24px_rgba(214,173,74,0.2)]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-8 w-8 fill-white"
        role="img"
      >
        <path d="M12.04 2a9.91 9.91 0 0 0-8.49 15.03L2.38 22l5.08-1.15A9.91 9.91 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 0 1 6.89 12.34 8.1 8.1 0 0 1-10.74 2.62l-.34-.2-3.02.69.7-2.94-.22-.36A8.1 8.1 0 0 1 12.04 3.8Zm-3.15 4.37c-.17 0-.45.06-.69.33-.24.26-.91.88-.91 2.15 0 1.26.93 2.49 1.06 2.66.13.18 1.8 2.88 4.43 3.91 2.19.86 2.64.69 3.11.65.48-.04 1.55-.63 1.77-1.24.22-.61.22-1.13.15-1.24-.06-.11-.24-.18-.5-.31-.26-.13-1.54-.76-1.78-.85-.24-.09-.41-.13-.58.13-.18.26-.68.85-.83 1.02-.16.18-.31.2-.57.07-.26-.13-1.1-.4-2.1-1.29-.78-.69-1.3-1.55-1.46-1.81-.15-.26-.02-.4.12-.53.12-.12.26-.31.39-.46.13-.15.17-.26.26-.44.09-.17.04-.32-.02-.46-.07-.13-.58-1.41-.8-1.93-.21-.5-.43-.43-.59-.44h-.5Z" />
      </svg>
    </span>
  );
}

function Gallery({
  items,
  language,
  speed = 0.5,
}: {
  items: GalleryItem[];
  language: Language;
  speed?: number;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const pausedRef = useRef(false);
  const dragRef = useRef({ active: false, startX: 0, startPos: 0 });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame: number;
    const tick = () => {
      if (!pausedRef.current) {
        xRef.current -= speed;
        const half = track.scrollWidth / 2;
        if (half > 0 && Math.abs(xRef.current) >= half) {
          xRef.current += half; // seamless loop
        }
        track.style.transform = `translateX(${xRef.current}px)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [speed]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pausedRef.current = true;
    dragRef.current = { active: true, startX: e.clientX, startPos: xRef.current };
    viewportRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || !trackRef.current) return;
    xRef.current = dragRef.current.startPos + (e.clientX - dragRef.current.startX);
    trackRef.current.style.transform = `translateX(${xRef.current}px)`;
  };

  const endDrag = () => {
    dragRef.current.active = false;
    pausedRef.current = false;
  };

  return (
    <div
      ref={viewportRef}
      className="gallery-scroller"
      role="region"
      aria-label={language === "es" ? "Galería de fotos" : "Photo gallery"}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div ref={trackRef} className="gallery-track-inner">
        {[...items, ...items].map((item, index) => (
          <div key={`${item.src}-${index}`} className="gallery-card">
            <div className="gallery-frame">
              {item.video ? (
                <video
                  src={item.video}
                  poster={item.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={item.alt[language]}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={item.src}
                  alt={item.alt[language]}
                  fill
                  sizes="(max-width: 640px) 260px, 320px"
                  className={item.imageClassName || "object-cover"}
                  draggable={false}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ title, slogan }: { title: string; slogan: string }) {
  return (
    <div className="mx-auto mb-12 max-w-4xl text-center">
      <p className="section-kicker">{slogan}</p>
      <h2 className="section-title">{title}</h2>
    </div>
  );
}

function PriceGrid({
  rows,
  language,
  compact = false,
}: {
  rows: string[][];
  language: Language;
  compact?: boolean;
}) {
  return (
    <div
      className={`grid gap-3 ${compact ? "grid-cols-1" : "mx-auto max-w-7xl sm:grid-cols-2 lg:grid-cols-4"}`}
    >
      {rows.map(([es, en, mxn, usd]) => (
        <div key={es} className="price-item">
          <h3>{language === "es" ? es : en}</h3>
          <p>{mxn}</p>
          <span>{usd}</span>
        </div>
      ))}
    </div>
  );
}

function Range({
  label,
  value,
  min,
  max,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="mb-5 block">
      <span className="mb-2 flex justify-between text-sm font-bold uppercase tracking-[0.18em] text-zinc-400">
        {label}
        <b className="text-[#d6ad4a]">
          {value}
          {suffix}
        </b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[#d6ad4a]"
      />
    </label>
  );
}

function ContactStrip({
  kind,
  language,
}: {
  kind: ServiceMode;
  language: Language;
}) {
  const contact = contacts[kind];
  const isBarber = kind === "barber";
  return (
    <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center gap-3 sm:flex-row">
      {isBarber && (
        <a
          href={barberBookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold"
        >
          {language === "es" ? "Reservar cita en línea" : "Book online"}
        </a>
      )}
      {!isBarber && (
        <a
          href={`https://wa.me/${contact.phone}`}
          className="btn-gold"
        >
          WhatsApp
        </a>
      )}
      <a
        href={contact.url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline"
      >
        Instagram
      </a>
      <span className="sr-only">{language}</span>
    </div>
  );
}

function LocationMapCard({ language }: { language: Language }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#d6ad4a]/24 bg-black shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
      <MapboxMap />
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-between gap-4 border-t border-[#d6ad4a]/16 px-5 py-4 transition hover:bg-[#0b0b0b]"
      >
        <span>
          <span className="block text-xs font-black uppercase tracking-[0.24em] text-[#d6ad4a]">
            Mambas Tattoo &amp; Cuts
          </span>
          <span className="mt-1 block text-sm text-zinc-300">
            {language === "es"
              ? "Calle 1 Sur esquina Av. 25 Sur · Playa del Carmen"
              : "Calle 1 Sur corner Av. 25 Sur · Playa del Carmen"}
          </span>
        </span>
        <span className="shrink-0 text-xs font-bold uppercase tracking-[0.18em] text-[#d6ad4a]">
          {language === "es" ? "Abrir mapa" : "Open map"}
        </span>
      </a>
    </div>
  );
}
