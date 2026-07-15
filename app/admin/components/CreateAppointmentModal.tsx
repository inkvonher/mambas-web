import React, { FormEvent, useState } from "react";
import {
  type Client,
  type Appointment,
  type AppointmentCategory,
  type AppointmentStatus,
  type AppointmentFormPayload,
  toDateKey,
  appointmentStatuses,
  statusLabels,
} from "../types";
import { FormLabel } from "./Badges";

export default function CreateAppointmentModal({
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
  const [totalAmount, setTotalAmount] = useState(
    appointment?.total_amount !== undefined && appointment.total_amount !== null
      ? String(appointment.total_amount)
      : ""
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
      total_amount: totalAmount.trim() ? Number(totalAmount) : null,
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
            <FormLabel>Teléfono</FormLabel>
            <input
              value={clientPhone}
              onChange={(event) => setClientPhone(event.target.value)}
              required
              inputMode="tel"
              autoComplete="tel"
              className="admin-field"
              placeholder="+52 984 123 4567"
            />
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Para clientes extranjeros usa el código de país, por ejemplo +1
              305 123 4567.
            </p>
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
            <FormLabel>Categoría</FormLabel>
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

          <label>
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

          <label>
            <FormLabel>Precio Total MXN (Opcional)</FormLabel>
            <input
              value={totalAmount}
              onChange={(event) => setTotalAmount(event.target.value)}
              type="number"
              min="0"
              step="50"
              placeholder="Ej. 1600"
              className="admin-field"
            />
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Registra el costo total final para calcular las analíticas de ingresos reales.
            </p>
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
