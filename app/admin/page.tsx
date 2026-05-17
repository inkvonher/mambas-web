import { type ReactNode } from "react";

const sidebarItems = [
  "Dashboard",
  "Clientes",
  "Reservas",
  "Anticipos",
  "Lealtad",
  "Galería",
  "Ajustes",
];

const stats = [
  { label: "Clientes registrados", value: "128", accent: "+12%" },
  { label: "Reservas pendientes", value: "14", accent: "-8%" },
  { label: "Anticipos recibidos", value: "$4,320", accent: "+26%" },
  { label: "Miembros Gold", value: "42", accent: "+5%" },
  { label: "Mensajes pendientes", value: "7", accent: "-2%" },
];

const clients = [
  {
    name: "Valentina R.",
    service: "Tattoo Blackwork",
    whatsapp: "+52 998 123 4567",
    status: "Confirmado",
    date: "16 May 2026",
  },
  {
    name: "Mateo G.",
    service: "Corte clásico",
    whatsapp: "+52 998 765 4321",
    status: "Pendiente",
    date: "18 May 2026",
  },
  {
    name: "Sofía L.",
    service: "Piercing",
    whatsapp: "+52 998 234 5678",
    status: "En revisión",
    date: "20 May 2026",
  },
  {
    name: "Diego M.",
    service: "Tattoo Tradicional",
    whatsapp: "+52 998 876 5432",
    status: "Confirmado",
    date: "22 May 2026",
  },
];

const deposits = [
  {
    client: "Valentina R.",
    method: "Mercado Pago",
    amount: "$120",
    status: "Completado",
    date: "16 May 2026",
  },
  {
    client: "Mateo G.",
    method: "USDT Base",
    amount: "$80",
    status: "Pendiente",
    date: "18 May 2026",
  },
  {
    client: "Sofía L.",
    method: "Binance Pay",
    amount: "$60",
    status: "Completado",
    date: "20 May 2026",
  },
  {
    client: "Diego M.",
    method: "Tarjeta",
    amount: "$140",
    status: "Confirmado",
    date: "22 May 2026",
  },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#050505] pb-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 pt-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="rounded-[2rem] border border-[#d6ad4a]/20 bg-[#070707]/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d6ad4a]/10 text-2xl text-[#d6ad4a]">
              M
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#d6ad4a]">
                Admin
              </p>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">
                Mambas
              </h2>
            </div>
          </div>
          <nav aria-label="Admin sections" className="space-y-2">
            {sidebarItems.map((item, index) => (
              <button
                key={item}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  index === 0
                    ? "border-[#d6ad4a] bg-[#d6ad4a]/10 text-white shadow-[0_10px_30px_rgba(214,173,74,0.2)]"
                    : "border-transparent text-zinc-300 hover:border-[#d6ad4a]/50 hover:text-white"
                }`}
              >
                <span>{item}</span>
                {index === 0 ? (
                  <span className="text-xs text-[#d6ad4a]">activo</span>
                ) : null}
              </button>
            ))}
          </nav>
        </aside>

        <section className="space-y-6">
          <header className="rounded-[2rem] border border-[#d6ad4a]/20 bg-[#070707]/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-[#d6ad4a]">
                  Panel administrativo
                </p>
                <h1 className="mt-3 text-3xl font-black tracking-tight text-white">
                  Dashboard
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                  Vista general de clientes, reservas, anticipos y membresías.
                </p>
              </div>
              <div className="rounded-3xl border border-[#d6ad4a]/10 bg-black/60 px-4 py-3 text-sm text-zinc-300 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                Actualizado hace 2 minutos
              </div>
            </div>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((item) => (
              <article
                key={item.label}
                className="rounded-[2rem] border border-[#d6ad4a]/20 bg-[#070707]/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(214,173,74,0.16)]"
              >
                <p className="text-sm uppercase tracking-[0.28em] text-[#d6ad4a]">
                  {item.label}
                </p>
                <div className="mt-4 flex items-end gap-4">
                  <p className="text-3xl font-black text-white">{item.value}</p>
                  <span className="text-sm text-zinc-400">{item.accent}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-[2rem] border border-[#d6ad4a]/20 bg-[#070707]/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-[#d6ad4a]">
                    Clientes
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">
                    Clientes registrados
                  </h2>
                </div>
                <button className="rounded-full border border-[#d6ad4a]/20 bg-[#d6ad4a]/10 px-4 py-2 text-sm font-semibold text-[#d6ad4a] transition hover:bg-[#d6ad4a]/20">
                  Ver todo
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-3 text-sm text-zinc-300">
                  <caption className="sr-only">Tabla de clientes</caption>
                  <thead className="text-left text-xs uppercase tracking-[0.3em] text-zinc-500">
                    <tr>
                      <th className="pb-3">Nombre</th>
                      <th className="pb-3">Servicio</th>
                      <th className="pb-3">WhatsApp</th>
                      <th className="pb-3">Estado</th>
                      <th className="pb-3">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr
                        key={client.name}
                        className="rounded-3xl border border-[#d6ad4a]/10 bg-[#000000]/60"
                      >
                        <td className="px-4 py-4 text-white">{client.name}</td>
                        <td className="px-4 py-4">{client.service}</td>
                        <td className="px-4 py-4">{client.whatsapp}</td>
                        <td className="px-4 py-4 text-[#d6ad4a]">
                          {client.status}
                        </td>
                        <td className="px-4 py-4">{client.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="rounded-[2rem] border border-[#d6ad4a]/20 bg-[#070707]/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-[#d6ad4a]">
                    Anticipos
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">
                    Anticipos recientes
                  </h2>
                </div>
                <button className="rounded-full border border-[#d6ad4a]/20 bg-[#d6ad4a]/10 px-4 py-2 text-sm font-semibold text-[#d6ad4a] transition hover:bg-[#d6ad4a]/20">
                  Exportar
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-3 text-sm text-zinc-300">
                  <caption className="sr-only">Tabla de anticipos</caption>
                  <thead className="text-left text-xs uppercase tracking-[0.3em] text-zinc-500">
                    <tr>
                      <th className="pb-3">Cliente</th>
                      <th className="pb-3">Método</th>
                      <th className="pb-3">Monto</th>
                      <th className="pb-3">Estado</th>
                      <th className="pb-3">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deposits.map((deposit) => (
                      <tr
                        key={deposit.client}
                        className="rounded-3xl border border-[#d6ad4a]/10 bg-[#000000]/60"
                      >
                        <td className="px-4 py-4 text-white">
                          {deposit.client}
                        </td>
                        <td className="px-4 py-4">{deposit.method}</td>
                        <td className="px-4 py-4">{deposit.amount}</td>
                        <td className="px-4 py-4 text-[#d6ad4a]">
                          {deposit.status}
                        </td>
                        <td className="px-4 py-4">{deposit.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
