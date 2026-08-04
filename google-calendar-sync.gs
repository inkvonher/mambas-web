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
const BARBER_PHONE = "+5219843675261";            // Celular de la Barbería
const TATTOO_PHONE = "+5219841820414";            // Celular de Recepción / Tattoo
const CALLMEBOT_APIKEY = "8604341";

// === CONFIGURA AQUÍ TODOS LOS CALENDARIOS QUE DESEAS ASOCIAR ===
// Puedes agregar tantos calendarios como quieras. El sistema los leerá y los fusionará 
// en la web clasificando las citas de forma automática según su categoría ('tattoo' o 'barber').
const BOOKING_CALENDARS = [
  {
    id: "clandestinobeer9@gmail.com", // Calendario principal (Barbería)
    category: "barber"
  },
  {
    id: "mambastattoo@gmail.com",     // Calendario secundario (Tatuajes / Piercings)
    category: "tattoo"
  }
];
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

// 1) Citas creadas en el panel admin -> eventos en Google Calendar correspondiente
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

    // Buscar calendario correspondiente por categoría
    var targetCalId = null;
    for (var i = 0; i < BOOKING_CALENDARS.length; i++) {
      if (BOOKING_CALENDARS[i].category === a.category) {
        targetCalId = BOOKING_CALENDARS[i].id;
        break;
      }
    }

    var cal = null;
    if (targetCalId) {
      cal = CalendarApp.getCalendarById(targetCalId);
    }
    if (!cal) {
      cal = CalendarApp.getDefaultCalendar(); // Fallback al default
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

    sendWhatsApp(ev, "🗓️ *Nueva cita (panel) - Mambas*", a.category);
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

  BOOKING_CALENDARS.forEach(function (calConf) {
    const cal = CalendarApp.getCalendarById(calConf.id);
    if (!cal) {
      Logger.log("No se pudo cargar el calendario con ID: " + calConf.id);
      return;
    }
    const events = cal.getEvents(from, to);
    Logger.log("Calendario " + calConf.id + ": " + events.length + " eventos");

    events.forEach(function (ev) {
      if (ev.getDateCreated().getTime() <= last) return;   // ya revisado
      if (ev.getTag("mambasSource") === "admin") return;   // la creamos nosotros
      if (ev.isAllDayEvent()) return;                       // bloque de disponibilidad
      if (ev.getColor() !== "") return;                     // omitir si tiene un color personalizado (no por defecto)
      const title = (ev.getTitle() || "").trim();
      if (!title) return;                                   // sin título = disponibilidad

      const start = ev.getStartTime();
      const payload = {
        gcal_event_id: ev.getId(),
        client_name: title,
        client_phone: "",
        service: title,
        category: calConf.category,                         // Clasificar dinámicamente
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
        if (!j.skipped) sendWhatsApp(ev, null, calConf.category);
      }
    });
  });

  props.setProperty("lastCheck", String(now));
}

function sendWhatsApp(ev, header, category) {
  const fecha = Utilities.formatDate(ev.getStartTime(), TIMEZONE, "dd/MM/yyyy HH:mm");
  const desc = (ev.getDescription() || "").replace(/<[^>]*>/g, "").trim();

  let msg = (header || "🐍 *Nueva reserva - Mambas*") + "\n";
  msg += "Servicio: " + ev.getTitle() + "\n";
  msg += "Fecha: " + fecha + "\n";
  if (desc) msg += "Detalle: " + desc.substring(0, 250);

  // Elegir número de destino dinámicamente según la categoría de la cita
  const targetPhone = (category === "tattoo") ? TATTOO_PHONE : BARBER_PHONE;

  const url =
    "https://api.callmebot.com/whatsapp.php?phone=" +
    encodeURIComponent(targetPhone) +
    "&text=" + encodeURIComponent(msg) +
    "&apikey=" + encodeURIComponent(CALLMEBOT_APIKEY);

  const resp = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  Logger.log("CallMeBot (" + targetPhone + "): " + resp.getContentText());
  Utilities.sleep(8000); // espacia los mensajes para no saturar CallMeBot (API gratis)
}

// Función para importar historial de tatuajes desde Enero 2024 (Solo se ejecuta una vez de forma manual)
// NOTA: NO envía notificaciones de WhatsApp para evitar bloquear tu cuenta con spam.
function importHistoryFrom2024() {
  const from = new Date("2024-01-01T00:00:00-05:00");
  const to = new Date();
  
  // Buscar el calendario de Tattoo
  var tattooCalConf = null;
  for (var i = 0; i < BOOKING_CALENDARS.length; i++) {
    if (BOOKING_CALENDARS[i].category === "tattoo") {
      tattooCalConf = BOOKING_CALENDARS[i];
      break;
    }
  }
  
  if (!tattooCalConf) {
    Logger.log("No se encontró ningún calendario configurado con la categoría 'tattoo'.");
    return;
  }
  
  const cal = CalendarApp.getCalendarById(tattooCalConf.id);
  if (!cal) {
    Logger.log("No se pudo cargar el calendario de tatuajes: " + tattooCalConf.id);
    return;
  }
  
  Logger.log("Buscando eventos desde 2024 en el calendario de tatuajes...");
  const events = cal.getEvents(from, to);
  Logger.log("Total de eventos encontrados en Google: " + events.length);
  
  var importedCount = 0;
  var skippedCount = 0;
  
  events.forEach(function (ev, index) {
    // 1) Filtrar por color de etiqueta (solo importar los que tienen COLOR POR DEFECTO)
    // getColor() devuelve "" para el color por defecto del calendario.
    if (ev.getColor() !== "") {
      skippedCount++;
      return;
    }
    
    if (ev.getTag("mambasSource") === "admin") return;
    if (ev.isAllDayEvent()) return;
    const title = (ev.getTitle() || "").trim();
    if (!title) return;
    
    const start = ev.getStartTime();
    const payload = {
      gcal_event_id: ev.getId(),
      client_name: title,
      client_phone: "",
      service: title,
      category: "tattoo",
      appointment_date: Utilities.formatDate(start, TIMEZONE, "yyyy-MM-dd"),
      appointment_time: Utilities.formatDate(start, TIMEZONE, "HH:mm"),
      notes: (ev.getDescription() || "").replace(/<[^>]*>/g, "").trim().substring(0, 500),
    };
    
    try {
      const res = UrlFetchApp.fetch(SITE + "/api/sync/from-google", {
        method: "post",
        contentType: "application/json",
        headers: authHeaders(),
        payload: JSON.stringify(payload),
        muteHttpExceptions: true,
      });
      
      if (res.getResponseCode() === 200) {
        const j = JSON.parse(res.getContentText());
        if (!j.skipped) {
          importedCount++;
          Logger.log("[" + importedCount + "] Importado con éxito: " + title + " (" + payload.appointment_date + ")");
        } else {
          skippedCount++;
        }
      } else {
        Logger.log("Error al importar " + title + ": " + res.getContentText());
      }
    } catch (e) {
      Logger.log("Error de red con el evento: " + title + ". Detalle: " + e);
    }
    
    // Pequeña pausa cada 10 peticiones para no saturar las cuotas de Google o Vercel
    if (index % 10 === 0) {
      Utilities.sleep(150);
    }
  });
  
  Logger.log("--- PROCESO TERMINADO ---");
  Logger.log("Total procesados: " + events.length);
  Logger.log("Nuevos importados: " + importedCount);
  Logger.log("Omitidos (por tener color personalizado o estar repetidos): " + skippedCount);
}
