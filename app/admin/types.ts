import { supabase } from "../lib/supabase";

export type Client = {
  id: string;
  name: string;
  phone: string;
  birthday: string | null;
  service: string;
  status: string;
  created_at: string;
};

export type AppointmentCategory = "tattoo" | "barber";
export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type Appointment = {
  id: string;
  client_name: string;
  client_phone: string;
  service: string | null;
  category: AppointmentCategory;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  notes: string | null;
  deposit_amount: number | null;
  total_amount?: number | null;
  gcal_event_id?: string | null;
  source?: string | null;
  created_at: string;
};

export type AppointmentFormPayload = {
  client_name: string;
  client_phone: string;
  service: string;
  category: AppointmentCategory;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  notes: string | null;
  deposit_amount: number;
  total_amount?: number | null;
};

export type AppointmentMutationPayload = {
  client_name: string;
  client_phone: string;
  service?: string;
  category: AppointmentCategory;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  notes: string | null;
  deposit_amount: number;
  total_amount?: number | null;
};

export type SupabaseMutationError = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

export const expectedAppointmentColumns = [
  "id",
  "client_name",
  "client_phone",
  "service",
  "category",
  "appointment_date",
  "appointment_time",
  "status",
  "notes",
  "deposit_amount",
  "total_amount",
  "created_at",
];

export const appointmentStatuses: AppointmentStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

export const statusLabels: Record<AppointmentStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  completed: "Completada",
  cancelled: "Cancelada",
};

export const scheduleHours = Array.from({ length: 13 }, (_, index) => index + 9);
export const adminGoogleMapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Mambas%20Tattoo%20%26%20Cuts%20Calle%201%20Sur%20Av.%2025%20Sur%20Playa%20del%20Carmen";
export const depositPaymentUrl = "https://mpago.la/2Nc6MvU";

export function getRevenueValue(appointment: Appointment): number {
  return Number(
    appointment.total_amount !== null && appointment.total_amount !== undefined
      ? appointment.total_amount
      : (appointment.deposit_amount ?? 0)
  );
}

export function appointmentStatusOrDefault(status: string): AppointmentStatus {
  return appointmentStatuses.includes(status as AppointmentStatus)
    ? (status as AppointmentStatus)
    : "pending";
}

export function appointmentCategoryOrDefault(category: string): AppointmentCategory {
  return category === "barber" ? "barber" : "tattoo";
}

export function normalizeTime(value: string) {
  return value.length === 5 ? `${value}:00` : value;
}

export function buildRevenueAnalytics(appointments: Appointment[]) {
  const currentMonthKey = monthKey(new Date());
  const monthlyRevenue = buildLastSixMonths().map((month) => {
    const revenue = appointments
      .filter((appointment) => appointment.appointment_date.startsWith(month.key))
      .reduce(
        (total, appointment) => total + getRevenueValue(appointment),
        0,
      );

    return {
      label: month.label,
      revenue,
    };
  });

  const depositRevenue = appointments.reduce(
    (total, appointment) => total + Number(appointment.deposit_amount || 0),
    0,
  );

  const completedRevenue = appointments
    .filter((appointment) => appointment.status === "completed")
    .reduce(
      (total, appointment) => total + getRevenueValue(appointment),
      0,
    );

  const categoryRevenue = appointments.reduce(
    (totals, appointment) => {
      totals[appointment.category] += getRevenueValue(appointment);
      return totals;
    },
    { tattoo: 0, barber: 0 } as Record<AppointmentCategory, number>,
  );

  const currentMonthRevenue = appointments
    .filter((appointment) =>
      appointment.appointment_date.startsWith(currentMonthKey),
    )
    .reduce(
      (total, appointment) => total + getRevenueValue(appointment),
      0,
    );

  const statusStats = appointmentStatuses.map((status) => {
    const count = appointments.filter(
      (appointment) => appointment.status === status,
    ).length;

    return {
      status,
      count,
      percentage: appointments.length
        ? Math.round((count / appointments.length) * 100)
        : 0,
    };
  });

  const topClients = Object.values(
    appointments.reduce<
      Record<string, { key: string; name: string; count: number; revenue: number }>
    >((clients, appointment) => {
      const key = appointment.client_phone || appointment.client_name;
      clients[key] ||= {
        key,
        name: appointment.client_name,
        count: 0,
        revenue: 0,
      };
      clients[key].count += 1;
      clients[key].revenue += getRevenueValue(appointment);
      return clients;
    }, {}),
  )
    .sort((a, b) => b.count - a.count || b.revenue - a.revenue)
    .slice(0, 5);

  return {
    monthlyRevenue,
    currentMonthRevenue,
    completedRevenue,
    depositRevenue,
    averageDeposit: appointments.length
      ? Math.round(depositRevenue / appointments.length)
      : 0,
    categoryRevenue,
    statusStats,
    topClients,
  };
}

export function buildLastSixMonths() {
  const today = new Date();

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - 5 + index, 1);

    return {
      key: monthKey(date),
      label: date.toLocaleDateString("es-MX", { month: "short" }),
    };
  });
}

export function monthKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function sortAppointments(a: Appointment, b: Appointment) {
  return (
    `${a.appointment_date} ${a.appointment_time}`.localeCompare(
      `${b.appointment_date} ${b.appointment_time}`,
    ) || a.client_name.localeCompare(b.client_name)
  );
}

export function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatBirthday(value: string | null) {
  if (!value) {
    return "-";
  }

  try {
    return new Date(`${value}T00:00:00`).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "long",
    });
  } catch {
    return value;
  }
}

export function formatTime(value: string) {
  return value.slice(0, 5);
}

export function appointmentHour(appointment: Appointment) {
  const parsed = Number(appointment.appointment_time.slice(0, 2));

  if (!Number.isFinite(parsed)) {
    return 9;
  }

  return Math.min(Math.max(parsed, 9), 21);
}

export function formatHourLabel(hour: number) {
  return new Date(2026, 0, 1, hour).toLocaleTimeString("es-MX", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function appointmentCategoryClasses(category: AppointmentCategory) {
  return category === "barber"
    ? "border-sky-400/25 bg-sky-400/10 hover:border-sky-300/50"
    : "border-[#d6ad4a]/25 bg-[#d6ad4a]/10 hover:border-[#d6ad4a]/55";
}

export type WhatsAppMessageType = "confirm" | "reminder" | "deposit" | "location";

export function buildWhatsAppUrl(phone: string, message: string) {
  const cleanPhone = normalizeWhatsAppPhone(phone);
  const text = message.trim();

  if (text) {
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  }

  return `https://wa.me/${cleanPhone}`;
}

export function normalizeWhatsAppPhone(phone: string) {
  const trimmedPhone = phone.trim();
  const digits = trimmedPhone.replace(/\D/g, "");

  if (trimmedPhone.startsWith("00") && digits.length > 2) {
    return digits.slice(2);
  }

  if (digits.length === 13 && digits.startsWith("521")) {
    return `52${digits.slice(3)}`;
  }

  if (digits.length === 10) {
    return `52${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return digits;
  }

  return digits;
}

export function buildWhatsAppMessage(
  type: WhatsAppMessageType,
  appointment: Appointment,
) {
  const service = appointment.service || categoryLabel(appointment.category);
  const date = formatDate(appointment.appointment_date);
  const time = formatTime(appointment.appointment_time);
  const deposit = Number(appointment.deposit_amount || 0).toLocaleString(
    "es-MX",
  );

  const baseGreeting = `Hola ${appointment.client_name}, somos Mambas Tattoo & Cuts.`;

  if (type === "confirm") {
    return `${baseGreeting}\n\nTu cita queda confirmada:\nServicio: ${service}\nFecha: ${date}\nHora: ${time}\n\nTe esperamos en el estudio. Si necesitas ajustar algo, respondemos por este medio.`;
  }

  if (type === "reminder") {
    return `${baseGreeting}\n\nTe recordamos tu cita:\nServicio: ${service}\nFecha: ${date}\nHora: ${time}\n\nPor favor llega unos minutos antes. Si tienes referencias o cambios, puedes enviarlos por aquí.`;
  }

  if (type === "deposit") {
    return `${baseGreeting}\n\nPara apartar tu cita de ${service} el ${date} a las ${time}, se requiere un anticipo mínimo de 500 MXN.\nAnticipo registrado: ${deposit} MXN\nLink de pago: ${depositPaymentUrl}\n\nEl anticipo asegura tu espacio y se descuenta del total final cuando aplique.`;
  }

  return `${baseGreeting}\n\nEsta es nuestra ubicación para tu cita de ${service}:\nMambas Tattoo & Cuts\nCalle 1 Sur esquina Av. 25 Sur, Centro, Playa del Carmen\n\nGoogle Maps: ${adminGoogleMapsUrl}\n\nTe esperamos.`;
}

export function categoryLabel(category: AppointmentCategory) {
  return category === "barber" ? "Barbería" : "Tattoo";
}

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function normalizeAppointmentPayload(
  payload: AppointmentFormPayload,
): AppointmentMutationPayload {
  const normalized: AppointmentMutationPayload = {
    client_name: payload.client_name.trim(),
    client_phone: payload.client_phone.trim(),
    category: appointmentCategoryOrDefault(payload.category),
    appointment_date: payload.appointment_date,
    appointment_time: normalizeTime(payload.appointment_time),
    status: appointmentStatusOrDefault(payload.status),
    notes: payload.notes?.trim() || null,
    deposit_amount: Number.isFinite(Number(payload.deposit_amount))
      ? Number(payload.deposit_amount)
      : 0,
    total_amount: payload.total_amount !== undefined && payload.total_amount !== null && !Number.isNaN(Number(payload.total_amount))
      ? Number(payload.total_amount)
      : null,
  };

  if (payload.service.trim()) {
    normalized.service = payload.service.trim();
  }

  return normalized;
}

export function hydrateAppointment(
  row: unknown,
  fallback?: AppointmentFormPayload,
): Appointment {
  const source = (row || {}) as Partial<Appointment>;

  return {
    id: source.id || crypto.randomUUID(),
    client_name: source.client_name || fallback?.client_name || "",
    client_phone: source.client_phone || fallback?.client_phone || "",
    service: source.service || fallback?.service || "",
    category: appointmentCategoryOrDefault(source.category || fallback?.category || "tattoo"),
    appointment_date:
      source.appointment_date || fallback?.appointment_date || toDateKey(new Date()),
    appointment_time: source.appointment_time || fallback?.appointment_time || "00:00:00",
    status: appointmentStatusOrDefault(source.status || fallback?.status || "pending"),
    notes: source.notes ?? fallback?.notes ?? null,
    deposit_amount: Number(source.deposit_amount ?? fallback?.deposit_amount ?? 0),
    total_amount: source.total_amount !== undefined
      ? (source.total_amount !== null ? Number(source.total_amount) : null)
      : (fallback?.total_amount !== undefined && fallback.total_amount !== null ? Number(fallback.total_amount) : null),
    gcal_event_id: source.gcal_event_id || null,
    source: source.source || "admin",
    created_at: source.created_at || new Date().toISOString(),
  };
}

export async function mutateAppointment(
  payload: AppointmentMutationPayload,
  editingAppointment: Appointment | null,
) {
  if (editingAppointment) {
    return supabase
      .from("appointments")
      .update(payload)
      .eq("id", editingAppointment.id)
      .select("*")
      .single();
  }

  return supabase.from("appointments").insert([payload]).select("*").single();
}

export function logSupabaseAppointmentError(
  error: SupabaseMutationError,
  payload: unknown,
  context = "appointment save",
) {
  console.error(`Supabase ${context} failed`, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
    expectedAppointmentColumns,
    frontendPayload: payload,
  });
}

export function getMissingColumnName(error: SupabaseMutationError) {
  const text = `${error.message || ""} ${error.details || ""} ${
    error.hint || ""
  }`;
  const quotedColumn = text.match(/'([^']+)'\s+column/i);

  if (quotedColumn?.[1]) {
    return quotedColumn[1];
  }

  const schemaCacheColumn = text.match(/column\s+\"?([a-zA-Z0-9_]+)\"?/i);

  if (schemaCacheColumn?.[1]) {
    return schemaCacheColumn[1];
  }

  return null;
}

export function buildCalendarDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const calendarDays = [];

  const prevMonthDays = new Date(year, month, 0).getDate();

  for (let i = startDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const key = toDateKey(new Date(year, month - 1, day));
    calendarDays.push({
      key,
      label: day,
      currentMonth: false,
      today: key === toDateKey(new Date()),
    });
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const key = toDateKey(new Date(year, month, day));
    calendarDays.push({
      key,
      label: day,
      currentMonth: true,
      today: key === toDateKey(new Date()),
    });
  }

  const remaining = 42 - calendarDays.length;

  for (let day = 1; day <= remaining; day++) {
    const key = toDateKey(new Date(year, month + 1, day));
    calendarDays.push({
      key,
      label: day,
      currentMonth: false,
      today: key === toDateKey(new Date()),
    });
  }

  return calendarDays;
}


