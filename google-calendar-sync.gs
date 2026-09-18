/**
 * Mambas — Sincronización Google Calendar <-> Panel Admin (Barbería)
 * Pegar en script.google.com (en la cuenta de Google de la barbería).
 * Activador recomendado: función `syncCalendar`, cada 5 minutos.
 */

// === CONFIGURA ESTO ===
const SITE = "https://mambaspdc.com";
const SYNC_SECRET = "PEGA_AQUI_TU_SYNC_SECRET";   // El mismo que pusiste en Vercel
const TIMEZONE = "America/Cancun";                // Cancún/Playa = UTC-5 todo el año
const TZ_OFFSET = "-05:00";

// === AVISOS POR WHATSAPP (CallMeBot - Barbería) ===
const WHATSAPP_PHONE = "+5219843675261";
const WHATSAPP_APIKEY = "8604341";

// === CALENDARIO DE BARBERÍA ===
const BARBER_CALENDAR_ID = "clandestinobeer9@gmail.com";
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

// Función de PRUEBA DIRECTA para CallMeBot:
// Selecciona esta función en Google Apps Script y haz clic en "Ejecutar" para comprobar que recibes el WhatsApp.
function testCallMeBot() {
  Logger.log("Enviando mensaje de prueba a: " + WHATSAPP_PHONE + " con API Key: " + WHATSAPP_APIKEY);
  const testMsg = "💈 *Prueba Mambas Barbería*\nSi recibes este mensaje, las notificaciones de CallMeBot están activas y funcionando correctamente.";
  
  const url =
    "https://api.callmebot.com/whatsapp.php?phone=" +
    encodeURIComponent(WHATSAPP_PHONE) +
    "&text=" + encodeURIComponent(testMsg) +
    "&apikey=" + encodeURIComponent(WHATSAPP_APIKEY);

  try {
    const resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const code = resp.getResponseCode();
    const body = resp.getContentText();
    Logger.log("Respuesta CallMeBot [HTTP " + code + "]: " + body);
  } catch (err) {
    Logger.log("Error de conexión con CallMeBot: " + err);
  }
}

// Función de PRUEBA: revisa las reservas de los últimos 30 minutos y las importa.
function testImportNow() {
  PropertiesService.getScriptProperties().setProperty(
    "lastCheck",
    String(Date.now() - 30 * 60 * 1000),
  );
  syncCalendar();
}

function authHeaders() {
  return { Authorization: "Bearer " + SYNC_SECRET };
}

// 1) Citas creadas en el panel admin (Barbería) -> eventos en Google Calendar
function pushAdminToGoogle() {
  const res = UrlFetchApp.fetch(SITE + "/api/sync/pending?category=barber", {
    headers: authHeaders(),
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) {
    Logger.log("pending error: " + res.getContentText());
    return;
  }
  const list = JSON.parse(res.getContentText()).appointments || [];

  list.forEach(function (a) {
    var t = a.appointment_time || "00:00";
    if (t.length === 5) t = t + ":00"; // "HH:mm" -> "HH:mm:ss"
    const start = new Date(a.appointment_date + "T" + t + TZ_OFFSET);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const title = "Barbería · " + (a.client_name || "Cita");
    const desc =
      "Cita creada desde el panel admin de Mambas\n" +
      "Tel: " + (a.client_phone || "-") + "\n" +
      (a.notes || "");

    let cal = CalendarApp.getCalendarById(BARBER_CALENDAR_ID);
    if (!cal) {
      cal = CalendarApp.getDefaultCalendar();
    }

    const ev = cal.createEvent(title, start, end, { description: desc });
    ev.setTag("mambasSource", "admin"); // evita reimportarla y el aviso doble
 
    UrlFetchApp.fetch(SITE + "/api/sync/mark", {
      method: "post",
      contentType: "application/json",
      headers: authHeaders(),
      payload: JSON.stringify({ id: a.id, gcal_event_id: ev.getId() }),
      muteHttpExceptions: true,
    });

    sendWhatsApp(ev, "💈 *Nueva cita (panel) - Barbería*");
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
  const from = new Date(now - 24 * 60 * 60 * 1000);
  const to = new Date(now + 120 * 24 * 60 * 60 * 1000);

  const cal = CalendarApp.getCalendarById(BARBER_CALENDAR_ID) || CalendarApp.getDefaultCalendar();
  if (!cal) {
    Logger.log("No se pudo cargar el calendario de barbería: " + BARBER_CALENDAR_ID);
    return;
  }

  const events = cal.getEvents(from, to);
  Logger.log("Calendario Barbería (" + BARBER_CALENDAR_ID + "): " + events.length + " eventos encontrados");

  events.forEach(function (ev) {
    if (ev.getDateCreated().getTime() <= last) return;   // ya revisado
    if (ev.getTag("mambasSource") === "admin") return;   // la creamos nosotros
    if (ev.isAllDayEvent()) return;                       // bloque de disponibilidad
    if (ev.getColor() !== "") return;                     // omitir si tiene un color personalizado
    const title = (ev.getTitle() || "").trim();
    if (!title) return;                                   // sin título = disponibilidad

    const start = ev.getStartTime();
    const payload = {
      gcal_event_id: ev.getId(),
      client_name: title,
      client_phone: "",
      service: title,
      category: "barber",
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

    Logger.log("from-google (" + title + "): " + res.getResponseCode() + " " + res.getContentText());
    if (res.getResponseCode() === 200) {
      const j = JSON.parse(res.getContentText());
      if (!j.skipped) sendWhatsApp(ev, "💈 *Nueva reserva - Barbería*");
    }
  });

  props.setProperty("lastCheck", String(now));
}

function sendWhatsApp(ev, header) {
  if (!WHATSAPP_APIKEY || WHATSAPP_APIKEY === "PEGA_AQUI_TU_API_KEY") {
    Logger.log("CallMeBot API Key no configurada. Aviso omitido.");
    return;
  }

  const fecha = Utilities.formatDate(ev.getStartTime(), TIMEZONE, "dd/MM/yyyy HH:mm");
  const desc = (ev.getDescription() || "").replace(/<[^>]*>/g, "").trim();

  let msg = (header || "💈 *Nueva cita - Mambas Barbería*") + "\n\n";
  msg += "✂️ *Servicio:* " + ev.getTitle() + "\n";
  msg += "📅 *Fecha:* " + fecha + "\n";
  if (desc) msg += "📝 *Detalle:* " + desc.substring(0, 250);

  const url =
    "https://api.callmebot.com/whatsapp.php?phone=" +
    encodeURIComponent(WHATSAPP_PHONE) +
    "&text=" + encodeURIComponent(msg) +
    "&apikey=" + encodeURIComponent(WHATSAPP_APIKEY);

  try {
    const resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const code = resp.getResponseCode();
    const body = resp.getContentText();
    Logger.log("CallMeBot (" + WHATSAPP_PHONE + ") [HTTP " + code + "]: " + body);
  } catch (err) {
    Logger.log("Error al enviar mensaje por CallMeBot: " + err);
  }

  Utilities.sleep(4000); // espacia las peticiones para proteger cuota de CallMeBot
}
