import React from "react";
import {
  type Appointment,
  formatDate,
  formatTime,
  buildWhatsAppUrl,
  buildWhatsAppMessage,
} from "../types";
import {
  AppointmentStatusBadge,
  GoogleCalendarSyncIndicator,
  InfoItem,
} from "./Badges";

export function WhatsAppAutomationActions({
  appointment,
}: {
  appointment: Appointment;
}) {
  const actions = ([
    { type: "confirm", label: "Confirmación", style: "border-[#d6ad4a]/30 text-[#d6ad4a]" },
    { type: "reminder", label: "Recordatorio", style: "border-sky-400/30 text-sky-400" },
    { type: "deposit", label: "Anticipo", style: "border-emerald-400/30 text-emerald-400" },
    { type: "location", label: "Ubicación", style: "border-purple-400/30 text-purple-400" },
  ] as const).map((action) => ({
    ...action,
    message: buildWhatsAppMessage(action.type, appointment),
  }));

  return (
    <div className="mt-4 border-t border-[#d6ad4a]/10 pt-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 mb-3">
        Acciones WhatsApp
      </p>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {actions.map((action) => (
          <a
            key={action.type}
            href={buildWhatsAppUrl(appointment.client_phone, action.message)}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex min-h-9 items-center justify-center rounded-lg border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] transition hover:bg-white hover:text-black ${action.style}`}
          >
            {action.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function AppointmentCard({
  appointment,
  onEdit,
  onCancel,
  onDelete,
}: {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
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
            <GoogleCalendarSyncIndicator appointment={appointment} />
          </div>
          <a
            href={buildWhatsAppUrl(appointment.client_phone, "")}
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
          label="Categoría"
          value={appointment.category === "tattoo" ? "Tattoo" : "Barber"}
        />
        <InfoItem
          label="Anticipo"
          value={`${Number(appointment.deposit_amount || 0).toLocaleString(
            "es-MX",
          )} MXN`}
        />
        <InfoItem
          label="Precio Total"
          value={
            appointment.total_amount !== undefined && appointment.total_amount !== null
              ? `${Number(appointment.total_amount).toLocaleString("es-MX")} MXN`
              : "-"
          }
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
        {appointment.status !== "cancelled" && (
          <button
            onClick={() => onCancel(appointment)}
            className="min-h-10 rounded-lg border border-amber-400/30 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-amber-200 transition hover:bg-amber-400 hover:text-black"
          >
            Cancelar
          </button>
        )}
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
