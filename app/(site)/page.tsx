"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";

type Language = "es" | "en";
type ServiceMode = "barber" | "tattoo";
type GalleryItem = {
  src: string;
  label: Record<Language, string>;
  alt: Record<Language, string>;
  imageClassName?: string;
};

const copy = {
  es: {
    nav: ["Inicio", "Barbería", "Tattoo", "Anticipo", "Lealtad", "Ubicación"],
    heroKicker: "Barbería tradicional mexicana · Tatuaje ritual · Piercing",
    heroText:
      "Desde 2021 en el corazón de Playa del Carmen, a unas calles del ferry a Cozumel. Certificados ante COFEPRIS.",
    barberCta: "Reservar barbería",
    tattooCta: "Cotizar tattoo",
    aboutTitle: "Quiénes somos",
    about:
      "Mambas Tattoo & Cuts une barbería tradicional mexicana, tatuaje ritual y piercing en un espacio sobrio, cuidado y profesional.",
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
      "Beneficios para clientes frecuentes: precios especiales, acceso a mercancía en preventa, descuentos de cumpleaños y prioridad para eventos.",
    fullName: "Nombre completo",
    phone: "WhatsApp",
    birthday: "Cumpleaños",
    interest: "Interés principal",
    register: "Registrarme",
    saved: "Registro enviado correctamente.",
    quoteTitle: "Cotizador tattoo",
    centimeters: "Centímetros",
    detail: "Detalle",
    zone: "Zona",
    estimated: "Estimado",
    quoteHelp:
      "Este cálculo orienta la conversación. La cotización final se confirma por WhatsApp con referencia visual.",
    locationTitle: "Ubicación",
    address:
      "Calle 1 Sur esquina Av. 25 Sur, Centro, Playa del Carmen, Quintana Roo",
    locationText:
      "Ubicado en el corazón de Playa del Carmen, a unas calles del ferry a Cozumel.",
    hoursTitle: "Horario",
    hoursWeekdays: "Lunes a sábado",
    hoursWeekdaysValue: "9:00 – 21:00",
    hoursSunday: "Domingo",
    hoursSundayValue: "12:00 – 21:00",
    reviewsTitle: "Reseñas",
    reviewsText:
      "Consulta calificaciones reales, reseñas y ruta directa desde la ficha pública de Mambas.",
    viewReviews: "Ver reseñas en Google Maps",
    sourceRating: "Apple Maps: 5 calificaciones, 100% general",
    sourceVerified:
      "Fuente publica verificada: Apple Maps / ficha Mambas Tattoo & Cuts",
    inclusive:
      "Espacio inclusivo, LGBTQ+ friendly y pet friendly.",
    loyaltySummary:
      "Acumula beneficios, prioridad y recompensas exclusivas.",
    memberBlack: "acceso prioritario",
    memberGold: "descuentos y recompensas",
    memberRitual: "beneficios VIP",
    contact: "Contacto directo",
    map: "Abrir mapa",
    depositTitle: "Anticipo",
    depositKicker: "RESERVA TU CITA",
    depositText:
      "Para reservar una cita de tatuaje se requiere un anticipo mínimo de 500 MXN. Tu pago asegura espacio, horario y preparación del diseño. El monto puede descontarse del total final del tatuaje.",
    depositButton: "Solicitar anticipo por WhatsApp",
    depositPaymentButton: "Pagar anticipo",
    paymentMethods:
      "Aceptamos pagos con Visa, Mastercard, criptomonedas y efectivo.",
    floatingBarber: "Barbería",
    floatingTattoo: "Tattoo & Piercing",
  },
  en: {
    nav: ["Home", "Barbershop", "Tattoo", "Deposit", "Loyalty", "Location"],
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
    hoursTitle: "Hours",
    hoursWeekdays: "Monday to Saturday",
    hoursWeekdaysValue: "9:00 AM – 9:00 PM",
    hoursSunday: "Sunday",
    hoursSundayValue: "12:00 PM – 9:00 PM",
    reviewsTitle: "Reviews",
    reviewsText:
      "The public listing shows real ratings. Google review text requires the official Places API, so this app links to the live source.",
    viewReviews: "View reviews on Google Maps",
    sourceRating: "Apple Maps: 5 ratings, 100% overall",
    sourceVerified:
      "Verified public source: Apple Maps / Mambas Tattoo & Cuts listing",
    inclusive:
      "Inclusive space. We do not discriminate. LGBTQ+ friendly. Pet friendly.",
    loyaltySummary:
      "Earn benefits, priority access and exclusive rewards.",
    memberBlack: "priority access",
    memberGold: "discounts and rewards",
    memberRitual: "VIP benefits",
    contact: "Direct contact",
    map: "Open map",
    depositTitle: "Deposit",
    depositKicker: "BOOK YOUR APPOINTMENT",
    depositText:
      "A minimum deposit of 500 MXN is required to reserve a tattoo appointment. Your payment secures your slot, time, and design preparation. The deposit can be deducted from your final tattoo total.",
    depositButton: "Request deposit by WhatsApp",
    depositPaymentButton: "Pay deposit",
    paymentMethods: "We accept Visa, Mastercard, cryptocurrencies and cash.",
    floatingBarber: "Barbershop",
    floatingTattoo: "Tattoo & Piercing",
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
  ["Sesión 4-5 hrs aprox.", "4-5 hr session", "6500 MXN", "400 USD"],
  ["Piercing facial", "Facial piercing", "550 MXN", "35 USD"],
  ["Piercing genital", "Genital piercing", "1000 MXN", "65 USD"],
];

const contacts = {
  barber: {
    phone: "529843675261",
    display: "+52 984 367 5261",
    instagram: "Instagram",
    url: "https://www.instagram.com/mambas_barberia.pdc/",
  },
  tattoo: {
    phone: "529841820414",
    display: "+52 984 182 0414",
    instagram: "Instagram",
    url: "https://www.instagram.com/mambas.tattoocuts/",
  },
};

const googleMapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Mambas%20Tattoo%20%26%20Cuts%20Calle%201%20Sur%20Av.%2025%20Sur%20Playa%20del%20Carmen";
const depositPaymentUrl = "https://mpago.la/2Nc6MvU";

const barberGallery: GalleryItem[] = [
  {
    src: "/gallery/barber/barber11.png",
    label: { es: "Ritual de navaja", en: "Razor ritual" },
    alt: {
      es: "Barbero de Mambas realizando servicio con navaja en barbería",
      en: "Mambas barber performing a razor service inside the barbershop",
    },
  },
  {
    src: "/gallery/barber/barber12.png",
    label: { es: "Navaja clásica", en: "Classic razor" },
    alt: {
      es: "Detalle de navaja para servicio de barbería en Mambas",
      en: "Close-up of a razor blade for barbershop service at Mambas",
    },
  },
  {
    src: "/gallery/barber/barber14.png",
    label: { es: "Barbería en acción", en: "Barbershop in action" },
    alt: {
      es: "Barbero de Mambas trabajando con guantes y navaja",
      en: "Mambas barber working with gloves and razor",
    },
  },
  {
    src: "/gallery/barber/barber15.png",
    label: { es: "Perfilado", en: "Line-up" },
    alt: {
      es: "Servicio de perfilado y corte con navaja en Mambas Barbería",
      en: "Line-up and razor haircut service at Mambas Barbershop",
    },
  },
  {
    src: "/gallery/barber/barber16.png",
    label: { es: "Barbera Mambas", en: "Mambas barber" },
    alt: {
      es: "Barbera de Mambas posando en estación de trabajo",
      en: "Mambas barber posing at her workstation",
    },
  },
  {
    src: "/gallery/barber/IMG_3034.jpg",
    label: { es: "Corte con diseño", en: "Designed cut" },
    alt: {
      es: "Corte infantil con fade y diseño de líneas en Mambas Barbería",
      en: "Kids fade haircut with line design at Mambas Barbershop",
    },
  },
  {
    src: "/gallery/barber/IMG_3036.jpg",
    label: { es: "Trenzas + fade", en: "Braids + fade" },
    alt: {
      es: "Corte fade con trenzas y barba perfilada de Mambas Barbería",
      en: "Fade haircut with braids and shaped beard by Mambas Barbershop",
    },
  },
  {
    src: "/gallery/barber/IMG_3037.jpg",
    label: { es: "Fade clásico", en: "Classic fade" },
    alt: {
      es: "Corte fade clásico con barba en la barbería Mambas",
      en: "Classic fade haircut with beard at Mambas Barbershop",
    },
  },
];

const tattooGallery: GalleryItem[] = [
  {
    src: "/gallery/tattoo/tatuaje1.png",
    label: { es: "Blackwork pantera", en: "Blackwork panther" },
    alt: {
      es: "Tatuaje blackwork de pantera en pecho hecho por Mambas Tattoo",
      en: "Blackwork panther chest tattoo by Mambas Tattoo",
    },
  },
  {
    src: "/gallery/tattoo/tatuaje2.png",
    label: { es: "Pieza de pecho", en: "Chest piece" },
    alt: {
      es: "Tatuaje de pecho con serpiente y cráneo realizado por Mambas Tattoo",
      en: "Chest tattoo with snake and skull by Mambas Tattoo",
    },
  },
  {
    src: "/gallery/tattoo/tatuaje3.jpg",
    label: { es: "Lettering cuello", en: "Neck lettering" },
    alt: {
      es: "Tatuaje de lettering en cuello realizado por Mambas Tattoo",
      en: "Neck lettering tattoo by Mambas Tattoo",
    },
  },
  {
    src: "/gallery/tattoo/tatuaje4.png",
    label: { es: "Blackwork hombro", en: "Shoulder blackwork" },
    alt: {
      es: "Tatuaje blackwork de hombro con diseño abstracto orgánico realizado por Mambas Tattoo",
      en: "Shoulder blackwork tattoo with organic abstract design by Mambas Tattoo",
    },
  },
  {
    src: "/gallery/tattoo/tatuaje6.png",
    label: { es: "Pieza ilustrativa", en: "Illustrative piece" },
    alt: {
      es: "Tatuaje ilustrativo en brazo con sombreado negro realizado por Mambas Tattoo",
      en: "Illustrative arm tattoo with black shading by Mambas Tattoo",
    },
  },
  {
    src: "/gallery/tattoo/tatuaje7.png",
    label: { es: "Manga dragón", en: "Dragon sleeve" },
    alt: {
      es: "Tatuaje de manga con dragón y sombreado negro realizado por Mambas Tattoo",
      en: "Dragon sleeve tattoo with black shading by Mambas Tattoo",
    },
  },
  {
    src: "/gallery/tattoo/tatuaje8.png",
    label: { es: "Dragón blackwork", en: "Blackwork dragon" },
    alt: {
      es: "Tatuaje blackwork de dragón en brazo realizado por Mambas Tattoo",
      en: "Blackwork dragon arm tattoo by Mambas Tattoo",
    },
  },
  {
    src: "/gallery/tattoo/tattoo.jpg",
    label: { es: "Proceso tattoo", en: "Tattoo process" },
    alt: {
      es: "Detalle de máquina de tatuar trabajando durante una sesión en Mambas",
      en: "Close-up of a tattoo machine working during a session at Mambas",
    },
  },
  {
    src: "/gallery/tattoo/tatuador11.png",
    label: { es: "Sesión Mambas", en: "Mambas session" },
    alt: {
      es: "Tatuador de Mambas trabajando en una pieza durante sesión",
      en: "Mambas tattoo artist working on a piece during a session",
    },
  },
  {
    src: "/gallery/tattoo/tatuador2.jpg",
    label: { es: "Tattoo ritual", en: "Tattoo ritual" },
    alt: {
      es: "Artista de Mambas tatuando brazo en el estudio",
      en: "Mambas artist tattooing an arm inside the studio",
    },
  },
  {
    src: "/gallery/tattoo/piercing/piercing11.png",
    label: { es: "Septum + labret", en: "Septum + labret" },
    alt: {
      es: "Piercing septum y labret con joyería plateada realizado por Mambas",
      en: "Septum and labret piercing with silver jewelry by Mambas",
    },
  },
  {
    src: "/gallery/tattoo/piercing/piercing2.png",
    label: { es: "Septum dorado", en: "Gold septum" },
    alt: {
      es: "Piercing septum con joyería dorada realizado por Mambas",
      en: "Septum piercing with gold jewelry by Mambas",
    },
  },
  {
    src: "/gallery/tattoo/piercing/piercing3.png",
    label: { es: "Nostril", en: "Nostril" },
    alt: {
      es: "Piercing nostril con joyería discreta realizado por Mambas",
      en: "Nostril piercing with minimal jewelry by Mambas",
    },
  },
  {
    src: "/gallery/tattoo/piercing/piercing4.png",
    label: { es: "Labret vertical", en: "Vertical labret" },
    alt: {
      es: "Piercing labret vertical con joyería plateada realizado por Mambas",
      en: "Vertical labret piercing with silver jewelry by Mambas",
    },
  },
  {
    src: "/gallery/tattoo/piercing/piercing5.png",
    label: { es: "Septum", en: "Septum" },
    alt: {
      es: "Piercing septum con joyería plateada realizado por Mambas",
      en: "Septum piercing with silver jewelry by Mambas",
    },
  },
];

export default function Home() {
  const [language, setLanguage] = useState<Language>("es");
  const [mode, setMode] = useState<ServiceMode>("barber");
  const [saved, setSaved] = useState(false);
  const [centimeters, setCentimeters] = useState(3);
  const [detail, setDetail] = useState(1);
  const [zone, setZone] = useState(1);
  const [copied, setCopied] = useState(false);
  const [floatingOpen, setFloatingOpen] = useState(false);
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

    const payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      birthday: formData.get("birthday"),
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

      <section id="barberia" className="service-section">
        <SectionHeader title={t.barberTitle} slogan={t.barberSlogan} />
        <PriceGrid rows={barberServices} language={language} />
        <div className="mx-auto mt-12 max-w-7xl">
          <div className="gallery-shell">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#d6ad4a]">
                  Galería
                </p>
                <h3 className="mt-3 text-3xl font-black uppercase tracking-[0.04em] text-white">
                  {language === "es" ? "Barbería Mambas" : "Mambas Barbershop"}
                </h3>
              </div>
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Mambas
              </p>
            </div>
            <div className="gallery-viewport">
              <div className="gallery-track gallery-track-barber">
                {[...barberGallery, ...barberGallery].map((item, index) => (
                  <div key={`${item.src}-${index}`} className="gallery-card">
                    <div className="gallery-frame">
                      <Image
                        src={item.src}
                        alt={item.alt[language]}
                        fill
                        sizes="(max-width: 640px) 260px, 320px"
                        className={item.imageClassName || "object-cover"}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-zinc-400">
              {language === "es"
                ? "Cortes, ritual de barba y servicios premium con acabado limpio."
                : "Haircuts, beard ritual and premium services with a clean finish."}
            </p>
          </div>
        </div>
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
        <div className="mx-auto mt-12 max-w-7xl">
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
            <div className="gallery-viewport">
              <div className="gallery-track gallery-track-tattoo">
                {[...tattooGallery, ...tattooGallery].map((item, index) => (
                  <div key={`${item.src}-${index}`} className="gallery-card">
                    <div className="gallery-frame">
                      <Image
                        src={item.src}
                        alt={item.alt[language]}
                        fill
                        sizes="(max-width: 640px) 260px, 320px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-zinc-400">
              {language === "es"
                ? "Piezas personalizadas, piercing profesional y procesos cuidados."
                : "Custom pieces, professional piercing and careful process."}
            </p>
          </div>
        </div>
        <ContactStrip kind="tattoo" language={language} />
      </section>

      <section
        id="anticipo"
        className="overflow-hidden border-t border-[#d6ad4a]/20 bg-black px-4 py-20 sm:px-6"
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
            <p className="mt-3 text-sm text-zinc-400">
              {t.loyaltySummary}
            </p>
          </div>
          <div className="sm:col-span-1">
            <form
              onSubmit={handleRegister}
              className="panel grid gap-4 sm:grid-cols-2 p-6 rounded-2xl border border-[#d6ad4a]/20 bg-gradient-to-b from-[#070707] to-[#030303] shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
            >
              {/* Honeypot: hidden from users, bots fill it and get rejected */}
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
              <label className="flex min-w-0 flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                  {t.birthday}
                </span>
                <input
                  name="birthday"
                  type="date"
                  aria-label={t.birthday}
                  className="field focus:outline-none focus:ring-2 focus:ring-[#d6ad4a]/40 transition-shadow"
                />
              </label>
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

      <section id="ubicacion" className="px-4 py-20 sm:px-6">
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

      <section className="border-t border-[#d6ad4a]/20 px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-kicker">GOOGLE MAPS</p>
            <h2 className="section-title">{t.reviewsTitle}</h2>
          </div>
          <div>
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
          </div>
        </div>
      </section>

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

function LocationMapCard({ language }: { language: Language }) {
  const embedUrl =
    "https://www.google.com/maps?q=Mambas%20Tattoo%20%26%20Cuts%2C%20Calle%201%20Sur%20esquina%20Av.%2025%20Sur%2C%20Centro%2C%20Playa%20del%20Carmen&z=16&output=embed";

  return (
    <div className="overflow-hidden rounded-2xl border border-[#d6ad4a]/24 bg-black shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
      <iframe
        src={embedUrl}
        title={
          language === "es"
            ? "Mapa de Mambas Tattoo & Cuts en Playa del Carmen"
            : "Map of Mambas Tattoo & Cuts in Playa del Carmen"
        }
        className="h-[320px] w-full sm:h-[380px]"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
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
