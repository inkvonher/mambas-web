import React from "react";
import { type Client } from "../types";

export default function ConfirmDeleteClientModal({
  client,
  saving,
  onClose,
  onConfirm,
}: {
  client: Client | null;
  saving: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!client) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-xl border border-red-500/25 bg-[#070707] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.75)]">
        <h2 className="text-2xl font-black uppercase text-white">
          ¿Eliminar cliente?
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Estás a punto de eliminar a{" "}
          <strong className="text-white">{client.name}</strong>. Esta acción
          no se puede deshacer y borrará toda la información relacionada.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="min-h-11 rounded-lg border border-zinc-700 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-zinc-300 transition hover:bg-zinc-800"
          >
            Cancelar
          </button>
          <button
            disabled={saving}
            onClick={onConfirm}
            className="min-h-11 rounded-lg bg-red-600 px-5 py-2 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-red-500 disabled:opacity-50"
          >
            {saving ? "Eliminando..." : "Eliminar de todos modos"}
          </button>
        </div>
      </div>
    </div>
  );
}
