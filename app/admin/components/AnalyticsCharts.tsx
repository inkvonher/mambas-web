import React from "react";
import { type AppointmentStatus } from "../types";
import { AppointmentStatusBadge } from "./Badges";

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-[#d6ad4a]/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(214,173,74,0.035)),#080808] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.38),0_0_44px_rgba(214,173,74,0.08)] transition duration-200 hover:-translate-y-1 hover:border-[#f3d27a]/60 hover:shadow-[0_28px_76px_rgba(0,0,0,0.48),0_0_54px_rgba(214,173,74,0.14)]">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-black text-[#d6ad4a] xl:text-4xl">
        {value}
      </p>
    </article>
  );
}

export function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#d6ad4a]/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(214,173,74,0.035)),rgba(0,0,0,0.45)] p-3 shadow-[0_14px_34px_rgba(0,0,0,0.28)]">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-black text-[#d6ad4a]">{value}</p>
    </div>
  );
}

export function RevenueBarChart({
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
                className="w-full rounded-md bg-gradient-to-t from-[#8a6a1e] via-[#d6ad4a] to-[#f7dda0] shadow-[0_0_30px_rgba(214,173,74,0.22)] transition duration-300 hover:brightness-125"
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

export function ComparisonChart({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: number }>;
}) {
  const maxValue = Math.max(...rows.map((row) => row.value), 1);

  return (
    <div className="rounded-xl border border-[#d6ad4a]/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(214,173,74,0.025)),rgba(0,0,0,0.35)] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.25)]">
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
                className="h-full rounded-full bg-gradient-to-r from-[#8a6a1e] via-[#d6ad4a] to-[#f3d27a] shadow-[0_0_18px_rgba(214,173,74,0.2)] transition-all duration-300"
                style={{ width: `${Math.max((row.value / maxValue) * 100, 3)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatusDistribution({
  stats,
}: {
  stats: Array<{ status: AppointmentStatus; count: number; percentage: number }>;
}) {
  return (
    <div className="rounded-xl border border-[#d6ad4a]/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(214,173,74,0.025)),rgba(0,0,0,0.35)] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.25)]">
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
                className="h-full rounded-full bg-gradient-to-r from-[#8a6a1e] via-[#d6ad4a] to-[#f3d27a] shadow-[0_0_18px_rgba(214,173,74,0.2)]"
                style={{ width: `${Math.max(item.percentage, item.count ? 4 : 0)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
