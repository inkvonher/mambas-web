/**
 * Mambas — Sincronización Google Calendar <-> Panel Admin (Fase 1: creación)
 * Pegar en script.google.com (misma cuenta del calendario).
 * Activador recomendado: función `syncCalendar`, cada 5 minutos.
 */

// === CONFIGURA ESTO ===
const SITE = "https://mambaspdc.com";
const SYNC_SECRET = "PEGA_AQUI_TU_SYNC_SECRET";   // el mismo que pusiste en Vercel
const TIMEZONE = "America/Cancun";                // Cancún/Playa = UTC-5 todo el año
const TZ_OFFSET = "-05:00";

// Avisos por WhatsApp (CallMeBot)
const WHATSAPP_PHONE = "+5219843675261";
const CALLMEBOT_APIKEY = "8604341";

// Calendario donde caen las RESERVAS EN LÍNEA (tu horario de citas de Google).
const BOOKING_CAL_ID = "clandestinobeer9@gmail.com";
// ======================

function syncCalendar() {
  try {
    pushAdminToGoogle();
  } catch (e) {
    Logger.log("Error en pushAdminToGoogle: " + e);
  }
  try {
    importGoogleToAdmin();
  } catch (e) {
    Logger.log("Error en importGoogleToAdmin: " + e);
  }
}

function authHeaders() {
  return { Authorization: "Bearer " + SYNC_SECRET };
}

// 1) Citas creadas en el panel admin -> eventos en Google Calendar
function pushAdminToGoogle() {
  const res = UrlFetchApp.fetch(SITE + "/api/sync/pending", {
    headers: authHeaders(),
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) {
    Logger.log("pending error: " + res.getContentText());
    return;
  }
  const list = JSON.parse(res.getContentText()).appointments || [];
  const cal = CalendarApp.getDefaultCalendar();

  list.forEach(function (a) {
    var t = a.appointment_time || "00:00";
    if (t.length === 5) t = t + ":00"; // "HH:mm" -> "HH:mm:ss"
    const start = new Date(a.appointment_date + "T" + t + TZ_OFFSET);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const tipo = a.category === "tattoo" ? "Tattoo" : "Barbería";
    const title = tipo + " · " + (a.client_name || "Cita");
    const desc =
      "Cita creada desde el panel admin de Mambas\n" +
      "Tel: " + (a.client_phone || "-") + "\n" +
      (a.notes || "");

    const ev = cal.createEvent(title, start, end, { description: desc });
    ev.setTag("mambasSource", "admin"); // evita reimportarla y el aviso doble

    UrlFetchApp.fetch(SITE + "/api/sync/mark", {
      method: "post",
      contentType: "application/json",
      headers: authHeaders(),
      payload: JSON.stringify({ id: a.id, gcal_event_id: ev.getId() }),
      muteHttpExceptions: true,
    });

    sendWhatsApp(ev, "🗓️ *Nueva cita (panel) - Mambas*");
  });
}

// 2) Reservas nuevas en Google Calendar -> citas en el panel admin (+ WhatsApp)
function importGoogleToAdmin() {
  const props = PropertiesService.getScriptProperties();
  const now = Date.now();
  const stored = props.getProperty("lastCheck");
  if (!stored) {
    props.setProperty("lastCheck", String(now)); // primera vez: solo baseline
    return;
  }
  const last = Number(stored);

  // Lee el calendario de las reservas en línea (no el principal).
  const cal = CalendarApp.getCalendarById(BOOKING_CAL_ID);
  const from = new Date(now - 24 * 60 * 60 * 1000);
  const to = new Date(now + 120 * 24 * 60 * 60 * 1000);
  const events = cal.getEvents(from, to);

  events.forEach(function (ev) {
    if (ev.getDateCreated().getTime() <= last) return;     // ya revisado
    if (ev.getTag("mambasSource") === "admin") return;     // la creamos nosotros

    const start = ev.getStartTime();
    const payload = {
      gcal_event_id: ev.getId(),
      client_name: ev.getTitle(),
      client_phone: "",
      service: ev.getTitle(),
      category: "barber", // por ahora la reserva en línea es barbería
      appointment_date: Utilities.formatDate(start, TIMEZONE, "yyyy-MM-dd"),
      appointment_time: Utilities.formatDate(start, TIMEZONE, "HH:mm"),
      notes: (ev.getDescription() || "").replace(/<[^>]*>/g, "").trim().substring(0, 500),
    };

    const res = UrlFetchApp.fetch(SITE + "/api/sync/from-google", {
      method: "post",
      contentType: "application/json",
      headers: authHeaders(),
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    });

    if (res.getResponseCode() === 200) {
      const j = JSON.parse(res.getContentText());
      if (!j.skipped) sendWhatsApp(ev); // avisa solo de reservas genuinas nuevas
    } else {
      Logger.log("from-google error: " + res.getContentText());
    }
  });

  props.setProperty("lastCheck", String(now));
}

function sendWhatsApp(ev, header) {
  const fecha = Utilities.formatDate(ev.getStartTime(), TIMEZONE, "dd/MM/yyyy HH:mm");
  const desc = (ev.getDescription() || "").replace(/<[^>]*>/g, "").trim();

  let msg = (header || "🐍 *Nueva reserva - Mambas*") + "\n";
  msg += "Servicio: " + ev.getTitle() + "\n";
  msg += "Fecha: " + fecha + "\n";
  if (desc) msg += "Detalle: " + desc.substring(0, 250);

  const url =
    "https://api.callmebot.com/whatsapp.php?phone=" +
    encodeURIComponent(WHATSAPP_PHONE) +
    "&text=" + encodeURIComponent(msg) +
    "&apikey=" + encodeURIComponent(CALLMEBOT_APIKEY);

  const resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  Logger.log("CallMeBot: " + resp.getContentText());
  Utilities.sleep(8000); // espacia los mensajes para no saturar CallMeBot (API gratis)
}
