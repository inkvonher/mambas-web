"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
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
  client_id: string;
  client_name: string;
  client_phone: string;
  category: AppointmentCategory;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  notes: string | null;
  deposit_amount: number | null;
  created_at: string;
};

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

export default function AdminPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [calendarDate, setCalendarDate] = useState(() => new Date());

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
        setAppointments((appointmentsResult.data || []) as Appointment[]);
      }

      setLoading(false);
    }

    loadAdminData();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  async function handleCreateAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const selectedClient = clients.find(
      (client) => client.id === formData.get("client_id"),
    );

    if (!selectedClient) {
      setErrorMessage("Selecciona un cliente para crear la cita.");
      setSaving(false);
      return;
    }

    const payload = {
      client_id: selectedClient.id,
      client_name: selectedClient.name,
      client_phone: selectedClient.phone,
      category: formData.get("category"),
      appointment_date: formData.get("appointment_date"),
      appointment_time: formData.get("appointment_time"),
      status: formData.get("status"),
      notes: formData.get("notes") || null,
      deposit_amount: Number(formData.get("deposit_amount") || 0),
    };

    const { data, error } = await supabase
      .from("appointments")
      .insert([payload])
      .select("*")
      .single();

    if (error) {
      console.error(error);
      setErrorMessage("No se pudo guardar la cita en Supabase.");
      setSaving(false);
      return;
    }

    setAppointments((current) =>
      [...current, data as Appointment].sort(sortAppointments),
    );
    setModalOpen(false);
    setSaving(false);
    event.currentTarget.reset();
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

    if (!query) {
      return appointments;
    }

    return appointments.filter((appointment) =>
      [
        appointment.client_name,
        appointment.client_phone,
        appointment.category,
        statusLabels[appointment.status],
        appointment.notes || "",
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [appointments, appointmentSearch]);

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
                onClick={() => setModalOpen(true)}
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
                  onClick={() => setCalendarDate(addMonths(calendarDate, -1))}
                  className="calendar-button"
                >
                  Prev
                </button>
                <button
                  onClick={() => setCalendarDate(new Date())}
                  className="calendar-button"
                >
                  Hoy
                </button>
                <button
                  onClick={() => setCalendarDate(addMonths(calendarDate, 1))}
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

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day) => {
                const dayAppointments = appointmentsByDate[day.key] || [];

                return (
                  <div
                    key={day.key}
                    className={`min-h-24 rounded-lg border p-2 transition duration-200 hover:border-[#d6ad4a]/50 ${
                      day.currentMonth
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
                        <div
                          key={appointment.id}
                          className="truncate rounded bg-[#d6ad4a]/10 px-2 py-1 text-[10px] text-[#d6ad4a]"
                        >
                          {formatTime(appointment.appointment_time)}{" "}
                          {appointment.client_name}
                        </div>
                      ))}
                      {dayAppointments.length > 2 ? (
                        <div className="text-[10px] text-zinc-500">
                          +{dayAppointments.length - 2} mas
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel>
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d6ad4a]">
                  Citas
                </p>
                <h2 className="mt-2 text-2xl font-black uppercase text-white">
                  Proximas citas
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="min-h-11 rounded-lg bg-[#d6ad4a] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-black transition duration-200 hover:-translate-y-0.5 hover:bg-white sm:hidden"
              >
                Nueva cita
              </button>
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
                  />
                ))}
              </div>
            )}
          </Panel>
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
          saving={saving}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreateAppointment}
        />
      ) : null}
    </main>
  );
}

function CreateAppointmentModal({
  clients,
  saving,
  onClose,
  onSubmit,
}: {
  clients: Client[];
  saving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const today = toDateKey(new Date());

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-4 backdrop-blur-sm sm:items-center">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#d6ad4a]/25 bg-[#070707] shadow-[0_30px_120px_rgba(0,0,0,0.75)]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#d6ad4a]/15 bg-[#070707]/95 p-5 backdrop-blur">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d6ad4a]">
              Agenda Mambas
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase text-white">
              Nueva cita
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-[#d6ad4a]/30 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#d6ad4a] transition hover:bg-[#d6ad4a] hover:text-black"
          >
            Cerrar
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <FormLabel>Cliente</FormLabel>
            <select name="client_id" required className="admin-field">
              <option value="">Seleccionar cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.phone}
                </option>
              ))}
            </select>
          </label>

          <label>
            <FormLabel>Categoria</FormLabel>
            <select name="category" required className="admin-field">
              <option value="tattoo">Tattoo</option>
              <option value="barber">Barber</option>
            </select>
          </label>

          <label>
            <FormLabel>Estado</FormLabel>
            <select name="status" required className="admin-field">
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
              name="appointment_date"
              type="date"
              min={today}
              required
              className="admin-field"
            />
          </label>

          <label>
            <FormLabel>Hora</FormLabel>
            <input
              name="appointment_time"
              type="time"
              required
              className="admin-field"
            />
          </label>

          <label className="sm:col-span-2">
            <FormLabel>Anticipo MXN</FormLabel>
            <input
              name="deposit_amount"
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
              name="notes"
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
              {saving ? "Guardando..." : "Crear cita"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
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
    </article>
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
  const styles: Record<AppointmentStatus, string> = {
    pending: "border-yellow-400/25 bg-yellow-400/10 text-yellow-200",
    confirmed: "border-[#d6ad4a]/30 bg-[#d6ad4a]/10 text-[#d6ad4a]",
    completed: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    cancelled: "border-red-400/25 bg-red-400/10 text-red-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${styles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
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

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
