"use client";

import { DragEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

type Client = {
  id: string;
  name: string;
  phone: string;
  birthday: string | null;
  service: string;
  status: string;
  created_at: string;
};

type AppointmentCategory = "tattoo" | "barber";
type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

type Appointment = {
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
  created_at: string;
};

type AppointmentFormPayload = {
  client_name: string;
  client_phone: string;
  service: string;
  category: AppointmentCategory;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  notes: string | null;
  deposit_amount: number;
};

type AppointmentMutationPayload = {
  client_name: string;
  client_phone: string;
  service?: string;
  category: AppointmentCategory;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  notes: string | null;
  deposit_amount: number;
};

type SupabaseMutationError = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

const expectedAppointmentColumns = [
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
  "created_at",
];

const appointmentStatuses: AppointmentStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

const statusLabels: Record<AppointmentStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  completed: "Completada",
  cancelled: "Cancelada",
};

const scheduleHours = Array.from({ length: 13 }, (_, index) => index + 9);
const adminGoogleMapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Mambas%20Tattoo%20%26%20Cuts%20Calle%201%20Sur%20Av.%2025%20Sur%20Playa%20del%20Carmen";
const depositPaymentUrl = "https://mpago.la/2Nc6MvU";

export default function AdminPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [modalInitialDate, setModalInitialDate] = useState<string | null>(null);
  const [modalInitialTime, setModalInitialTime] = useState<string | null>(null);
  const [clientPendingDelete, setClientPendingDelete] = useState<Client | null>(
    null,
  );
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<
    string | null
  >(null);

  useEffect(() => {
    async function loadAdminData() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/admin/login");
        return;
      }

      const [clientsResult, appointmentsResult] = await Promise.all([
        supabase.from("clients").select("*").order("created_at", {
          ascending: false,
        }),
        supabase
          .from("appointments")
          .select("*")
          .order("appointment_date", { ascending: true })
          .order("appointment_time", { ascending: true }),
      ]);

      if (clientsResult.error) {
        console.error(clientsResult.error);
        setErrorMessage("No se pudieron cargar los clientes.");
      } else {
        setClients(clientsResult.data || []);
      }

      if (appointmentsResult.error) {
        console.error(appointmentsResult.error);
        setErrorMessage(
          "No se pudieron cargar las citas. Revisa que exista la tabla appointments en Supabase.",
        );
      } else {
        setAppointments(
          (appointmentsResult.data || []).map((appointment) =>
            hydrateAppointment(appointment),
          ),
        );
      }

      setLoading(false);
    }

    loadAdminData();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  function openCreateAppointment(date?: string, time?: string) {
    setEditingAppointment(null);
    setModalInitialDate(date || null);
    setModalInitialTime(time || null);
    setModalOpen(true);
  }

  function openEditAppointment(appointment: Appointment) {
    setEditingAppointment(appointment);
    setModalInitialDate(null);
    setModalOpen(true);
  }

  function closeAppointmentModal() {
    setModalOpen(false);
    setEditingAppointment(null);
    setModalInitialDate(null);
    setModalInitialTime(null);
  }

  async function handleSaveAppointment(payload: AppointmentFormPayload) {
    setSaving(true);
    setErrorMessage("");

    if (!payload.client_name.trim() || !payload.client_phone.trim()) {
      setErrorMessage("Nombre y telefono del cliente son obligatorios.");
      setSaving(false);
      return;
    }

    console.info("Mambas appointment schema comparison", {
      expectedColumns: expectedAppointmentColumns,
      frontendPayloadKeys: Object.keys(payload),
      payload,
    });

    const { data, error } = await saveAppointmentWithCompatibility(
      payload,
      editingAppointment,
    );

    if (error) {
      logSupabaseAppointmentError(error, payload);
      setErrorMessage(
        `No se pudo guardar la cita en Supabase: ${error.message || "error desconocido"}`,
      );
      setSaving(false);
      return;
    }

    setAppointments((current) => {
      const saved = hydrateAppointment(data, payload);

      if (editingAppointment) {
        return current
          .map((appointment) =>
            appointment.id === saved.id ? saved : appointment,
          )
          .sort(sortAppointments);
      }

      return [...current, saved].sort(sortAppointments);
    });
    closeAppointmentModal();
    setSaving(false);
  }

  async function handleDeleteAppointment(appointment: Appointment) {
    const confirmed = window.confirm(
      `Eliminar la cita de ${appointment.client_name}?`,
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage("");

    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", appointment.id);

    if (error) {
      console.error(error);
      setErrorMessage("No se pudo eliminar la cita en Supabase.");
      return;
    }

    setAppointments((current) =>
      current.filter((item) => item.id !== appointment.id),
    );
  }

  async function handleRescheduleAppointment(
    appointment: Appointment,
    date: string,
    hour: number,
  ) {
    const previousAppointments = appointments;
    const appointment_time = normalizeTime(`${String(hour).padStart(2, "0")}:00`);

    setErrorMessage("");
    setAppointments((current) =>
      current
        .map((item) =>
          item.id === appointment.id
            ? {
                ...item,
                appointment_date: date,
                appointment_time,
              }
            : item,
        )
        .sort(sortAppointments),
    );

    const { error } = await supabase
      .from("appointments")
      .update({ appointment_date: date, appointment_time })
      .eq("id", appointment.id);

    if (error) {
      console.error("Supabase appointment reschedule failed", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        appointment,
        nextDate: date,
        nextTime: appointment_time,
      });
      setAppointments(previousAppointments);
      setErrorMessage(
        `No se pudo reprogramar la cita: ${error.message || "error desconocido"}`,
      );
    }
  }

  async function handleConfirmDeleteClient() {
    const client = clientPendingDelete;

    if (!client) {
      return;
    }

    setErrorMessage("");
    setClientPendingDelete(null);
    setDeletingClientId(client.id);
    setClients((current) => current.filter((item) => item.id !== client.id));

    const { error } = await supabase.from("clients").delete().eq("id", client.id);

    if (error) {
      console.error("Supabase client delete failed", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        client,
      });
      setErrorMessage(
        `No se pudo eliminar el cliente: ${error.message || "error desconocido"}`,
      );
      setClients((current) =>
        [...current, client].sort((a, b) =>
          b.created_at.localeCompare(a.created_at),
        ),
      );
      setDeletingClientId(null);
      return;
    }

    setDeletingClientId(null);
  }

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return clients;
    }

    return clients.filter((client) =>
      [client.name, client.phone, client.service, client.status]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [clients, search]);

  const filteredAppointments = useMemo(() => {
    const query = appointmentSearch.trim().toLowerCase();
    const dateFiltered = selectedCalendarDate
      ? appointments.filter(
          (appointment) => appointment.appointment_date === selectedCalendarDate,
        )
      : appointments.filter(
          (appointment) => appointment.appointment_date >= toDateKey(new Date()),
        );

    if (!query) {
      return dateFiltered;
    }

    return dateFiltered.filter((appointment) =>
      [
        appointment.client_name,
        appointment.client_phone,
        appointment.service || "",
        appointment.category,
        statusLabels[appointment.status],
        appointment.notes || "",
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [appointments, appointmentSearch, selectedCalendarDate]);

  const calendarDays = useMemo(
    () => buildCalendarDays(calendarDate),
    [calendarDate],
  );

  const appointmentsByDate = useMemo(() => {
    return appointments.reduce<Record<string, Appointment[]>>(
      (grouped, appointment) => {
        grouped[appointment.appointment_date] ||= [];
        grouped[appointment.appointment_date].push(appointment);
        return grouped;
      },
      {},
    );
  }, [appointments]);

  const selectedDayAppointments = selectedCalendarDate
    ? appointmentsByDate[selectedCalendarDate] || []
    : [];

  const activeScheduleDate = selectedCalendarDate || toDateKey(new Date());

  const activeScheduleAppointments = appointments.filter(
    (appointment) => appointment.appointment_date === activeScheduleDate,
  );

  const tattooAppointments = appointments.filter(
    (appointment) => appointment.category === "tattoo",
  ).length;

  const barberAppointments = appointments.filter(
    (appointment) => appointment.category === "barber",
  ).length;

  const depositsTotal = appointments.reduce(
    (total, appointment) => total + Number(appointment.deposit_amount || 0),
    0,
  );

  const analytics = useMemo(
    () => buildRevenueAnalytics(appointments),
    [appointments],
  );

  return (
    <main className="min-h-screen bg-[#040404] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,173,74,0.14),transparent_34%),linear-gradient(135deg,rgba(214,173,74,0.05),transparent_42%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-30 -mx-4 mb-6 border-b border-[#d6ad4a]/15 bg-[#040404]/86 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d6ad4a]">
                Panel privado
              </p>
              <h1 className="mt-2 text-2xl font-black uppercase tracking-normal text-white sm:text-4xl">
                Mambas Admin
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openCreateAppointment()}
                className="hidden min-h-11 rounded-lg bg-[#d6ad4a] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-black transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_44px_rgba(214,173,74,0.22)] sm:inline-flex sm:items-center"
              >
                Nueva cita
              </button>
              <button
                onClick={handleLogout}
                className="min-h-11 shrink-0 rounded-lg border border-[#d6ad4a]/70 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#d6ad4a] transition duration-200 hover:-translate-y-0.5 hover:bg-[#d6ad4a] hover:text-black hover:shadow-[0_18px_44px_rgba(214,173,74,0.22)]"
              >
                Salir
              </button>
            </div>
          </div>
        </header>

        {errorMessage ? (
          <div className="mb-6 rounded-xl border border-red-500/25 bg-red-950/30 p-4 text-sm text-red-100">
            {errorMessage}
          </div>
        ) : null}

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Clientes" value={clients.length.toString()} />
          <StatCard label="Citas" value={appointments.length.toString()} />
          <StatCard label="Tattoo" value={tattooAppointments.toString()} />
          <StatCard label="Barberia" value={barberAppointments.toString()} />
          <StatCard
            label="Anticipos"
            value={`${depositsTotal.toLocaleString("es-MX")} MXN`}
          />
        </section>

        <section className="mb-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <Panel>
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d6ad4a]">
                  Revenue
                </p>
                <h2 className="mt-2 text-2xl font-black uppercase text-white">
                  Analitica financiera
                </h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Ingresos calculados desde anticipos registrados en citas.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[430px]">
                <MiniMetric
                  label="Este mes"
                  value={`${analytics.currentMonthRevenue.toLocaleString(
                    "es-MX",
                  )} MXN`}
                />
                <MiniMetric
                  label="Completado"
                  value={`${analytics.completedRevenue.toLocaleString(
                    "es-MX",
                  )} MXN`}
                />
                <MiniMetric
                  label="Promedio"
                  value={`${analytics.averageDeposit.toLocaleString(
                    "es-MX",
                  )} MXN`}
                />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-xl border border-[#d6ad4a]/10 bg-black/35 p-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">
                    Ingreso mensual
                  </h3>
                  <span className="text-xs text-zinc-500">6 meses</span>
                </div>
                <RevenueBarChart data={analytics.monthlyRevenue} />
              </div>

              <div className="space-y-4">
                <ComparisonChart
                  title="Tattoo vs Barber"
                  rows={[
                    {
                      label: "Tattoo",
                      value: analytics.categoryRevenue.tattoo,
                    },
                    {
                      label: "Barber",
                      value: analytics.categoryRevenue.barber,
                    },
                  ]}
                />
                <ComparisonChart
                  title="Depositos vs completadas"
                  rows={[
                    {
                      label: "Depositos",
                      value: analytics.depositRevenue,
                    },
                    {
                      label: "Completadas",
                      value: analytics.completedRevenue,
                    },
                  ]}
                />
              </div>
            </div>
          </Panel>

          <Panel>
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d6ad4a]">
                Performance
              </p>
              <h2 className="mt-2 text-2xl font-black uppercase text-white">
                Estadisticas
              </h2>
            </div>

            <div className="space-y-5">
              <StatusDistribution stats={analytics.statusStats} />

              <div className="rounded-xl border border-[#d6ad4a]/10 bg-black/35 p-4">
                <h3 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-white">
                  Top clientes
                </h3>
                {analytics.topClients.length === 0 ? (
                  <p className="text-sm text-zinc-500">Sin citas todavia.</p>
                ) : (
                  <div className="space-y-3">
                    {analytics.topClients.map((client, index) => (
                      <div
                        key={client.key}
                        className="flex items-center justify-between gap-4 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-bold text-white">
                            {index + 1}. {client.name}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {client.count} citas
                          </p>
                        </div>
                        <p className="text-sm font-black text-[#d6ad4a]">
                          {client.revenue.toLocaleString("es-MX")} MXN
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </section>

        <section className="mb-6 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <Panel>
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d6ad4a]">
                  Agenda
                </p>
                <h2 className="mt-2 text-2xl font-black uppercase text-white">
                  Calendario
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCalendarDate(addMonths(calendarDate, -1));
                    setSelectedCalendarDate(null);
                  }}
                  className="calendar-button"
                >
                  Prev
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    setCalendarDate(today);
                    setSelectedCalendarDate(toDateKey(today));
                  }}
                  className="calendar-button"
                >
                  Hoy
                </button>
                <button
                  onClick={() => {
                    setCalendarDate(addMonths(calendarDate, 1));
                    setSelectedCalendarDate(null);
                  }}
                  className="calendar-button"
                >
                  Next
                </button>
              </div>
            </div>

            <p className="mb-4 text-lg font-black uppercase text-[#d6ad4a]">
              {calendarDate.toLocaleDateString("es-MX", {
                month: "long",
                year: "numeric",
              })}
            </p>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
              {["D", "L", "M", "M", "J", "V", "S"].map((day) => (
                <div key={day} className="py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="hidden grid-cols-7 gap-1 md:grid">
              {calendarDays.map((day) => {
                const dayAppointments = appointmentsByDate[day.key] || [];
                const selected = selectedCalendarDate === day.key;

                return (
                  <button
                    key={day.key}
                    onClick={() => {
                      setSelectedCalendarDate(day.key);
                      openCreateAppointment(day.key);
                    }}
                    className={`min-h-32 rounded-lg border p-2 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#d6ad4a]/50 ${
                      selected
                        ? "border-[#d6ad4a] bg-[#d6ad4a]/10 shadow-[0_18px_44px_rgba(214,173,74,0.12)]"
                        : day.currentMonth
                          ? "border-[#d6ad4a]/10 bg-black/40"
                          : "border-white/5 bg-white/[0.02] text-zinc-600"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          day.today ? "text-[#d6ad4a]" : "text-zinc-400"
                        }`}
                      >
                        {day.label}
                      </span>
                      {dayAppointments.length ? (
                        <span className="rounded-full bg-[#d6ad4a] px-2 py-0.5 text-[10px] font-black text-black">
                          {dayAppointments.length}
                        </span>
                      ) : null}
                    </div>
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 2).map((appointment) => (
                        <CalendarAppointmentPill
                          key={appointment.id}
                          appointment={appointment}
                        />
                      ))}
                      {dayAppointments.length > 2 ? (
                        <div className="text-[10px] text-zinc-500">
                          +{dayAppointments.length - 2} mas
                        </div>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 md:hidden">
              {calendarDays
                .filter((day) => day.currentMonth)
                .map((day) => {
                  const dayAppointments = appointmentsByDate[day.key] || [];
                  const selected = selectedCalendarDate === day.key;

                  return (
                    <button
                      key={day.key}
                      onClick={() => {
                        setSelectedCalendarDate(day.key);
                        openCreateAppointment(day.key);
                      }}
                      className={`w-full rounded-xl border p-4 text-left transition duration-200 ${
                        selected
                          ? "border-[#d6ad4a] bg-[#d6ad4a]/10"
                          : "border-[#d6ad4a]/12 bg-black/45"
                      }`}
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p
                            className={`text-sm font-black uppercase ${
                              day.today ? "text-[#d6ad4a]" : "text-white"
                            }`}
                          >
                            {formatDate(day.key)}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">
                            {dayAppointments.length} citas
                          </p>
                        </div>
                        {day.today ? (
                          <span className="rounded-full bg-[#d6ad4a] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-black">
                            Hoy
                          </span>
                        ) : null}
                      </div>
                      {dayAppointments.length ? (
                        <div className="space-y-2">
                          {dayAppointments.map((appointment) => (
                            <CalendarMobileAppointment
                              key={appointment.id}
                              appointment={appointment}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-zinc-500">
                          Sin citas programadas.
                        </p>
                      )}
                    </button>
                  );
                })}
            </div>
          </Panel>

          <Panel>
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d6ad4a]">
                  {selectedCalendarDate ? "Dia seleccionado" : "Citas"}
                </p>
                <h2 className="mt-2 text-2xl font-black uppercase text-white">
                  {selectedCalendarDate
                    ? formatDate(selectedCalendarDate)
                    : "Proximas citas"}
                </h2>
                {selectedCalendarDate ? (
                  <p className="mt-2 text-sm text-zinc-400">
                    {selectedDayAppointments.length} citas en este dia
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {selectedCalendarDate ? (
                  <button
                    onClick={() => setSelectedCalendarDate(null)}
                    className="min-h-11 rounded-lg border border-[#d6ad4a]/30 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#d6ad4a] transition hover:bg-[#d6ad4a] hover:text-black"
                  >
                    Ver todas
                  </button>
                ) : null}
                <button
                  onClick={() => openCreateAppointment()}
                  className="min-h-11 rounded-lg bg-[#d6ad4a] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-black transition duration-200 hover:-translate-y-0.5 hover:bg-white sm:hidden"
                >
                  Nueva cita
                </button>
              </div>
            </div>

            <input
              value={appointmentSearch}
              onChange={(event) => setAppointmentSearch(event.target.value)}
              placeholder="Buscar cita..."
              className="mb-4 min-h-12 w-full rounded-lg border border-[#d6ad4a]/20 bg-black/70 px-4 text-sm text-white outline-none transition focus:border-[#d6ad4a] focus:shadow-[0_0_0_4px_rgba(214,173,74,0.12)]"
            />

            {loading ? (
              <LoadingState label="Cargando citas" />
            ) : appointments.length === 0 ? (
              <EmptyState
                title="No hay citas"
                text="Crea la primera cita desde el boton Nueva cita."
              />
            ) : filteredAppointments.length === 0 ? (
              <EmptyState
                title="Sin resultados"
                text="No encontramos citas que coincidan con esa busqueda."
              />
            ) : (
              <div className="space-y-3">
                {filteredAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={openEditAppointment}
                    onDelete={handleDeleteAppointment}
                  />
                ))}
              </div>
            )}
          </Panel>
        </section>

        <section className="mb-6">
          <DailyScheduleView
            date={activeScheduleDate}
            appointments={activeScheduleAppointments}
            onEdit={openEditAppointment}
            onCreate={(date, hour) => {
              setSelectedCalendarDate(date);
              openCreateAppointment(
                date,
                `${String(hour).padStart(2, "0")}:00`,
              );
            }}
            onReschedule={handleRescheduleAppointment}
          />
        </section>

        <section className="mb-6 overflow-hidden rounded-xl border border-[#d6ad4a]/15 bg-[#080808]/90 shadow-[0_28px_90px_rgba(0,0,0,0.48)]">
          <div className="flex flex-col gap-4 border-b border-[#d6ad4a]/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d6ad4a]">
                Clientes registrados
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                Busca por nombre, WhatsApp, servicio o estado.
              </p>
            </div>
            <label className="relative w-full sm:max-w-sm">
              <span className="sr-only">Buscar clientes</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar cliente..."
                className="min-h-12 w-full rounded-lg border border-[#d6ad4a]/20 bg-black/70 px-4 text-sm text-white outline-none transition focus:border-[#d6ad4a] focus:shadow-[0_0_0_4px_rgba(214,173,74,0.12)]"
              />
            </label>
          </div>

          {loading ? (
            <LoadingState label="Cargando clientes" />
          ) : clients.length === 0 ? (
            <EmptyState
              title="No hay clientes registrados"
              text="Cuando alguien complete el formulario de lealtad, aparecera aqui."
            />
          ) : filteredClients.length === 0 ? (
            <EmptyState
              title="Sin resultados"
              text="No encontramos clientes que coincidan con esa busqueda."
            />
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[860px] text-sm">
                  <thead>
                    <tr className="border-b border-[#d6ad4a]/10 bg-[#0d0d0d] text-left text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                      <th className="px-5 py-4">Nombre</th>
                      <th className="px-5 py-4">Telefono</th>
                      <th className="px-5 py-4">Cumpleanos</th>
                      <th className="px-5 py-4">Servicio</th>
                      <th className="px-5 py-4">Estado</th>
                      <th className="px-5 py-4">Registro</th>
                      <th className="px-5 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredClients.map((client) => (
                      <tr
                        key={client.id}
                        className="border-b border-[#d6ad4a]/8 text-zinc-300 transition duration-200 hover:bg-[#d6ad4a]/7 hover:text-white"
                      >
                        <td className="px-5 py-4">
                          <div className="font-bold text-white">
                            {client.name}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <a
                            href={`https://wa.me/${client.phone.replace(/\D/g, "")}`}
                            className="text-[#d6ad4a] transition hover:text-white"
                          >
                            {client.phone}
                          </a>
                        </td>
                        <td className="px-5 py-4">
                          {formatDate(client.birthday)}
                        </td>
                        <td className="px-5 py-4">{client.service}</td>
                        <td className="px-5 py-4">
                          <ClientStatusBadge status={client.status} />
                        </td>
                        <td className="px-5 py-4">
                          {formatDate(client.created_at)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => setClientPendingDelete(client)}
                            disabled={deletingClientId === client.id}
                            className="rounded-lg border border-red-400/30 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-red-200 transition hover:bg-red-400 hover:text-black"
                          >
                            {deletingClientId === client.id
                              ? "Eliminando"
                              : "Eliminar"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 p-4 md:hidden">
                {filteredClients.map((client) => (
                  <article
                    key={client.id}
                    className="rounded-xl border border-[#d6ad4a]/14 bg-black/50 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#d6ad4a]/45"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-base font-black text-white">
                          {client.name}
                        </h2>
                        <a
                          href={`https://wa.me/${client.phone.replace(/\D/g, "")}`}
                          className="mt-1 block text-sm text-[#d6ad4a]"
                        >
                          {client.phone}
                        </a>
                      </div>
                      <ClientStatusBadge status={client.status} />
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <InfoItem label="Servicio" value={client.service} />
                      <InfoItem
                        label="Registro"
                        value={formatDate(client.created_at)}
                      />
                      <InfoItem
                        label="Cumpleanos"
                        value={formatDate(client.birthday)}
                      />
                    </dl>
                    <div className="mt-4 border-t border-[#d6ad4a]/10 pt-4">
                      <button
                        onClick={() => setClientPendingDelete(client)}
                        disabled={deletingClientId === client.id}
                        className="min-h-10 w-full rounded-lg border border-red-400/30 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-red-200 transition hover:bg-red-400 hover:text-black"
                      >
                        {deletingClientId === client.id
                          ? "Eliminando..."
                          : "Eliminar cliente"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {modalOpen ? (
        <CreateAppointmentModal
          clients={clients}
          appointment={editingAppointment}
          initialDate={modalInitialDate}
          initialTime={modalInitialTime}
          saving={saving}
          onClose={closeAppointmentModal}
          onSubmit={handleSaveAppointment}
        />
      ) : null}

      {clientPendingDelete ? (
        <ConfirmDeleteClientModal
          client={clientPendingDelete}
          onCancel={() => setClientPendingDelete(null)}
          onConfirm={handleConfirmDeleteClient}
        />
      ) : null}
    </main>
  );
}

function CreateAppointmentModal({
  clients,
  appointment,
  initialDate,
  initialTime,
  saving,
  onClose,
  onSubmit,
}: {
  clients: Client[];
  appointment: Appointment | null;
  initialDate: string | null;
  initialTime: string | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (payload: AppointmentFormPayload) => void;
}) {
  const today = toDateKey(new Date());
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState(appointment?.client_name || "");
  const [clientPhone, setClientPhone] = useState(
    appointment?.client_phone || "",
  );
  const [service, setService] = useState(appointment?.service || "");
  const [category, setCategory] = useState<AppointmentCategory>(
    appointment?.category || "tattoo",
  );
  const [status, setStatus] = useState<AppointmentStatus>(
    appointment?.status || "pending",
  );
  const [date, setDate] = useState(
    appointment?.appointment_date || initialDate || today,
  );
  const [time, setTime] = useState(
    appointment?.appointment_time || initialTime || "",
  );
  const [deposit, setDeposit] = useState(
    String(appointment?.deposit_amount || ""),
  );
  const [notes, setNotes] = useState(appointment?.notes || "");

  function handleClientChange(value: string) {
    setClientId(value);

    const selectedClient = clients.find((client) => client.id === value);

    if (!selectedClient) {
      return;
    }

    setClientName(selectedClient.name);
    setClientPhone(selectedClient.phone);
    setService(selectedClient.service || "");
    setCategory(
      selectedClient.service.toLowerCase().includes("barber")
        ? "barber"
        : "tattoo",
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      client_name: clientName.trim(),
      client_phone: clientPhone.trim(),
      service: service.trim(),
      category,
      appointment_date: date,
      appointment_time: time,
      status,
      notes: notes.trim() || null,
      deposit_amount: Number(deposit || 0),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-4 backdrop-blur-sm sm:items-center">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#d6ad4a]/25 bg-[#070707] shadow-[0_30px_120px_rgba(0,0,0,0.75)]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#d6ad4a]/15 bg-[#070707]/95 p-5 backdrop-blur">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d6ad4a]">
              Agenda Mambas
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase text-white">
              {appointment ? "Editar cita" : "Nueva cita"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-[#d6ad4a]/30 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#d6ad4a] transition hover:bg-[#d6ad4a] hover:text-black"
          >
            Cerrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <FormLabel>Cliente registrado</FormLabel>
            <select
              value={clientId}
              onChange={(event) => handleClientChange(event.target.value)}
              className="admin-field"
            >
              <option value="">Captura manual</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.phone}
                </option>
              ))}
            </select>
          </label>

          <label>
            <FormLabel>Nombre del cliente</FormLabel>
            <input
              value={clientName}
              onChange={(event) => setClientName(event.target.value)}
              required
              className="admin-field"
              placeholder="Nombre"
            />
          </label>

          <label>
            <FormLabel>Telefono</FormLabel>
            <input
              value={clientPhone}
              onChange={(event) => setClientPhone(event.target.value)}
              required
              className="admin-field"
              placeholder="+52..."
            />
          </label>

          <label className="sm:col-span-2">
            <FormLabel>Servicio</FormLabel>
            <input
              value={service}
              onChange={(event) => setService(event.target.value)}
              className="admin-field"
              placeholder="Corte, blackwork, piercing, barba..."
            />
          </label>

          <label>
            <FormLabel>Categoria</FormLabel>
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as AppointmentCategory)
              }
              required
              className="admin-field"
            >
              <option value="tattoo">Tattoo</option>
              <option value="barber">Barber</option>
            </select>
          </label>

          <label>
            <FormLabel>Estado</FormLabel>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as AppointmentStatus)
              }
              required
              className="admin-field"
            >
              {appointmentStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </label>

          <label>
            <FormLabel>Fecha</FormLabel>
            <input
              value={date}
              onChange={(event) => setDate(event.target.value)}
              type="date"
              min={appointment ? undefined : today}
              required
              className="admin-field"
            />
          </label>

          <label>
            <FormLabel>Hora</FormLabel>
            <input
              value={time}
              onChange={(event) => setTime(event.target.value)}
              type="time"
              required
              className="admin-field"
            />
          </label>

          <label className="sm:col-span-2">
            <FormLabel>Anticipo MXN</FormLabel>
            <input
              value={deposit}
              onChange={(event) => setDeposit(event.target.value)}
              type="number"
              min="0"
              step="50"
              placeholder="0"
              className="admin-field"
            />
          </label>

          <label className="sm:col-span-2">
            <FormLabel>Notas</FormLabel>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              placeholder="Referencia, estilo, detalles del corte, zona, medidas..."
              className="admin-field min-h-28 resize-y py-3"
            />
          </label>

          <div className="flex flex-col gap-3 pt-2 sm:col-span-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 rounded-lg border border-[#d6ad4a]/30 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#d6ad4a] transition hover:bg-[#d6ad4a] hover:text-black"
            >
              Cancelar
            </button>
            <button
              disabled={saving}
              className="min-h-11 rounded-lg bg-[#d6ad4a] px-5 py-2 text-xs font-black uppercase tracking-[0.16em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Guardando..." : appointment ? "Guardar cambios" : "Crear cita"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmDeleteClientModal({
  client,
  onCancel,
  onConfirm,
}: {
  client: Client;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-xl border border-red-400/25 bg-[#070707] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.75)]">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-200">
          Confirmar eliminacion
        </p>
        <h2 className="mt-3 text-2xl font-black uppercase text-white">
          Eliminar cliente
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Se eliminara {client.name}. Esta accion no se puede deshacer.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            className="min-h-11 rounded-lg border border-[#d6ad4a]/30 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#d6ad4a] transition hover:bg-[#d6ad4a] hover:text-black"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="min-h-11 rounded-lg border border-red-400/30 bg-red-400 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-black transition hover:bg-white"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

function DailyScheduleView({
  date,
  appointments,
  onEdit,
  onCreate,
  onReschedule,
}: {
  date: string;
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onCreate: (date: string, hour: number) => void;
  onReschedule: (appointment: Appointment, date: string, hour: number) => void;
}) {
  const appointmentsByHour = useMemo(() => {
    return scheduleHours.reduce<Record<number, Appointment[]>>((grouped, hour) => {
      grouped[hour] = appointments.filter(
        (appointment) => appointmentHour(appointment) === hour,
      );
      return grouped;
    }, {});
  }, [appointments]);

  function handleDrop(event: DragEvent<HTMLDivElement>, hour: number) {
    event.preventDefault();
    const appointmentId = event.dataTransfer.getData("appointment/id");
    const appointment = appointments.find((item) => item.id === appointmentId);

    if (appointment) {
      onReschedule(appointment, date, hour);
    }
  }

  return (
    <Panel>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d6ad4a]">
            Dia operativo
          </p>
          <h2 className="mt-2 text-2xl font-black uppercase text-white">
            {formatDate(date)}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Timeline de 9:00 AM a 10:00 PM. Arrastra una cita para cambiar hora.
          </p>
        </div>
        <div className="rounded-lg border border-[#d6ad4a]/15 bg-black/40 px-4 py-3 text-sm text-zinc-300">
          <span className="font-black text-[#d6ad4a]">{appointments.length}</span>{" "}
          citas programadas
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-[#d6ad4a]/12 md:block">
        {scheduleHours.map((hour) => {
          const hourAppointments = appointmentsByHour[hour] || [];

          return (
            <div
              key={hour}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, hour)}
              className="grid min-h-[92px] grid-cols-[92px_minmax(0,1fr)] border-b border-[#d6ad4a]/10 last:border-b-0"
            >
              <button
                onClick={() => onCreate(date, hour)}
                className="border-r border-[#d6ad4a]/10 bg-black/35 px-3 py-4 text-left transition hover:bg-[#d6ad4a]/10"
              >
                <p className="text-sm font-black text-[#d6ad4a]">
                  {formatHourLabel(hour)}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                  Nueva
                </p>
              </button>

              <div className="relative bg-white/[0.015] p-3">
                {hourAppointments.length === 0 ? (
                  <button
                    onClick={() => onCreate(date, hour)}
                    className="flex h-full min-h-[66px] w-full items-center rounded-lg border border-dashed border-[#d6ad4a]/12 px-4 text-left text-sm text-zinc-600 transition hover:border-[#d6ad4a]/35 hover:text-zinc-300"
                  >
                    Disponible
                  </button>
                ) : (
                  <div className="relative min-h-[66px]">
                    {hourAppointments.map((appointment, index) => (
                      <DailyAppointmentBlock
                        key={appointment.id}
                        appointment={appointment}
                        index={index}
                        total={hourAppointments.length}
                        onEdit={onEdit}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 md:hidden">
        {scheduleHours.map((hour) => {
          const hourAppointments = appointmentsByHour[hour] || [];

          return (
            <div
              key={hour}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, hour)}
              className="rounded-xl border border-[#d6ad4a]/12 bg-black/35 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <button
                  onClick={() => onCreate(date, hour)}
                  className="text-left"
                >
                  <p className="text-sm font-black text-[#d6ad4a]">
                    {formatHourLabel(hour)}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">
                    {hourAppointments.length} citas
                  </p>
                </button>
                <button
                  onClick={() => onCreate(date, hour)}
                  className="rounded-lg border border-[#d6ad4a]/30 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#d6ad4a]"
                >
                  Nueva
                </button>
              </div>

              {hourAppointments.length ? (
                <div className="space-y-2">
                  {hourAppointments.map((appointment) => (
                    <DailyAppointmentMobileCard
                      key={appointment.id}
                      appointment={appointment}
                      onEdit={onEdit}
                    />
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-dashed border-[#d6ad4a]/12 px-3 py-3 text-sm text-zinc-600">
                  Disponible
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function DailyAppointmentBlock({
  appointment,
  index,
  total,
  onEdit,
}: {
  appointment: Appointment;
  index: number;
  total: number;
  onEdit: (appointment: Appointment) => void;
}) {
  const width = `calc(${100 / total}% - 6px)`;
  const left = `${(100 / total) * index}%`;

  return (
    <button
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("appointment/id", appointment.id);
        event.dataTransfer.effectAllowed = "move";
      }}
      onClick={() => onEdit(appointment)}
      className={`absolute top-0 min-h-[66px] rounded-lg border p-3 text-left shadow-[0_14px_36px_rgba(0,0,0,0.26)] transition hover:-translate-y-0.5 ${appointmentCategoryClasses(
        appointment.category,
      )}`}
      style={{ left, width }}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-black uppercase text-white">
            {formatTime(appointment.appointment_time)}
          </p>
          <p className="mt-1 truncate text-sm font-bold text-white">
            {appointment.client_name}
          </p>
        </div>
        <AppointmentStatusBadge status={appointment.status} />
      </div>
      <p className="truncate text-[11px] uppercase tracking-[0.16em] text-zinc-400">
        {appointment.category === "tattoo" ? "Tattoo" : "Barber"} ·{" "}
        {appointment.service || "Servicio"}
      </p>
    </button>
  );
}

function DailyAppointmentMobileCard({
  appointment,
  onEdit,
}: {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
}) {
  return (
    <button
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("appointment/id", appointment.id);
        event.dataTransfer.effectAllowed = "move";
      }}
      onClick={() => onEdit(appointment)}
      className={`w-full rounded-lg border p-3 text-left ${appointmentCategoryClasses(
        appointment.category,
      )}`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm font-black text-white">
          {formatTime(appointment.appointment_time)}
        </p>
        <AppointmentStatusBadge status={appointment.status} />
      </div>
      <p className="font-bold text-white">{appointment.client_name}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-zinc-400">
        {appointment.category === "tattoo" ? "Tattoo" : "Barber"} ·{" "}
        {appointment.service || "Servicio"}
      </p>
    </button>
  );
}

function AppointmentCard({
  appointment,
  onEdit,
  onDelete,
}: {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
}) {
  return (
    <article className="rounded-xl border border-[#d6ad4a]/14 bg-black/45 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#d6ad4a]/45 hover:bg-[#d6ad4a]/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black text-white">
              {appointment.client_name}
            </h3>
            <AppointmentStatusBadge status={appointment.status} />
          </div>
          <a
            href={`https://wa.me/${appointment.client_phone.replace(/\D/g, "")}`}
            className="mt-1 inline-block text-sm text-[#d6ad4a] transition hover:text-white"
          >
            {appointment.client_phone}
          </a>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm font-black uppercase text-white">
            {formatDate(appointment.appointment_date)}
          </p>
          <p className="text-sm text-zinc-400">
            {formatTime(appointment.appointment_time)}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <InfoItem label="Servicio" value={appointment.service || "-"} />
        <InfoItem
          label="Categoria"
          value={appointment.category === "tattoo" ? "Tattoo" : "Barber"}
        />
        <InfoItem
          label="Anticipo"
          value={`${Number(appointment.deposit_amount || 0).toLocaleString(
            "es-MX",
          )} MXN`}
        />
        <InfoItem label="Notas" value={appointment.notes || "-"} />
      </dl>
      <WhatsAppAutomationActions appointment={appointment} />
      <div className="mt-4 flex flex-col gap-2 border-t border-[#d6ad4a]/10 pt-4 sm:flex-row sm:justify-end">
        <button
          onClick={() => onEdit(appointment)}
          className="min-h-10 rounded-lg border border-[#d6ad4a]/30 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#d6ad4a] transition hover:bg-[#d6ad4a] hover:text-black"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(appointment)}
          className="min-h-10 rounded-lg border border-red-400/30 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-red-200 transition hover:bg-red-400 hover:text-black"
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}

function WhatsAppAutomationActions({
  appointment,
}: {
  appointment: Appointment;
}) {
  const actions = [
    {
      label: "Confirmar cita",
      message: buildWhatsAppMessage("confirm", appointment),
    },
    {
      label: "Recordatorio",
      message: buildWhatsAppMessage("reminder", appointment),
    },
    {
      label: "Solicitar anticipo",
      message: buildWhatsAppMessage("deposit", appointment),
    },
    {
      label: "Enviar ubicacion",
      message: buildWhatsAppMessage("location", appointment),
    },
  ];

  return (
    <div className="mt-4 border-t border-[#d6ad4a]/10 pt-4">
      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
        WhatsApp automatico
      </p>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <a
            key={action.label}
            href={buildWhatsAppUrl(appointment.client_phone, action.message)}
            target="_blank"
            rel="noreferrer"
            className="min-h-10 rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-center text-[10px] font-black uppercase tracking-[0.14em] text-emerald-100 transition hover:-translate-y-0.5 hover:border-emerald-300/60 hover:bg-emerald-400 hover:text-black"
          >
            {action.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function CalendarAppointmentPill({
  appointment,
}: {
  appointment: Appointment;
}) {
  return (
    <div
      className={`rounded-md border px-2 py-1 text-[10px] ${calendarStatusClasses(
        appointment.status,
      )}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-black">{formatTime(appointment.appointment_time)}</span>
        <span className="uppercase text-zinc-400">
          {appointment.category === "tattoo" ? "Tattoo" : "Barber"}
        </span>
      </div>
      <p className="mt-0.5 truncate font-bold text-zinc-100">
        {appointment.client_name}
      </p>
      <p className="mt-0.5 truncate uppercase tracking-[0.12em] text-zinc-500">
        {statusLabels[appointment.status]}
      </p>
    </div>
  );
}

function CalendarMobileAppointment({
  appointment,
}: {
  appointment: Appointment;
}) {
  return (
    <div className="rounded-lg border border-[#d6ad4a]/10 bg-black/45 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-black text-[#d6ad4a]">
          {formatTime(appointment.appointment_time)}
        </p>
        <AppointmentStatusBadge status={appointment.status} />
      </div>
      <p className="font-bold text-white">{appointment.client_name}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">
        {appointment.category === "tattoo" ? "Tattoo" : "Barber"}
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-[#d6ad4a]/15 bg-[#080808]/90 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.38)] transition duration-200 hover:-translate-y-1 hover:border-[#d6ad4a]/45">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-black text-[#d6ad4a] xl:text-4xl">
        {value}
      </p>
    </article>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#d6ad4a]/12 bg-black/45 p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-black text-[#d6ad4a]">{value}</p>
    </div>
  );
}

function RevenueBarChart({
  data,
}: {
  data: Array<{ label: string; revenue: number }>;
}) {
  const maxRevenue = Math.max(...data.map((item) => item.revenue), 1);

  return (
    <div className="flex h-64 items-end gap-2 sm:gap-3">
      {data.map((item) => {
        const height = Math.max((item.revenue / maxRevenue) * 100, 4);

        return (
          <div key={item.label} className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-1 items-end rounded-lg bg-white/[0.03] p-1">
              <div
                className="w-full rounded-md bg-gradient-to-t from-[#8a6a1e] to-[#d6ad4a] shadow-[0_0_24px_rgba(214,173,74,0.16)] transition duration-300 hover:brightness-125"
                style={{ height: `${height}%` }}
                title={`${item.label}: ${item.revenue.toLocaleString(
                  "es-MX",
                )} MXN`}
              />
            </div>
            <div className="text-center">
              <p className="truncate text-[10px] font-bold uppercase text-zinc-500">
                {item.label}
              </p>
              <p className="truncate text-[10px] text-[#d6ad4a]">
                {item.revenue.toLocaleString("es-MX")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ComparisonChart({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: number }>;
}) {
  const maxValue = Math.max(...rows.map((row) => row.value), 1);

  return (
    <div className="rounded-xl border border-[#d6ad4a]/10 bg-black/35 p-4">
      <h3 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-white">
        {title}
      </h3>
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-bold text-zinc-200">{row.label}</span>
              <span className="text-[#d6ad4a]">
                {row.value.toLocaleString("es-MX")} MXN
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-[#d6ad4a] transition-all duration-300"
                style={{ width: `${Math.max((row.value / maxValue) * 100, 3)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusDistribution({
  stats,
}: {
  stats: Array<{ status: AppointmentStatus; count: number; percentage: number }>;
}) {
  return (
    <div className="rounded-xl border border-[#d6ad4a]/10 bg-black/35 p-4">
      <h3 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-white">
        Estado de citas
      </h3>
      <div className="space-y-3">
        {stats.map((item) => (
          <div key={item.status}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <AppointmentStatusBadge status={item.status} />
              <span className="text-sm text-zinc-400">
                {item.count} · {item.percentage}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-[#d6ad4a]"
                style={{ width: `${Math.max(item.percentage, item.count ? 4 : 0)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[#d6ad4a]/15 bg-[#080808]/90 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.48)] sm:p-5">
      {children}
    </section>
  );
}

function ClientStatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex rounded-full border border-[#d6ad4a]/20 bg-[#d6ad4a]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#d6ad4a]">
      {status || "Nuevo"}
    </span>
  );
}

function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${appointmentStatusClasses(
        status,
      )}`}
    >
      {statusLabels[status]}
    </span>
  );
}

function appointmentStatusClasses(status: AppointmentStatus) {
  const styles: Record<AppointmentStatus, string> = {
    pending: "border-yellow-400/25 bg-yellow-400/10 text-yellow-200",
    confirmed: "border-[#d6ad4a]/30 bg-[#d6ad4a]/10 text-[#d6ad4a]",
    completed: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    cancelled: "border-red-400/25 bg-red-400/10 text-red-200",
  };

  return styles[status];
}

function calendarStatusClasses(status: AppointmentStatus) {
  const styles: Record<AppointmentStatus, string> = {
    pending: "border-yellow-400/15 bg-yellow-400/10 text-yellow-100",
    confirmed: "border-[#d6ad4a]/20 bg-[#d6ad4a]/10 text-[#d6ad4a]",
    completed: "border-emerald-400/15 bg-emerald-400/10 text-emerald-100",
    cancelled: "border-red-400/15 bg-red-400/10 text-red-100",
  };

  return styles[status];
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex min-h-[260px] items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-[#d6ad4a]/25 bg-[#d6ad4a]/10 text-2xl font-black text-[#d6ad4a]">
          M
        </div>
        <h2 className="text-2xl font-black uppercase tracking-normal text-white">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{text}</p>
      </div>
    </div>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="h-11 w-11 animate-spin rounded-full border-2 border-[#d6ad4a]/20 border-t-[#d6ad4a]" />
      <p className="text-sm uppercase tracking-[0.22em] text-zinc-400">
        {label}
      </p>
    </div>
  );
}

function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
      {children}
    </span>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-zinc-200">{value}</dd>
    </div>
  );
}

function buildCalendarDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const start = new Date(year, month, 1 - firstDay.getDay());
  const todayKey = toDateKey(new Date());

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);

    return {
      key: toDateKey(day),
      label: day.getDate(),
      currentMonth: day.getMonth() === month,
      today: toDateKey(day) === todayKey,
    };
  });
}

async function saveAppointmentWithCompatibility(
  formPayload: AppointmentFormPayload,
  editingAppointment: Appointment | null,
) {
  const payload = normalizeAppointmentPayload(formPayload);
  let result = await mutateAppointment(payload, editingAppointment);

  if (!result.error) {
    return result;
  }

  logSupabaseAppointmentError(result.error, payload, "initial appointment save");

  const removedColumns: string[] = [];

  for (let attempt = 0; attempt < 6 && result.error; attempt += 1) {
    const missingColumn = getMissingColumnName(result.error);

    if (!missingColumn || !(missingColumn in payload)) {
      break;
    }

    removedColumns.push(missingColumn);
    delete payload[missingColumn as keyof AppointmentMutationPayload];
    console.warn(
      `Retrying appointment save without ${missingColumn} because Supabase schema does not expose appointments.${missingColumn}.`,
      { removedColumns, nextPayload: payload },
    );
    result = await mutateAppointment(payload, editingAppointment);
  }

  if (!result.error) {
    return result;
  }

  return result;
}

function normalizeAppointmentPayload(
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
  };

  if (payload.service.trim()) {
    normalized.service = payload.service.trim();
  }

  return normalized;
}

function hydrateAppointment(
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
    created_at: source.created_at || new Date().toISOString(),
  };
}

async function mutateAppointment(
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

function logSupabaseAppointmentError(
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

function getMissingColumnName(error: SupabaseMutationError) {
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

function appointmentStatusOrDefault(status: string): AppointmentStatus {
  return appointmentStatuses.includes(status as AppointmentStatus)
    ? (status as AppointmentStatus)
    : "pending";
}

function appointmentCategoryOrDefault(category: string): AppointmentCategory {
  return category === "barber" ? "barber" : "tattoo";
}

function normalizeTime(value: string) {
  return value.length === 5 ? `${value}:00` : value;
}

function buildRevenueAnalytics(appointments: Appointment[]) {
  const currentMonthKey = monthKey(new Date());
  const monthlyRevenue = buildLastSixMonths().map((month) => {
    const revenue = appointments
      .filter((appointment) => appointment.appointment_date.startsWith(month.key))
      .reduce(
        (total, appointment) => total + Number(appointment.deposit_amount || 0),
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
      (total, appointment) => total + Number(appointment.deposit_amount || 0),
      0,
    );

  const categoryRevenue = appointments.reduce(
    (totals, appointment) => {
      totals[appointment.category] += Number(appointment.deposit_amount || 0);
      return totals;
    },
    { tattoo: 0, barber: 0 } as Record<AppointmentCategory, number>,
  );

  const currentMonthRevenue = appointments
    .filter((appointment) =>
      appointment.appointment_date.startsWith(currentMonthKey),
    )
    .reduce(
      (total, appointment) => total + Number(appointment.deposit_amount || 0),
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
      clients[key].revenue += Number(appointment.deposit_amount || 0);
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

function buildLastSixMonths() {
  const today = new Date();

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - 5 + index, 1);

    return {
      key: monthKey(date),
      label: date.toLocaleDateString("es-MX", { month: "short" }),
    };
  });
}

function monthKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function sortAppointments(a: Appointment, b: Appointment) {
  return (
    `${a.appointment_date} ${a.appointment_time}`.localeCompare(
      `${b.appointment_date} ${b.appointment_time}`,
    ) || a.client_name.localeCompare(b.client_name)
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value: string) {
  return value.slice(0, 5);
}

function appointmentHour(appointment: Appointment) {
  const parsed = Number(appointment.appointment_time.slice(0, 2));

  if (!Number.isFinite(parsed)) {
    return 9;
  }

  return Math.min(Math.max(parsed, 9), 21);
}

function formatHourLabel(hour: number) {
  return new Date(2026, 0, 1, hour).toLocaleTimeString("es-MX", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function appointmentCategoryClasses(category: AppointmentCategory) {
  return category === "barber"
    ? "border-sky-400/25 bg-sky-400/10 hover:border-sky-300/50"
    : "border-[#d6ad4a]/25 bg-[#d6ad4a]/10 hover:border-[#d6ad4a]/55";
}

type WhatsAppMessageType = "confirm" | "reminder" | "deposit" | "location";

function buildWhatsAppUrl(phone: string, message: string) {
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

function buildWhatsAppMessage(
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
    return `${baseGreeting}\n\nTe recordamos tu cita:\nServicio: ${service}\nFecha: ${date}\nHora: ${time}\n\nPor favor llega unos minutos antes. Si tienes referencias o cambios, puedes enviarlos por aqui.`;
  }

  if (type === "deposit") {
    return `${baseGreeting}\n\nPara apartar tu cita de ${service} el ${date} a las ${time}, se requiere anticipo.\nMonto registrado: ${deposit} MXN\nLink de pago: ${depositPaymentUrl}\n\nEl anticipo asegura tu espacio y se descuenta del total final cuando aplique.`;
  }

  return `${baseGreeting}\n\nEsta es nuestra ubicacion para tu cita de ${service}:\nMambas Tattoo & Cuts\nCalle 1 Sur esquina Av. 25 Sur, Centro, Playa del Carmen\n\nGoogle Maps: ${adminGoogleMapsUrl}\n\nTe esperamos.`;
}

function categoryLabel(category: AppointmentCategory) {
  return category === "barber" ? "Barberia" : "Tattoo";
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
