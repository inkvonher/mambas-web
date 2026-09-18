export type Language = "es" | "en";
export type ServiceMode = "barber" | "tattoo";
export type GalleryItem = {
  src: string;
  label: Record<Language, string>;
  alt: Record<Language, string>;
  imageClassName?: string;
  video?: string;
};

export type ProductCategory =
  | "all"
  | "aftercare"
  | "apparel"
  | "piercing"
  | "barber"
  | "cards";

export type Product = {
  id: string;
  name: Record<Language, string>;
  category: ProductCategory;
  priceMXN: number;
  priceUSD: number;
  description: Record<Language, string>;
  image: string;
  badge?: Record<Language, string>;
  sizes?: string[];
  inStock: boolean;
};

export const copy = {
  es: {
    nav: ["Inicio", "Barbería", "Tattoo", "Tienda", "Anticipo", "Lealtad", "Ubicación"],
    heroKicker: "Barbería tradicional mexicana · Tatuaje ritual · Piercing",
    heroText:
      "Desde 2021 en el corazón de Playa del Carmen, a unas calles del ferry a Cozumel. Certificados ante COFEPRIS.",
    barberCta: "Reservar barbería",
    tattooCta: "Cotizar tattoo",
    storeCta: "Ver tienda",
    aboutTitle: "Quiénes somos",
    about:
      "Mambas Tattoo & Cuts une barbería tradicional mexicana, tatuaje ritual y piercing en un espacio sobrio, cuidado y profesional.",
    barberTitle: "Barbería",
    barberSlogan: "LUCE FRESCO",
    tattooTitle: "Tattoo & Piercing",
    tattooSlogan: "FREEWILL",
    storeTitle: "Tienda Oficial",
    storeSlogan: "MAMBAS MERCH & CARE",
    storeSubtitle:
      "Cuidado profesional de grado médico para tatuajes y piercings, productos de barbería tradicional y prendas oficiales exclusivas.",
    allCategories: "Todos",
    catAftercare: "Aftercare & Cuidado",
    catApparel: "Ropa & Merch",
    catPiercing: "Joyería Titanio",
    catBarber: "Barbería",
    catCards: "Certificados de Regalo",
    addToCart: "Agregar al carrito",
    addedToCart: "¡Agregado!",
    buyNow: "Comprar directo",
    cartTitle: "Carrito de Compras",
    cartEmpty: "Tu carrito está vacío.",
    cartTotal: "Total estimado",
    checkoutWhatsApp: "Pedir por WhatsApp",
    clearCart: "Vaciar carrito",
    selectSize: "Talla:",
    memberDiscountNote:
      "Miembros de Mambas Club (Black, Gold, Ritual) reciben descuentos y beneficios exclusivos.",
    pickupNote:
      "Entregas directas en nuestro estudio (Playa del Carmen) o envíos a todo México.",
    included: "Included",
    barberNote:
      "Disfruta de un facial relajante con toallas calientes y frías al finalizar tu servicio.",
    tattooNote:
      "El precio por pieza depende del nivel de detalle, centímetros, estilo y zona a tatuar.",
    piercingNote:
      "Los servicios incluyen anestesia tópica en caso de requerirla.",
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
      "Aceptamos transferencias bancarias SPEI, Mercado Pago y pago directo en efectivo en nuestro estudio.",
    storePaymentNote:
      "Formas de pago: Transferencia SPEI • Mercado Pago • Efectivo en tienda",
    floatingBarber: "Barbería",
    floatingTattoo: "Tattoo & Piercing",
  },
  en: {
    nav: ["Home", "Barbershop", "Tattoo", "Store", "Deposit", "Loyalty", "Location"],
    heroKicker: "Traditional Mexican barbershop · Ritual tattoo · Piercing",
    heroText:
      "Since 2021 in the heart of Playa del Carmen, a few blocks from the Cozumel ferry. COFEPRIS certified.",
    barberCta: "Book barbershop",
    tattooCta: "Quote tattoo",
    storeCta: "View store",
    aboutTitle: "Who we are",
    about:
      "Mambas Tattoo & Cuts brings together traditional Mexican barbering, ritual tattooing and piercing in a clean, focused and professional space.",
    barberTitle: "Barbershop",
    barberSlogan: "LOOK FRESH",
    tattooTitle: "Tattoo & Piercing",
    tattooSlogan: "FREEWILL",
    storeTitle: "Official Store",
    storeSlogan: "MAMBAS MERCH & CARE",
    storeSubtitle:
      "Medical-grade tattoo & piercing aftercare, traditional grooming essentials and exclusive official apparel.",
    allCategories: "All",
    catAftercare: "Aftercare & Care",
    catApparel: "Apparel & Merch",
    catPiercing: "Titanium Jewelry",
    catBarber: "Barbershop",
    catCards: "Gift Cards",
    addToCart: "Add to cart",
    addedToCart: "Added!",
    buyNow: "Buy now",
    cartTitle: "Shopping Cart",
    cartEmpty: "Your cart is empty.",
    cartTotal: "Estimated total",
    checkoutWhatsApp: "Order via WhatsApp",
    clearCart: "Empty cart",
    selectSize: "Size:",
    memberDiscountNote:
      "Mambas Club members (Black, Gold, Ritual) receive exclusive merchandise perks and discounts.",
    pickupNote:
      "In-studio pickup in Playa del Carmen or nationwide shipping across Mexico.",
    included: "Included",
    barberNote:
      "Enjoy a relaxing facial with hot and cold towels at the end of your service.",
    tattooNote:
      "Piece pricing depends on detail level, centimeters, style and tattoo placement.",
    piercingNote:
      "Services include topical anesthesia if required.",
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
    paymentMethods:
      "We accept SPEI bank transfers, Mercado Pago, and in-person cash payments at our studio.",
    storePaymentNote:
      "Payment methods: SPEI Transfer • Mercado Pago • In-studio Cash",
    floatingBarber: "Barbershop",
    floatingTattoo: "Tattoo & Piercing",
  },
};

export const barberServices = [
  ["Corte de cabello", "Haircut", "320 MXN", "20 USD"],
  ["Ritual de barba", "Beard ritual", "290 MXN", "18 USD"],
  ["Delineado general", "General line-up", "210 MXN", "13 USD"],
  ["Cejas o bigote", "Eyebrows or mustache", "150 MXN", "10 USD"],
  ["Facial + vapor", "Facial + steam", "230 MXN", "14 USD"],
  ["Servicio VIP", "VIP service", "900 MXN", "57 USD"],
  ["Global / mechas", "Full color / highlights", "1800 MXN", "112 USD"],
  ["Trenzas desde", "Braids from", "1000 MXN", "63 USD"],
];

export const tattooPrices = [
  ["Precio mínimo", "Minimum price", "1600 MXN", "100 USD"],
  ["Sesión 4-5 hrs aprox.", "4-5 hr session", "6500 MXN", "400 USD"],
  ["Piercing facial", "Facial piercing", "550 MXN", "35 USD"],
  ["Piercing genital", "Genital piercing", "1000 MXN", "65 USD"],
];

export type Review = {
  name: string;
  initials: string;
  stars: number;
  localGuide: boolean;
  time: Record<Language, string>;
  text: string;
};

export const reviews: Review[] = [
  {
    name: "Lorena Rosas",
    initials: "LR",
    stars: 5,
    localGuide: true,
    time: { es: "Hace un año", en: "A year ago" },
    text: "Super recomendado, ya me he tatuado ahí varias veces y todo súper bien. También los servicios de barbería excelentes.",
  },
  {
    name: "Iván Castellón",
    initials: "IC",
    stars: 5,
    localGuide: false,
    time: { es: "Hace un año", en: "A year ago" },
    text: "A todos mis amigos y conocidos les recomiendo rayarse ahí. Recuerdo que solo iba por un tatuaje y ya llevo 10, y no cambio ese estudio para nada. Qué buen trabajo, y la persona encargada increíble.",
  },
  {
    name: "Javier Monroy",
    initials: "JM",
    stars: 5,
    localGuide: true,
    time: { es: "Hace 3 años", en: "3 years ago" },
    text: "El lugar siempre se encuentra limpio y fresco, las personas que trabajan ahí son super amables y atentos, te ayudan con cualquier duda sobre el corte o tatuaje que deseas. Excelentes personas y un servicio increíble.",
  },
  {
    name: "Marlon Benítez",
    initials: "MB",
    stars: 5,
    localGuide: false,
    time: { es: "Hace un año", en: "A year ago" },
    text: "Quedé muy feliz con mis tatuajes ❤️ La calidad del trabajo es excelente, con un ambiente cómodo y servicio muy ameno ✨ No puedo esperar para regresar.",
  },
  {
    name: "Didiel Estrella",
    initials: "DE",
    stars: 5,
    localGuide: false,
    time: { es: "Hace un año", en: "A year ago" },
    text: "Muy buenos. La chica Karen es excelente 😍 amé mi tatuaje 😍 Muy limpio y todo higiénico con las herramientas.",
  },
  {
    name: "Alex Pérez",
    initials: "AP",
    stars: 5,
    localGuide: false,
    time: { es: "Hace 4 años", en: "4 years ago" },
    text: "¡Definitivamente el mejor lugar de Playa para tener el mejor look! Atendido por la mismísima Yam, quien es una experta y cada corte de cabello lo convierte en una obra de arte.",
  },
];

export const contacts = {
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

export const googleMapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Mambas%20Tattoo%20%26%20Cuts%20Calle%201%20Sur%20Av.%2025%20Sur%20Playa%20del%20Carmen";
export const depositPaymentUrl = "https://mpago.la/2Nc6MvU";
export const barberBookingUrl = "https://calendar.app.google/N2Vq9L7HwybvPXZW8";

export const barberGallery: GalleryItem[] = [
  {
    src: "/gallery/barber/barber11.png",
    label: { es: "Ritual de navaja", en: "Razor ritual" },
    alt: {
      es: "Barbero de Mambas realizando servicio con navaja en barbería",
      en: "Mambas barber performing a razor service inside the barbershop",
    },
  },
  {
    src: "/gallery/barber/videos/video1.jpg",
    video: "/gallery/barber/videos/video1.mp4",
    label: { es: "Corte en vivo", en: "Live cut" },
    alt: {
      es: "Video de corte de cabello en Mambas Barbería",
      en: "Haircut video at Mambas Barbershop",
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
    src: "/gallery/barber/videos/video2.jpg",
    video: "/gallery/barber/videos/video2.mp4",
    label: { es: "Fade en vivo", en: "Live fade" },
    alt: {
      es: "Video de fade en Mambas Barbería",
      en: "Fade haircut video at Mambas Barbershop",
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

export const tattooGallery: GalleryItem[] = [
  {
    src: "/gallery/tattoo/tnew1.jpg",
    label: { es: "Pieza en muslo", en: "Thigh piece" },
    alt: {
      es: "Tatuaje detallado de figura egipcia en el muslo por Mambas Tattoo",
      en: "Detailed Egyptian figure thigh tattoo by Mambas Tattoo",
    },
  },
  {
    src: "/gallery/tattoo/videos/video1.jpg",
    video: "/gallery/tattoo/videos/video1.mp4",
    label: { es: "Blackout en vivo", en: "Blackout in progress" },
    alt: {
      es: "Video de manga blackwork sólida realizada por Mambas Tattoo",
      en: "Video of a solid blackwork sleeve by Mambas Tattoo",
    },
  },
  {
    src: "/gallery/tattoo/tnew2.jpg",
    label: { es: "Ojo de Horus", en: "Eye of Horus" },
    alt: {
      es: "Tatuaje de Ojo de Horus en antebrazo por Mambas Tattoo",
      en: "Eye of Horus forearm tattoo by Mambas Tattoo",
    },
  },
  {
    src: "/gallery/tattoo/tnew3.jpg",
    label: { es: "Lettering cuello", en: "Neck lettering" },
    alt: {
      es: "Tatuaje de lettering en el cuello por Mambas Tattoo",
      en: "Neck lettering tattoo by Mambas Tattoo",
    },
  },
  {
    src: "/gallery/tattoo/videos/video2.jpg",
    video: "/gallery/tattoo/videos/video2.mp4",
    label: { es: "Pieza floral en vivo", en: "Floral piece in progress" },
    alt: {
      es: "Video de tatuaje floral en la espalda por Mambas Tattoo",
      en: "Video of a floral back tattoo by Mambas Tattoo",
    },
  },
  {
    src: "/gallery/tattoo/tnew4.jpg",
    label: { es: "Koi en costillas", en: "Koi on ribs" },
    alt: {
      es: "Tatuaje de koi en las costillas por Mambas Tattoo",
      en: "Koi rib tattoo by Mambas Tattoo",
    },
  },
  {
    src: "/gallery/tattoo/tnew5.jpg",
    label: { es: "Escorpión", en: "Scorpion" },
    alt: {
      es: "Tatuaje de escorpión en el costado por Mambas Tattoo",
      en: "Scorpion side tattoo by Mambas Tattoo",
    },
  },
  {
    src: "/gallery/tattoo/tnew6.jpg",
    label: { es: "Plumas blackwork", en: "Blackwork feathers" },
    alt: {
      es: "Tatuaje blackwork de plumas por Mambas Tattoo",
      en: "Blackwork feather tattoo by Mambas Tattoo",
    },
  },
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

export type CartItem = {
  product: Product;
  quantity: number;
  selectedSize?: string;
};

export const products: Product[] = [
  {
    id: "balsamo-aftercare",
    name: {
      es: "Bálsamo Cicatrizante Tattoo Mambas (50g)",
      en: "Mambas Tattoo Healing Balm (50g)",
    },
    category: "aftercare",
    priceMXN: 220,
    priceUSD: 14,
    description: {
      es: "Fórmula 100% orgánica y vegana con extracto de caléndula, manteca de karité y vitamina E. Regenera e hidrata profundamente la piel recién tatuada sin obstruir los poros.",
      en: "100% organic & vegan formula infused with calendula extract, shea butter and Vitamin E. Deeply hydrates and heals fresh tattoos without clogging pores.",
    },
    image: "/gallery/tattoo/tattoo.jpg",
    badge: { es: "Bestseller", en: "Bestseller" },
    inStock: true,
  },
  {
    id: "espuma-antiseptica",
    name: {
      es: "Espuma Limpiadora Antiséptica Foam Soap (150ml)",
      en: "Antiseptic Cleansing Foam Soap (150ml)",
    },
    category: "aftercare",
    priceMXN: 180,
    priceUSD: 11,
    description: {
      es: "Jabón líquido neutro antibacterial en espuma para la higiene diaria de tatuajes y piercings. Alivia la irritación, desinflama y elimina residuos de tinta y exudado.",
      en: "Gentle antibacterial foaming soap for daily tattoo & piercing care. Soothes redness, reduces inflammation and gently removes plasma and excess ink.",
    },
    image: "/gallery/tattoo/tatuador11.png",
    badge: { es: "Recomendado", en: "Staff Pick" },
    inStock: true,
  },
  {
    id: "playera-black-gold",
    name: {
      es: "Playera Mambas 'Black & Gold' (Edición 2026)",
      en: "Mambas 'Black & Gold' T-Shirt (2026 Edition)",
    },
    category: "apparel",
    priceMXN: 450,
    priceUSD: 28,
    description: {
      es: "Algodón peinado premium de 240g, corte oversized relajado. Serigrafía dorada de alta densidad con el emblemático cráneo y serpiente de Mambas.",
      en: "240gsm premium heavyweight combed cotton with a relaxed oversized fit. High-density gold screenprint featuring Mambas signature skull & serpent art.",
    },
    image: "/logo.png",
    badge: { es: "Edición Limitada", en: "Limited Drop" },
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
  },
  {
    id: "hoodie-ritual",
    name: {
      es: "Hoodie Mambas Ritual Blackwork",
      en: "Mambas Ritual Blackwork Hoodie",
    },
    category: "apparel",
    priceMXN: 850,
    priceUSD: 53,
    description: {
      es: "Sudadera afelpada pesada con capucha forrada y bolsillo canguro. Arte místico en espalda y tipografía gótica en mangas.",
      en: "Heavyweight fleece hoodie with lined hood and kangaroo pocket. Mystic backpiece artwork and gothic lettering across the sleeves.",
    },
    image: "/logo.png",
    badge: { es: "Exclusivo", en: "Exclusive" },
    sizes: ["M", "L", "XL"],
    inStock: true,
  },
  {
    id: "gorra-snapback",
    name: {
      es: "Gorra Snapback Mambas Skull & Snake",
      en: "Mambas Skull & Snake Snapback Cap",
    },
    category: "apparel",
    priceMXN: 380,
    priceUSD: 24,
    description: {
      es: "Gorra estructurada de 6 paneles con visera plana y broche ajustable. Bordado 3D frontal en hilo dorado metalizado.",
      en: "Structured 6-panel snapback cap with flat brim and adjustable closure. 3D metallic gold front embroidery.",
    },
    image: "/gallery/mbs3.jpg",
    inStock: true,
  },
  {
    id: "clicker-titanio",
    name: {
      es: "Argolla Clicker Titanio ASTM F-136 Grado Implante",
      en: "Titanium Segment Clicker Ring ASTM F-136",
    },
    category: "piercing",
    priceMXN: 350,
    priceUSD: 22,
    description: {
      es: "Joyería estéril de titanio biocompatible de alta pureza. Mecanismo de cierre clicker suave para septum, hélice, daith o conch. No se despinta ni causa alergias.",
      en: "Implant-grade biocompatible ASTM F-136 titanium jewelry. Smooth clicker closure ideal for septum, helix, daith or conch piercings. Hypoallergenic.",
    },
    image: "/gallery/tattoo/piercing/piercing2.png",
    badge: { es: "Titanio F-136", en: "Titanium F-136" },
    inStock: true,
  },
  {
    id: "labret-zirconia",
    name: {
      es: "Labret Titanio con Zirconia Cúbica AAA",
      en: "Titanium Labret with AAA Cubic Zirconia",
    },
    category: "piercing",
    priceMXN: 300,
    priceUSD: 19,
    description: {
      es: "Poste de titanio grado implante con rosca interna y cristal de zirconia brillante con engaste biselado plano. Ideal para lóbulo, tragus o nostril.",
      en: "Internally threaded implant-grade titanium post with a brilliant bezel-set AAA cubic zirconia. Perfect for lobe, tragus or nostril piercings.",
    },
    image: "/gallery/tattoo/piercing/piercing4.png",
    inStock: true,
  },
  {
    id: "aceite-barba",
    name: {
      es: "Aceite para Barba 'Ritual Mambas' (30ml)",
      en: "Mambas Ritual Beard Oil (30ml)",
    },
    category: "barber",
    priceMXN: 260,
    priceUSD: 16,
    description: {
      es: "Elixir hidratante con aceites de jojoba, argán, cedro y bergamota. Suaviza la barba rebelde, nutre los folículos y deja un aroma amaderado sofisticado.",
      en: "Nourishing beard elixir with jojoba, argan, cedarwood and bergamot oils. Softens rough beards, hydrates follicles and leaves a refined woody scent.",
    },
    image: "/gallery/barber/barber12.png",
    inStock: true,
  },
  {
    id: "pomada-clay",
    name: {
      es: "Pomada Mate para Cabello Mambas Matte Clay (100g)",
      en: "Mambas Matte Hair Clay (100g)",
    },
    category: "barber",
    priceMXN: 240,
    priceUSD: 15,
    description: {
      es: "Fijación fuerte y flexible con acabado completamente mate sin efecto graso. Base agua que se enjuaga fácilmente sin dejar residuos.",
      en: "Strong yet pliable hold with a clean, natural matte finish and zero greasy residue. Water-soluble formula washes out effortlessly.",
    },
    image: "/gallery/barber/barber15.png",
    inStock: true,
  },
  {
    id: "gift-card-tattoo",
    name: {
      es: "Certificado de Regalo / Gift Card Mambas",
      en: "Mambas Gift Card / Studio Certificate",
    },
    category: "cards",
    priceMXN: 1000,
    priceUSD: 60,
    description: {
      es: "Certificado digital o físico canjeable por sesiones de tatuaje, perforaciones, cortes o productos del estudio en Playa del Carmen. Válido por 12 meses.",
      en: "Digital or physical gift certificate redeemable for tattoo sessions, piercings, haircuts or official store products in Playa del Carmen. Valid for 12 months.",
    },
    image: "/logo.png",
    badge: { es: "Regalo Ideal", en: "Ideal Gift" },
    inStock: true,
  },
];
