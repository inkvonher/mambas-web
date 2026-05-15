"use client";

import { FormEvent, useMemo, useState } from "react";

type Language = "es" | "en";
type ServiceMode = "barber" | "tattoo";

const copy = {
  es: {
    nav: ["Inicio", "Barbería", "Tattoo", "Lealtad", "Ubicación"],
    heroKicker: "Barbería tradicional mexicana · Tattoo ritual · Piercing",
    heroText:
      "Desde 2021 en el corazón de Playa del Carmen, a unas calles del ferry a Cozumel. Certificados ante COFEPRIS.",
    barberCta: "Reservar barbería",
    tattooCta: "Cotizar tattoo",
    aboutTitle: "Quiénes somos",
    about:
      "Mambas Tattoo & Cuts une barbería tradicional mexicana, estudio de tatuajes ritual y piercing en un espacio sobrio, cuidado y profesional.",
    barberTitle: "Barbería",
    barberSlogan: "LUCE FRESCO",
    tattooTitle: "Tattoo & Piercing",
    tattooSlogan: "FREEWILL",
    included: "Incluido",
    barberNote: "Bebida + facial relajante de cortesía para nuestros clientes.",
    tattooNote:
      "El precio por pieza depende del nivel de detalle, centímetros, estilo y zona a tatuar.",
    piercingNote:
      "Los servicios incluyen anestesia tópica en caso de requerirla y bebida de cortesía.",
    loyaltyTitle: "Registro / Lealtad",
    loyaltyText:
      "Beneficios para clientes frecuentes: precios especiales, acceso a mercancía en preventa, descuentos de cumpleañero y prioridad para eventos.",
    fullName: "Nombre completo",
    phone: "WhatsApp",
    birthday: "Cumpleaños",
    interest: "Interés principal",
    register: "Registrarme",
    saved: "Registro guardado en este dispositivo.",
    quoteTitle: "Cotizador tattoo",
    centimeters: "Centímetros",
    detail: "Detalle",
    zone: "Zona",
    estimated: "Estimado",
    quoteHelp:
      "Este cálculo orienta la conversación. La cotización final se confirma por WhatsApp con referencia visual.",
    locationTitle: "Ubicación",
    address:
      "Calle 1 Sur esq. Av. 25 Sur, Centro, Playa del Carmen, Quintana Roo",
    locationText:
      "Ubicado en el corazón de Playa del Carmen, a unas calles del ferry a Cozumel.",
    reviewsTitle: "Reseñas",
    reviewsText:
      "La ficha pública muestra calificaciones reales. Los textos de Google requieren integración oficial de Places API; por eso aquí enlazamos la fuente en vivo.",
    viewReviews: "Ver resenas en Google Maps",
    sourceRating: "Apple Maps: 5 calificaciones, 100% general",
    inclusive:
      "Espacio inclusivo que no discrimina a nadie. LGBTQ+ friendly. Pet friendly.",
    contact: "Contacto directo",
    map: "Abrir mapa",
  },
  en: {
    nav: ["Home", "Barbershop", "Tattoo", "Loyalty", "Location"],
    heroKicker: "Traditional Mexican barbershop · Ritual tattoo · Piercing",
    heroText:
      "Since 2021 in the heart of Playa del Carmen, a few blocks from the Cozumel ferry. COFEPRIS certified.",
    barberCta: "Book barbershop",
    tattooCta: "Quote tattoo",
    aboutTitle: "Who we are",
    about:
      "Mambas Tattoo & Cuts brings together traditional Mexican barbering, ritual tattooing and piercing in a clean, focused and professional space.",
    barberTitle: "Barbershop",
    barberSlogan: "LOOK FRESH",
    tattooTitle: "Tattoo & Piercing",
    tattooSlogan: "FREEWILL",
    included: "Included",
    barberNote: "Complimentary drink + relaxing facial for our clients.",
    tattooNote:
      "Piece pricing depends on detail level, centimeters, style and tattoo placement.",
    piercingNote:
      "Services include topical anesthesia if required and a complimentary drink.",
    loyaltyTitle: "Registration / Loyalty",
    loyaltyText:
      "Benefits for returning clients: special pricing, early merchandise access, birthday discounts and priority event access.",
    fullName: "Full name",
    phone: "WhatsApp",
    birthday: "Birthday",
    interest: "Main interest",
    register: "Register",
    saved: "Registration saved on this device.",
    quoteTitle: "Tattoo quote",
    centimeters: "Centimeters",
    detail: "Detail",
    zone: "Placement",
    estimated: "Estimate",
    quoteHelp:
      "This estimate guides the conversation. Final pricing is confirmed on WhatsApp with a visual reference.",
    locationTitle: "Location",
    address:
      "Calle 1 Sur corner Av. 25 Sur, Centro, Playa del Carmen, Quintana Roo",
    locationText:
      "Located in the heart of Playa del Carmen, a few blocks from the Cozumel ferry.",
    reviewsTitle: "Reviews",
    reviewsText:
      "The public listing shows real ratings. Google review text requires the official Places API, so this app links to the live source.",
    viewReviews: "View reviews on Google Maps",
    sourceRating: "Apple Maps: 5 ratings, 100% overall",
    inclusive:
      "Inclusive space. We do not discriminate. LGBTQ+ friendly. Pet friendly.",
    contact: "Direct contact",
    map: "Open map",
  },
};

const barberServices = [
  ["Corte de cabello", "Haircut", "320 MXN", "20 USD"],
  ["Ritual de barba", "Beard ritual", "290 MXN", "18 USD"],
  ["Delineado general", "General line-up", "210 MXN", "13 USD"],
  ["Cejas o bigote", "Eyebrows or mustache", "150 MXN", "10 USD"],
  ["Facial + vapor", "Facial + steam", "230 MXN", "14 USD"],
  ["Servicio VIP", "VIP service", "900 MXN", "57 USD"],
  ["Global / mechas", "Full color / highlights", "1800 MXN", "112 USD"],
  ["Trenzas desde", "Braids from", "1000 MXN", "63 USD"],
];

const tattooPrices = [
  ["Precio mínimo", "Minimum price", "1600 MXN", "100 USD"],
  ["Sesión 4/5 hrs aprox.", "4/5 hr session", "6500 MXN", "400 USD"],
  ["Piercing facial", "Facial piercing", "550 MXN", "35 USD"],
  ["Piercing genital", "Genital piercing", "1000 MXN", "65 USD"],
];

const contacts = {
  barber: {
    phone: "+529843675261",
    display: "+52 984 367 5261",
    instagram: "Instagram",
    url: "https://www.instagram.com/mambas_barberia.pdc/",
  },
  tattoo: {
    phone: "+529841820414",
    display: "+52 984 182 0414",
    instagram: "Instagram",
    url: "https://www.instagram.com/mambas.tattoocuts/",
  },
};

const googleMapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Mambas%20Tattoo%20%26%20Cuts%20Calle%201%20Sur%20Av.%2025%20Sur%20Playa%20del%20Carmen";

export default function Home() {
  const [language, setLanguage] = useState<Language>("es");
  const [mode, setMode] = useState<ServiceMode>("barber");
  const [saved, setSaved] = useState(false);
  const [centimeters, setCentimeters] = useState(3);
  const [detail, setDetail] = useState(1);
  const [zone, setZone] = useState(1);
  const t = copy[language];

  const tattooEstimate = useMemo(() => {
    const extraCentimeters = Math.max(centimeters - 10, 0);
    const calculated =
      1600 + extraCentimeters * 110 + (detail - 1) * 450 + (zone - 1) * 250;
    return Math.min(Math.max(Math.round(calculated / 50) * 50, 1600), 6500);
  }, [centimeters, detail, zone]);

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    localStorage.setItem(
      "mambas-loyalty",
      JSON.stringify(Object.fromEntries(data.entries())),
    );
    setSaved(true);
    event.currentTarget.reset();
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#d6ad4a]/20 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => scrollTo("inicio")}
            className="flex items-center gap-3"
          >
            <img
              src="/logo.png"
              alt="Mambas Tattoo & Cuts"
              className="h-10 w-10 object-contain"
            />
            <span className="hidden text-xs font-bold tracking-[0.28em] text-[#d6ad4a] sm:block">
              MAMBAS
            </span>
          </button>
          <nav className="hidden items-center gap-6 lg:flex">
            {["inicio", "barberia", "tattoo", "lealtad", "ubicacion"].map(
              (id, index) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-300 transition hover:text-[#d6ad4a]"
                >
                  {t.nav[index]}
                </button>
              ),
            )}
          </nav>
          <button
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
            className="border border-[#d6ad4a] px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#d6ad4a] transition hover:bg-[#d6ad4a] hover:text-black"
          >
            {language === "es" ? "EN" : "ES"}
          </button>
        </div>
      </header>

      <section
        id="inicio"
        className="relative flex min-h-[92vh] items-center overflow-hidden border-b border-[#d6ad4a]/20 px-4 pt-24 sm:px-6"
      >
        <div className="hero-texture absolute inset-0" />
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 py-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative z-10">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.32em] text-[#d6ad4a]">
              {t.heroKicker}
            </p>
            <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.92] tracking-normal sm:text-7xl lg:text-8xl">
              Mambas Tattoo & Cuts
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
              {t.heroText}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://wa.me/${contacts.barber.phone}`}
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
            <img
              src="/logo.png"
              alt="Mambas Tattoo & Cuts logo"
              className="w-full max-w-xs object-contain"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-[#d6ad4a]/20 px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-kicker">MAMBAS · 2021</p>
            <h2 className="section-title">{t.aboutTitle}</h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-zinc-300">
            <p>{t.about}</p>
            <p className="discreet">{t.inclusive}</p>
          </div>
        </div>
      </section>

      <section id="barberia" className="service-section">
        <SectionHeader title={t.barberTitle} slogan={t.barberSlogan} />
        <PriceGrid rows={barberServices} language={language} />
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm italic text-zinc-400">
          {t.barberNote}
        </p>
        <ContactStrip kind="barber" language={language} />
      </section>

      <section id="tattoo" className="service-section bg-[#090909]">
        <SectionHeader title={t.tattooTitle} slogan={t.tattooSlogan} />
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
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

      <section
        id="lealtad"
        className="border-b border-[#d6ad4a]/20 px-4 py-20 sm:px-6"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="section-kicker">MAMBAS CLUB</p>
            <h2 className="section-title">{t.loyaltyTitle}</h2>
            <p className="mt-5 max-w-xl leading-7 text-zinc-300">
              {t.loyaltyText}
            </p>
          </div>
          <form
            onSubmit={handleRegister}
            className="panel grid gap-4 sm:grid-cols-2"
          >
            <input
              name="name"
              required
              placeholder={t.fullName}
              className="field sm:col-span-2"
            />
            <input
              name="phone"
              required
              placeholder={t.phone}
              className="field"
            />
            <input name="birthday" type="date" className="field" />
            <select
              name="interest"
              className="field sm:col-span-2"
              defaultValue={mode}
              onChange={(event) => setMode(event.target.value as ServiceMode)}
            >
              <option value="barber">{t.barberTitle}</option>
              <option value="tattoo">{t.tattooTitle}</option>
            </select>
            <button className="btn-gold justify-center sm:col-span-2">
              {t.register}
            </button>
            {saved && (
              <p className="text-sm text-[#d6ad4a] sm:col-span-2">{t.saved}</p>
            )}
          </form>
        </div>
      </section>

      <section id="ubicacion" className="px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div>
            <p className="section-kicker">PLAYA DEL CARMEN</p>
            <h2 className="section-title">{t.locationTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-zinc-300">
              {t.locationText}
            </p>
            <p className="mt-5 text-xl font-bold text-white">{t.address}</p>
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
          <iframe
            title="Mambas Tattoo & Cuts map"
            className="h-[360px] w-full border border-[#d6ad4a]/30 grayscale"
            loading="lazy"
            src="https://www.google.com/maps?q=Calle%201%20Sur%20%26%2025%20Av.%20Sur%2C%20Centro%2C%20Playa%20del%20Carmen%2C%20Q.R.&output=embed"
          />
        </div>
      </section>

      <section className="border-t border-[#d6ad4a]/20 px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-kicker">GOOGLE MAPS</p>
            <h2 className="section-title">{t.reviewsTitle}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="panel">
              <div className="mb-3 text-2xl text-[#d6ad4a]">★★★★★</div>
              <p className="text-zinc-300">{t.reviewsText}</p>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-block text-sm font-bold uppercase tracking-[0.22em] text-[#d6ad4a]"
              >
                {t.viewReviews}
              </a>
            </div>
            <div className="panel">
              <div className="mb-3 text-2xl text-[#d6ad4a]">★★★★★</div>
              <p className="text-zinc-300">{t.sourceRating}</p>
              <p className="mt-5 text-xs uppercase tracking-[0.2em] text-zinc-500">
                Fuente pública verificada: Apple Maps / ficha Mambas Tattoo &
                Cuts
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#d6ad4a]/20 px-4 py-10 text-center sm:px-6">
        <img
          src="/logo.png"
          alt=""
          className="mx-auto mb-5 h-14 w-14 object-contain"
        />
        <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
          Mambas Tattoo & Cuts · COFEPRIS · {t.contact}
        </p>
      </footer>
    </main>
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
  return (
    <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center gap-3 sm:flex-row">
      <a href={`https://wa.me/${contact.phone}`} className="btn-gold">
        WhatsApp {contact.display}
      </a>
      <a
        href={contact.url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline"
      >
        Instagram {contact.instagram}
      </a>
      <span className="sr-only">{language}</span>
    </div>
  );
}
