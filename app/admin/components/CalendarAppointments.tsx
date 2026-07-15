import React from "react";
import { type Appointment, formatTime } from "../types";
import { calendarStatusClasses } from "./Badges";

export function CalendarAppointmentPill({
  appointment,
  onEdit,
}: {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
}) {
  return (
    <button
      onClick={() => onEdit(appointment)}
      className={`block w-full truncate rounded border px-2 py-0.5 text-left text-[10px] font-black uppercase tracking-[0.08em] shadow-[0_4px_12px_rgba(0,0,0,0.18)] transition hover:brightness-125 ${calendarStatusClasses(
        appointment.status,
      )}`}
    >
      {formatTime(appointment.appointment_time)} {appointment.client_name}
    </button>
  );
}

export function CalendarMobileAppointment({
  appointment,
  onEdit,
}: {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
}) {
  return (
    <button
      onClick={() => onEdit(appointment)}
      className={`w-full rounded border p-2 text-left text-xs ${calendarStatusClasses(
        appointment.status,
      )}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-black">
          {formatTime(appointment.appointment_time)}
        </span>
        <span>{appointment.client_name}</span>
      </div>
    </button>
  );
}
