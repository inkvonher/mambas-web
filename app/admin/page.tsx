"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

export default function AdminPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadAdminData() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setClients(data || []);
      }

      setLoading(false);
    }

    loadAdminData();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
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

  const tattooClients = clients.filter((client) =>
    client.service.toLowerCase().includes("tattoo"),
  ).length;

  const barberClients = clients.filter((client) =>
    client.service.toLowerCase().includes("barber"),
  ).length;

  return (
    <main className="min-h-screen bg-[#040404] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,173,74,0.14),transparent_34%),linear-gradient(135deg,rgba(214,173,74,0.05),transparent_42%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-20 -mx-4 mb-6 border-b border-[#d6ad4a]/15 bg-[#040404]/86 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#d6ad4a]">
                Panel privado
              </p>
              <h1 className="mt-2 text-2xl font-black uppercase tracking-normal text-white sm:text-4xl">
                Mambas Admin
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="min-h-11 shrink-0 rounded-lg border border-[#d6ad4a]/70 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#d6ad4a] transition duration-200 hover:-translate-y-0.5 hover:bg-[#d6ad4a] hover:text-black hover:shadow-[0_18px_44px_rgba(214,173,74,0.22)]"
            >
              Salir
            </button>
          </div>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Clientes" value={clients.length.toString()} />
          <StatCard label="Tattoo" value={tattooClients.toString()} />
          <StatCard label="Barberia" value={barberClients.toString()} />
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
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="h-11 w-11 animate-spin rounded-full border-2 border-[#d6ad4a]/20 border-t-[#d6ad4a]" />
              <p className="text-sm uppercase tracking-[0.22em] text-zinc-400">
                Cargando clientes
              </p>
            </div>
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
                          <StatusBadge status={client.status} />
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
                      <StatusBadge status={client.status} />
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                          Servicio
                        </dt>
                        <dd className="mt-1 text-zinc-200">{client.service}</dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                          Registro
                        </dt>
                        <dd className="mt-1 text-zinc-200">
                          {formatDate(client.created_at)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                          Cumpleanos
                        </dt>
                        <dd className="mt-1 text-zinc-200">
                          {formatDate(client.birthday)}
                        </dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-[#d6ad4a]/15 bg-[#080808]/90 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.38)] transition duration-200 hover:-translate-y-1 hover:border-[#d6ad4a]/45">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-500">
        {label}
      </p>
      <p className="mt-3 text-4xl font-black text-[#d6ad4a]">{value}</p>
    </article>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex rounded-full border border-[#d6ad4a]/20 bg-[#d6ad4a]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#d6ad4a]">
      {status || "Nuevo"}
    </span>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex min-h-[320px] items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-[#d6ad4a]/25 bg-[#d6ad4a]/8 text-2xl font-black text-[#d6ad4a]">
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

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
