"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

import {
  type Client,
  type Appointment,
  type AppointmentFormPayload,
  type AppointmentMutationPayload,
  type AppointmentStatus,
  expectedAppointmentColumns,
  statusLabels,
  hydrateAppointment,
  sortAppointments,
  toDateKey,
  addMonths,
  formatDate,
  formatBirthday,
  buildCalendarDays,
  buildRevenueAnalytics,
  mutateAppointment,
  normalizeAppointmentPayload,
  logSupabaseAppointmentError,
  getMissingColumnName,
  normalizeTime,
} from "./types";

import {
  Panel,
  ClientStatusBadge,
  EmptyState,
  LoadingState,
  InfoItem,
} from "./components/Badges";

import ConfirmDeleteClientModal from "./components/ConfirmDeleteClientModal";
import CreateAppointmentModal from "./components/CreateAppointmentModal";
import AppointmentCard from "./components/AppointmentCard";
import DailyScheduleView from "./components/DailyScheduleView";
import {
  CalendarAppointmentPill,
  CalendarMobileAppointment,
} from "./components/CalendarAppointments";
import {
  StatCard,
  MiniMetric,
  RevenueBarChart,
  ComparisonChart,
  StatusDistribution,
} from "./components/AnalyticsCharts";

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
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "ok" | "error";
    text: string;
  } | null>(null);
  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<
    string | null
  >(null);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    return localStorage.getItem("mambas-admin-theme") === "light"
      ? "light"
      : "dark";
  });

  const [activeTab, setActiveTab] = useState<"agenda" | "clientes" | "analitica">("agenda");
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState(false);
  const [passwordPromptOpen, setPasswordPromptOpen] = useState(false);
  const [ownerPasswordInput, setOwnerPasswordInput] = useState("");
  const [ownerPasswordError, setOwnerPasswordError] = useState("");

  const OWNER_PASSWORD = process.env.NEXT_PUBLIC_OWNER_PASSWORD || "owner2026";

  function handleTabClick(tab: "agenda" | "clientes" | "analitica") {
    if (tab === "analitica") {
      if (isOwnerUnlocked) {
        setActiveTab("analitica");
      } else {
        setOwnerPasswordInput("");
        setOwnerPasswordError("");
        setPasswordPromptOpen(true);
      }
    } else {
      setActiveTab(tab);
    }
  }

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

  useEffect(() => {
    localStorage.setItem("mambas-admin-theme", theme);
  }, [theme]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  function openPasswordModal() {
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage(null);
    setPasswordModalOpen(true);
  }

  async function handleChangePassword(event: FormEvent) {
    event.preventDefault();

    if (newPassword.length < 8) {
      setPasswordMessage({
        type: "error",
        text: "La contraseña debe tener al menos 8 caracteres.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "Las contraseñas no coinciden.",
      });
      return;
    }

    setPasswordSaving(true);
    setPasswordMessage(null);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setPasswordSaving(false);

    if (error) {
      setPasswordMessage({
        type: "error",
        text: `No se pudo actualizar: ${error.message}`,
      });
      return;
    }

    setPasswordMessage({
      type: "ok",
      text: "Contraseña actualizada correctamente.",
    });
    setNewPassword("");
    setConfirmPassword("");
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
      setErrorMessage("Nombre y teléfono del cliente son obligatorios.");
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

  async function saveAppointmentWithCompatibility(
    payload: AppointmentFormPayload,
    editingAppointment: Appointment | null,
  ) {
    const normalized = normalizeAppointmentPayload(payload);
    let result = await mutateAppointment(normalized, editingAppointment);

    if (result.error) {
      const missingColumn = getMissingColumnName(result.error);
      if (missingColumn) {
        const removedColumns = [missingColumn];
        delete normalized[missingColumn as keyof AppointmentMutationPayload];
        console.warn(
          `Retrying appointment save without ${missingColumn} because Supabase schema does not expose appointments.${missingColumn}.`,
          { removedColumns, nextPayload: normalized },
        );
        result = await mutateAppointment(normalized, editingAppointment);
      }
    }
    return result;
  }

  async function handleDeleteAppointment(appointment: Appointment) {
    const confirmed = window.confirm(
      `¿Eliminar la cita de ${appointment.client_name}?`,
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

  async function handleCancelAppointment(appointment: Appointment) {
    if (appointment.status === "cancelled") {
      return;
    }

    const confirmed = window.confirm(
      `¿Cancelar la cita de ${appointment.client_name}? Se marcará como cancelada (no se elimina).`,
    );

    if (!confirmed) {
      return;
    }

    const previousAppointments = appointments;
    setErrorMessage("");
    setAppointments((current) =>
      current.map((item) =>
        item.id === appointment.id
          ? { ...item, status: "cancelled" as AppointmentStatus }
          : item,
      ),
    );

    const { error } = await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", appointment.id);

    if (error) {
      console.error(error);
      setAppointments(previousAppointments);
      setErrorMessage(
        `No se pudo cancelar la cita: ${error.message || "error desconocido"}`,
      );
    }
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

    const { data, error } = await supabase
      .from("clients")
      .delete()
      .eq("id", client.id)
      .select("id")
      .maybeSingle();

    if (error || !data) {
      console.error("Supabase client delete failed", {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        deletedRow: data,
        client,
      });
      setErrorMessage(
        error?.message
          ? `No se pudo eliminar el cliente: ${error.message}`
          : "No se eliminó ningún cliente. Revisa la policy DELETE de la tabla clients en Supabase.",
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
    <main
      suppressHydrationWarning
      className={`admin-dashboard min-h-screen bg-[#040404] text-white ${
        theme === "light" ? "admin-light" : "admin-dark"
      }`}
    >
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(243,210,122,0.2),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(135deg,rgba(214,173,74,0.07),transparent_42%)]" />

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
                onClick={() =>
                  setTheme((currentTheme) =>
                    currentTheme === "dark" ? "light" : "dark",
                  )
                }
                className="min-h-11 shrink-0 rounded-lg border border-[#d6ad4a]/50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#d6ad4a] transition duration-200 hover:-translate-y-0.5 hover:bg-[#d6ad4a] hover:text-black hover:shadow-[0_18px_44px_rgba(214,173,74,0.22)]"
              >
                {theme === "dark" ? "Claro" : "Oscuro"}
              </button>
              <button
                onClick={() => openCreateAppointment()}
                className="hidden min-h-11 rounded-lg bg-[#d6ad4a] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-black transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_44px_rgba(214,173,74,0.22)] sm:inline-flex sm:items-center"
              >
                Nueva cita
              </button>
              <button
                onClick={openPasswordModal}
                className="min-h-11 shrink-0 rounded-lg border border-[#d6ad4a]/50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#d6ad4a] transition duration-200 hover:-translate-y-0.5 hover:bg-[#d6ad4a] hover:text-black hover:shadow-[0_18px_44px_rgba(214,173,74,0.22)]"
              >
                Contraseña
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

        {/* Navigation Tabs */}
        <div className="mb-6 flex border-b border-[#d6ad4a]/20">
          <button
            onClick={() => handleTabClick("agenda")}
            className={`pb-3 px-4 text-xs font-black uppercase tracking-[0.2em] transition-all duration-200 border-b-2 ${
              activeTab === "agenda"
                ? "border-[#d6ad4a] text-[#d6ad4a]"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Agenda
          </button>
          <button
            onClick={() => handleTabClick("clientes")}
            className={`pb-3 px-4 text-xs font-black uppercase tracking-[0.2em] transition-all duration-200 border-b-2 ${
              activeTab === "clientes"
                ? "border-[#d6ad4a] text-[#d6ad4a]"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Clientes
          </button>
          <button
            onClick={() => handleTabClick("analitica")}
            className={`pb-3 px-4 text-xs font-black uppercase tracking-[0.2em] transition-all duration-200 border-b-2 flex items-center gap-1.5 ${
              activeTab === "analitica"
                ? "border-[#d6ad4a] text-[#d6ad4a]"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            Analítica {!isOwnerUnlocked && "🔒"}
          </button>
        </div>

        {activeTab === "agenda" && (
          <>
            <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Clientes" value={clients.length.toString()} />
              <StatCard label="Citas" value={appointments.length.toString()} />
              <StatCard label="Tattoo" value={tattooAppointments.toString()} />
              <StatCard label="Barbería" value={barberAppointments.toString()} />
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
                      Anterior
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
                      Siguiente
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
                              onEdit={openEditAppointment}
                            />
                          ))}
                          {dayAppointments.length > 2 ? (
                            <div className="text-[10px] text-zinc-500">
                              +{dayAppointments.length - 2} más
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
                                  onEdit={openEditAppointment}
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
                      {selectedCalendarDate ? "Día seleccionado" : "Citas"}
                    </p>
                    <h2 className="mt-2 text-2xl font-black uppercase text-white">
                      {selectedCalendarDate
                        ? formatDate(selectedCalendarDate)
                        : "Próximas citas"}
                    </h2>
                    {selectedCalendarDate ? (
                      <p className="mt-2 text-sm text-zinc-400">
                        {selectedDayAppointments.length} citas en este día
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
                    text="Crea la primera cita desde el botón Nueva cita."
                  />
                ) : filteredAppointments.length === 0 ? (
                  <EmptyState
                    title="Sin resultados"
                    text="No encontramos citas que coincidan con esa búsqueda."
                  />
                ) : (
                  <div className="space-y-3">
                    {filteredAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onEdit={openEditAppointment}
                        onCancel={handleCancelAppointment}
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
          </>
        )}

        {activeTab === "clientes" && (
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
                text="Cuando alguien complete el formulario de lealtad, aparecerá aquí."
              />
            ) : filteredClients.length === 0 ? (
              <EmptyState
                title="Sin resultados"
                text="No encontramos clientes que coincidan con esa búsqueda."
              />
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[860px] text-sm">
                    <thead>
                      <tr className="border-b border-[#d6ad4a]/10 bg-[#0d0d0d] text-left text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                        <th className="px-5 py-4">Nombre</th>
                        <th className="px-5 py-4">Teléfono</th>
                        <th className="px-5 py-4">Cumpleaños</th>
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
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#d6ad4a] transition hover:text-white"
                            >
                              {client.phone}
                            </a>
                          </td>
                          <td className="px-5 py-4">
                            {formatBirthday(client.birthday)}
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
                            target="_blank"
                            rel="noopener noreferrer"
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
                          label="Cumpleaños"
                          value={formatBirthday(client.birthday)}
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
        )}

        {activeTab === "analitica" && isOwnerUnlocked && (
          <>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-zinc-800 bg-[#080808]/40 p-4">
              <div>
                <p className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Sesión de dueño activa
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Las estadísticas financieras e ingresos reales son visibles.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsOwnerUnlocked(false);
                  setActiveTab("agenda");
                }}
                className="rounded-lg border border-red-500/30 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-red-400 hover:bg-red-500 hover:text-white transition duration-200"
              >
                Bloquear analíticas 🔒
              </button>
            </div>

            <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard
                label="Anticipos Totales"
                value={`${depositsTotal.toLocaleString("es-MX")} MXN`}
              />
              <StatCard
                label="Total Ingresos (Mes)"
                value={`${analytics.currentMonthRevenue.toLocaleString("es-MX")} MXN`}
              />
              <StatCard
                label="Ticket Promedio"
                value={`${analytics.averageDeposit.toLocaleString("es-MX")} MXN`}
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
                      Analítica financiera
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400">
                      Ingresos totales proyectados y facturados (cubre anticipo y costo total del servicio).
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
                      title="Depósitos vs completadas"
                      rows={[
                        {
                          label: "Depósitos",
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
                    Estadísticas
                  </h2>
                </div>

                <div className="space-y-5">
                  <StatusDistribution stats={analytics.statusStats} />

                  <div className="rounded-xl border border-[#d6ad4a]/10 bg-black/35 p-4">
                    <h3 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-white">
                      Top clientes
                    </h3>
                    {analytics.topClients.length === 0 ? (
                      <p className="text-sm text-zinc-500">Sin citas todavía.</p>
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
          </>
        )}
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
          saving={deletingClientId === clientPendingDelete.id}
          onClose={() => setClientPendingDelete(null)}
          onConfirm={handleConfirmDeleteClient}
        />
      ) : null}

      {passwordModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-4 backdrop-blur-sm sm:items-center">
          <form
            onSubmit={handleChangePassword}
            className="w-full max-w-md rounded-2xl border border-[#d6ad4a]/30 bg-[#070707] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.6)]"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d6ad4a]">
              Seguridad
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">
              Cambiar contraseña
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Escribe tu nueva contraseña (mínimo 8 caracteres).
            </p>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nueva contraseña"
              autoComplete="new-password"
              className="mt-5 w-full rounded-lg border border-[#d6ad4a]/30 bg-black px-4 py-3 text-white outline-none focus:border-[#d6ad4a]"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar contraseña"
              autoComplete="new-password"
              className="mt-3 w-full rounded-lg border border-[#d6ad4a]/30 bg-black px-4 py-3 text-white outline-none focus:border-[#d6ad4a]"
            />

            {passwordMessage ? (
              <p
                className={`mt-4 text-sm ${
                  passwordMessage.type === "ok"
                    ? "text-[#d6ad4a]"
                    : "text-red-300"
                }`}
              >
                {passwordMessage.text}
              </p>
            ) : null}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setPasswordModalOpen(false)}
                className="flex-1 rounded-lg border border-[#d6ad4a]/40 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#d6ad4a] transition hover:bg-[#d6ad4a]/10"
              >
                Cerrar
              </button>
              <button
                type="submit"
                disabled={passwordSaving}
                className="flex-1 rounded-lg bg-[#d6ad4a] px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-black transition hover:bg-white disabled:opacity-60"
              >
                {passwordSaving ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {passwordPromptOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-4 backdrop-blur-sm sm:items-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (ownerPasswordInput === OWNER_PASSWORD) {
                setIsOwnerUnlocked(true);
                setPasswordPromptOpen(false);
                setActiveTab("analitica");
                setOwnerPasswordError("");
              } else {
                setOwnerPasswordError("Contraseña incorrecta. Inténtalo de nuevo.");
              }
            }}
            className="w-full max-w-sm rounded-2xl border border-[#d6ad4a]/30 bg-[#070707] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.6)]"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d6ad4a]">
              Acceso Restringido
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">
              Área de Propietario
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Ingresa la contraseña del dueño para ver las analíticas financieras.
            </p>

            <input
              type="password"
              value={ownerPasswordInput}
              onChange={(e) => setOwnerPasswordInput(e.target.value)}
              placeholder="Contraseña del dueño"
              autoFocus
              className="mt-5 w-full rounded-lg border border-[#d6ad4a]/30 bg-black px-4 py-3 text-white outline-none focus:border-[#d6ad4a]"
            />

            {ownerPasswordError ? (
              <p className="mt-3 text-xs text-red-400">
                {ownerPasswordError}
              </p>
            ) : null}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setPasswordPromptOpen(false);
                  setOwnerPasswordInput("");
                  setOwnerPasswordError("");
                }}
                className="flex-1 rounded-lg border border-[#d6ad4a]/40 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#d6ad4a] transition hover:bg-[#d6ad4a]/10"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-[#d6ad4a] px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-black transition hover:bg-white"
              >
                Acceder
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </main>
  );
}
