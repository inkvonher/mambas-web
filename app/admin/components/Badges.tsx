import React from "react";
import {
  type AppointmentStatus,
  statusLabels,
} from "../types";

export function Panel({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[#d6ad4a]/24 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(214,173,74,0.025)),#080808] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.48),0_0_58px_rgba(214,173,74,0.07)] sm:p-5">
      {children}
    </section>
  );
}

export function ClientStatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex rounded-full border border-[#d6ad4a]/20 bg-[#d6ad4a]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#d6ad4a]">
      {status || "Nuevo"}
    </span>
  );
}

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
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

export function appointmentStatusClasses(status: AppointmentStatus) {
  const styles: Record<AppointmentStatus, string> = {
    pending: "border-yellow-400/25 bg-yellow-400/10 text-yellow-200",
    confirmed: "border-[#d6ad4a]/30 bg-[#d6ad4a]/10 text-[#d6ad4a]",
    completed: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    cancelled: "border-red-400/25 bg-red-400/10 text-red-200",
  };

  return styles[status];
}

export function calendarStatusClasses(status: AppointmentStatus) {
  const styles: Record<AppointmentStatus, string> = {
    pending: "border-yellow-400/15 bg-yellow-400/10 text-yellow-100",
    confirmed: "border-[#d6ad4a]/20 bg-[#d6ad4a]/10 text-[#d6ad4a]",
    completed: "border-emerald-400/15 bg-emerald-400/10 text-emerald-100",
    cancelled: "border-red-400/15 bg-red-400/10 text-red-100",
  };

  return styles[status];
}

export function EmptyState({ title, text }: { title: string; text: string }) {
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

export function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="h-11 w-11 animate-spin rounded-full border-2 border-[#d6ad4a]/20 border-t-[#d6ad4a]" />
      <p className="text-sm uppercase tracking-[0.22em] text-zinc-400">
        {label}
      </p>
    </div>
  );
}

export function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
      {children}
    </span>
  );
}

export function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-zinc-200">{value}</dd>
    </div>
  );
}

export function GoogleCalendarSyncIndicator({
  appointment,
}: {
  appointment: { gcal_event_id?: string | null; source?: string | null };
}) {
  if (appointment.gcal_event_id) {
    return (
      <span
        title="Sincronizado con Google Calendar"
        className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
      >
        <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  if (appointment.source === "admin") {
    return (
      <span
        title="Sincronización pendiente"
        className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
      >
        <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </span>
    );
  }
  return null;
}
