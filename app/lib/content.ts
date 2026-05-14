export type Language = "en" | "es";

export const content = {
  en: {
    navbar: {
      home: "Home",
      barberia: "Barbershop",
      tattoo: "Tattoo & Piercing",
      loyalty: "Loyalty",
      location: "Location",
      contact: "Contact",
    },
    hero: {
      title: "MAMBAS TATTOO & CUTS",
      subtitle: "Traditional Mexican Barbershop · Tattoo Ritual · Piercing",
      description:
        "Located in the heart of Playa del Carmen, just steps from the ferry to Cozumel.",
      cta: "BOOK NOW",
    },
    barberia: {
      title: "Mambas Barbería",
      slogan: "LOOK FRESH",
      description:
        "Traditional Mexican barbershop experience with premium services.",
      services: [
        { name: "Haircut", price: "320 MXN / $20 USD" },
        { name: "Beard Ritual", price: "290 MXN / $18 USD" },
        { name: "General Outline", price: "210 MXN / $13 USD" },
        { name: "Eyebrows or Mustache", price: "150 MXN / $10 USD" },
        { name: "Facial + Steam", price: "230 MXN / $14 USD" },
        { name: "VIP Service", price: "900 MXN / $57 USD" },
        { name: "Highlights / Color", price: "1800 MXN / $112 USD" },
        { name: "Braids from", price: "1000 MXN / $63 USD" },
      ],
      note: "Complimentary drink and relaxing facial for our clients.",
      whatsapp: "+529843675261",
      instagram: "@MAMBAS_BARBERIA.PDC",
    },
    tattoo: {
      title: "Mambas Tattoo Studio",
      slogan: "FREEWILL",
      description: "Ritual tattoo and piercing services by certified artists.",
      tattooServices: [
        { name: "Minimum Price", price: "1600 MXN / $100 USD" },
        { name: "Session 4-5 hrs", price: "6500 MXN / $400 USD" },
      ],
      pierceServices: [
        { name: "Facial Piercing", price: "550 MXN / $35 USD" },
        { name: "Genital Piercing", price: "1000 MXN / $65 USD" },
      ],
      tattooNote:
        "Pricing depends on detail level, centimeters, style and location.",
      pierceNote:
        "Services include topical anesthesia if required. Complimentary drink for clients.",
      whatsapp: "+529841820414",
      instagram: "@MAMBAS.TATTOOCUTS",
    },
    loyalty: {
      title: "Loyalty & Membership",
      slogan: "EXCLUSIVE BENEFITS",
      benefits: [
        "Special Prices",
        "Exclusive Benefits",
        "Special Pricing on Merchandise & Pre-Release Access",
        "Birthday Discounts",
        "Priority Access to Events",
      ],
      cta: "REGISTER",
    },
    about: {
      title: "About Mambas",
      description:
        "Traditional Mexican barbershop, tattoo studio and piercing service since 2021. Certified by COFEPRIS.",
      inclusive:
        "Inclusive space. We do not discriminate. LGBTQ+ Friendly. Pet Friendly.",
    },
    location: {
      title: "Location",
      address:
        "Calle 1 Sur corner Av. 25 Sur, Centro, Playa del Carmen, Quintana Roo",
      mapsTitle: "Find Us",
    },
    reviews: {
      title: "Reviews",
      subtitle: "What our clients say",
    },
    contact: {
      title: "Get in Touch",
      subtitle: "Contact us on WhatsApp",
      barberaButton: "Barbershop",
      tattooButton: "Tattoo Shop",
    },
    footer: {
      copyright: "© 2021 Mambas Tattoo & Cuts. All rights reserved.",
      certified: "Certified by COFEPRIS",
    },
  },
  es: {
    navbar: {
      home: "Inicio",
      barberia: "Barbería",
      tattoo: "Tatuaje & Perforación",
      loyalty: "Lealtad",
      location: "Ubicación",
      contact: "Contacto",
    },
    hero: {
      title: "MAMBAS TATTOO & CUTS",
      subtitle: "Barbería tradicional mexicana · Ritual Tattoo · Perforación",
      description:
        "Ubicado en el corazón de Playa del Carmen, a unas calles del ferry a Cozumel.",
      cta: "RESERVAR",
    },
    barberia: {
      title: "Mambas Barbería",
      slogan: "LUCE FRESCO",
      description:
        "Experiencia de barbería tradicional mexicana con servicios premium.",
      services: [
        { name: "Corte de cabello", price: "320 MXN / $20 USD" },
        { name: "Ritual de barba", price: "290 MXN / $18 USD" },
        { name: "Delineado general", price: "210 MXN / $13 USD" },
        { name: "Cejas o bigote", price: "150 MXN / $10 USD" },
        { name: "Facial + vapor", price: "230 MXN / $14 USD" },
        { name: "Servicio VIP", price: "900 MXN / $57 USD" },
        { name: "Global / mechas", price: "1800 MXN / $112 USD" },
        { name: "Trenzas desde", price: "1000 MXN / $63 USD" },
      ],
      note: "Bebida + facial relajante de cortesía para nuestros clientes.",
      whatsapp: "+529843675261",
      instagram: "@MAMBAS_BARBERIA.PDC",
    },
    tattoo: {
      title: "Mambas Tattoo Studio",
      slogan: "FREEWILL",
      description:
        "Servicios de tatuaje ritual y perforación por artistas certificados.",
      tattooServices: [
        { name: "Precio mínimo", price: "1600 MXN / $100 USD" },
        { name: "Sesión 4-5 hrs aprox.", price: "6500 MXN / $400 USD" },
      ],
      pierceServices: [
        { name: "Faciales", price: "550 MXN / $35 USD" },
        { name: "Genitales", price: "1000 MXN / $65 USD" },
      ],
      tattooNote:
        "Precio por pieza depende del nivel de detalle, centímetros, estilo y zona a tatuar.",
      pierceNote:
        "Servicios incluyen anestesia tópica en caso de requerirla. Bebida de cortesía para clientes.",
      whatsapp: "+529841820414",
      instagram: "@MAMBAS.TATTOOCUTS",
    },
    loyalty: {
      title: "Lealtad y Membresía",
      slogan: "BENEFICIOS EXCLUSIVOS",
      benefits: [
        "Precios especiales",
        "Beneficios exclusivos",
        "Acceso a mercancía con precios especiales o preventa exclusiva",
        "Descuentos de cumpleaños",
        "Acceso prioritario a eventos",
      ],
      cta: "REGISTRARSE",
    },
    about: {
      title: "Sobre Mambas",
      description:
        "Barbería tradicional mexicana, estudio de tatuajes y piercing desde 2021. Certificados ante COFEPRIS.",
      inclusive:
        "Espacio inclusivo. No discriminamos a nadie. LGBTQ+ friendly. Pet friendly.",
    },
    location: {
      title: "Ubicación",
      address:
        "Calle 1 Sur esq. Av. 25 Sur, Centro, Playa del Carmen, Quintana Roo",
      mapsTitle: "Encuéntranos",
    },
    reviews: {
      title: "Opiniones",
      subtitle: "Lo que dicen nuestros clientes",
    },
    contact: {
      title: "Ponte en Contacto",
      subtitle: "Contáctanos por WhatsApp",
      barberaButton: "Barbería",
      tattooButton: "Tattoo Shop",
    },
    footer: {
      copyright: "© 2021 Mambas Tattoo & Cuts. Todos los derechos reservados.",
      certified: "Certificado por COFEPRIS",
    },
  },
};
