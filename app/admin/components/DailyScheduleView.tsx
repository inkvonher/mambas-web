import React, { DragEvent, useMemo } from "react";
import {
  type Appointment,
  formatDate,
  formatTime,
  scheduleHours,
  appointmentHour,
  formatHourLabel,
  appointmentCategoryClasses,
} from "../types";
import {
  Panel,
  AppointmentStatusBadge,
  GoogleCalendarSyncIndicator,
} from "./Badges";

export function DailyAppointmentBlock({
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
      className={`absolute top-0 min-h-[66px] rounded-lg border p-3 text-left shadow-[0_14px_36px_rgba(0,0,0,0.26)] transition hover:-translate-y-0.5 z-10 ${appointmentCategoryClasses(
        appointment.category,
      )}`}
      style={{ left, width }}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-black uppercase text-white">
              {formatTime(appointment.appointment_time)}
            </p>
            <GoogleCalendarSyncIndicator appointment={appointment} />
          </div>
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

export function DailyAppointmentMobileCard({
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
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-black text-white">
            {formatTime(appointment.appointment_time)}
          </p>
          <GoogleCalendarSyncIndicator appointment={appointment} />
        </div>
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

export default function DailyScheduleView({
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
            Día operativo
          </p>
          <h2 className="mt-2 text-2xl font-black uppercase text-white">
            {formatDate(date)}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Timeline de 9:00 AM a 10:00 PM. Arrastra una cita para cambiar hora.
          </p>
        </div>
        <div className="rounded-lg border border-[#d6ad4a]/15 bg-black/40 px-4 py-3 text-sm text-zinc-300">
          Citas programadas: <strong className="text-white">{appointments.length}</strong>
        </div>
      </div>

      {/* Desktop Schedule view */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-[100px_1fr] border-b border-zinc-800 bg-[#0c0c0c] p-4 text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
          <div>Hora</div>
          <div>Citas programadas (Haz doble clic en una hora para agendar)</div>
        </div>
        <div className="divide-y divide-zinc-800 border-b border-zinc-800">
          {scheduleHours.map((hour) => {
            const hourAppointments = appointmentsByHour[hour] || [];
            return (
              <div
                key={hour}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, hour)}
                onDoubleClick={() => onCreate(date, hour)}
                className="grid min-h-[66px] grid-cols-[100px_1fr] items-stretch transition hover:bg-zinc-900/30"
              >
                <div className="flex items-center px-4 text-xs font-black uppercase text-zinc-500">
                  {formatHourLabel(hour)}
                </div>
                <div className="relative p-1">
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
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Schedule view */}
      <div className="space-y-4 lg:hidden">
        {scheduleHours.map((hour) => {
          const hourAppointments = appointmentsByHour[hour] || [];
          return (
            <div key={hour} className="rounded-lg border border-zinc-800 bg-[#0c0c0c]/40 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.12em] text-[#d6ad4a]">
                  {formatHourLabel(hour)}
                </span>
                <button
                  onClick={() => onCreate(date, hour)}
                  className="rounded border border-[#d6ad4a]/30 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#d6ad4a]"
                >
                  + Agregar
                </button>
              </div>
              {hourAppointments.length === 0 ? (
                <p className="text-xs italic text-zinc-600 py-1">Sin citas</p>
              ) : (
                <div className="space-y-2">
                  {hourAppointments.map((appointment) => (
                    <DailyAppointmentMobileCard
                      key={appointment.id}
                      appointment={appointment}
                      onEdit={onEdit}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
