"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.35em] text-[#d6ad4a]">
              Panel privado
            </p>
            <h1 className="text-4xl font-bold text-[#d6ad4a]">
              MAMBAS ADMIN
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="border border-[#d6ad4a] px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#d6ad4a] transition hover:bg-[#d6ad4a] hover:text-black"
          >
            Cerrar sesion
          </button>
        </div>

        {loading ? (
          <p>Cargando clientes...</p>
        ) : clients.length === 0 ? (
          <div className="rounded-2xl border border-[#d6ad4a]/20 bg-[#050505] p-8 text-zinc-300">
            No hay clientes registrados todavia.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#d6ad4a]/20">
            <table className="w-full text-sm">
              <thead className="bg-[#111]">
                <tr className="border-b border-[#d6ad4a]/20 text-left">
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Telefono</th>
                  <th className="p-4">Cumpleanos</th>
                  <th className="p-4">Servicio</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Registro</th>
                </tr>
              </thead>

              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-[#d6ad4a]/10 hover:bg-[#111]"
                  >
                    <td className="p-4">{client.name}</td>
                    <td className="p-4">{client.phone}</td>
                    <td className="p-4">{client.birthday || "-"}</td>
                    <td className="p-4">{client.service}</td>
                    <td className="p-4">{client.status}</td>
                    <td className="p-4">
                      {new Date(client.created_at).toLocaleDateString("es-MX")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
