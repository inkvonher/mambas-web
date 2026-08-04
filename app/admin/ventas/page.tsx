"use client";

import { useState } from "react";
import Link from "next/link";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRmqcIxfVpta89UlgPPN91qQse8-crJ-_Gvugdf9-1ithLE88ey0XOxzAnoFlhel0/exec";

export default function RegisterSalePage() {
  const [fecha, setFecha] = useState(() => new Date().toISOString().split("T")[0]);
  const [trabajo, setTrabajo] = useState("TATTOO");
  const [artista, setArtista] = useState("VONY");
  const [total, setTotal] = useState("");
  const [tip, setTip] = useState("");
  const [porcentaje, setPorcentaje] = useState("0.50");
  const [nombreCliente, setNombreCliente] = useState("");
  const [contactoCliente, setContactoCliente] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const totalVal = parseFloat(total) || 0;
    const tipVal = parseFloat(tip) || 0;
    const percentageVal = parseFloat(porcentaje) || 0.50;

    const comision_artista = totalVal * (1 - percentageVal);
    const neto_estudio = totalVal * percentageVal;

    // Convert YYYY-MM-DD to DD/MM/YYYY
    const dateParts = fecha.split("-");
    const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    const diaNum = parseInt(dateParts[2]) || 1;

    const payload = {
      fecha_registro: formattedDate,
      dia: diaNum,
      trabajo: trabajo.trim().toUpperCase(),
      artista: artista.trim().toUpperCase(),
      total: totalVal,
      tip: tipVal,
      porcentaje: percentageVal,
      nombre_cliente: nombreCliente.trim(),
      contacto_cliente: contactoCliente.trim(),
      comision_artista,
      neto_estudio,
      form_type: "ventas",
    };

    try {
      setSubmitting(true);
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (resData.status === "success") {
        alert("¡Venta registrada con éxito en Google Sheets!");
        // Reset form inputs (excluding date/artist defaults)
        setTotal("");
        setTip("");
        setNombreCliente("");
        setContactoCliente("");
      } else {
        alert("Error al guardar: " + resData.message);
      }
    } catch (err) {
      console.error("Error saving sale:", err);
      alert("Error de conexión. Asegúrate de que el Apps Script esté correctamente implementado.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalVal = parseFloat(total) || 0;
  const percentageVal = parseFloat(porcentaje) || 0.5;
  const calculatedComision = totalVal * (1 - percentageVal);
  const calculatedNeto = totalVal * percentageVal;

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-4 font-sans antialiased flex flex-col items-center justify-center">
      
      {/* Back Button */}
      <div className="w-full max-w-[550px] mb-6 flex justify-start">
        <Link 
          href="/admin" 
          className="text-xs uppercase tracking-wider font-bold text-[#d6ad4a] hover:text-white transition-colors flex items-center gap-1.5"
        >
          ← Volver al Panel
        </Link>
      </div>

      {/* Main card */}
      <div className="w-full max-w-[550px] bg-[#0A0A0A] border border-[#d6ad4a]/20 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-[#050505] py-6 px-4 text-center border-b border-[#d6ad4a]/15 flex flex-col items-center justify-center">
          <img 
            src="/logo.png" 
            alt="Mambas Tattoo Logo" 
            className="h-14 w-auto mb-2 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h2 className="font-serif text-[#d6ad4a] text-lg font-bold uppercase tracking-wider">
            Registrar Nueva Venta
          </h2>
          <p className="text-zinc-500 text-xs mt-1">
            Ingresa el servicio para calcular comisiones y reportarlo a Google Sheets.
          </p>
        </div>

        {/* Form */}
        <form className="p-6 sm:p-8 flex flex-col gap-5" onSubmit={handleSubmit}>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Fecha */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                Fecha
              </label>
              <input 
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-[#d6ad4a] transition-all"
                required
              />
            </div>

            {/* Servicio */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                Servicio
              </label>
              <select
                value={trabajo}
                onChange={(e) => setTrabajo(e.target.value)}
                className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-[#d6ad4a] transition-all"
              >
                <option value="TATTOO">TATTOO</option>
                <option value="PIERCING">PIERCING</option>
                <option value="JOYERÍA">JOYERÍA</option>
                <option value="INSUMOS">INSUMOS</option>
                <option value="OTROS">OTROS</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Artista */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                Artista
              </label>
              <select
                value={artista}
                onChange={(e) => setArtista(e.target.value)}
                className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-[#d6ad4a] transition-all"
              >
                <option value="VONY">VONY</option>
                <option value="KAREN">KAREN</option>
                <option value="DAVID">DAVID</option>
                <option value="STAFF">STAFF</option>
                <option value="INVITADO">INVITADO</option>
              </select>
            </div>

            {/* Comisión Estudio */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                Comisión Estudio
              </label>
              <select
                value={porcentaje}
                onChange={(e) => setPorcentaje(e.target.value)}
                className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-[#d6ad4a] transition-all"
              >
                <option value="0.50">50% / 50% (0.50)</option>
                <option value="0.45">45% / 55% (0.45)</option>
                <option value="0.40">40% / 60% (0.40)</option>
                <option value="0.30">30% / 70% (0.30)</option>
                <option value="1.00">100% Estudio (1.00)</option>
                <option value="0.00">100% Artista (0.00)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Precio Cobrado */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                Precio Cobrado ($)
              </label>
              <input 
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                placeholder="Ej. 1500"
                className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-[#d6ad4a] transition-all"
                required
                min="0"
              />
            </div>

            {/* Propina */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                Propina ($)
              </label>
              <input 
                type="number"
                value={tip}
                onChange={(e) => setTip(e.target.value)}
                placeholder="Propina (opcional)"
                className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-[#d6ad4a] transition-all"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Cliente */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                Cliente
              </label>
              <input 
                type="text"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                placeholder="Nombre cliente"
                className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-[#d6ad4a] transition-all"
              />
            </div>

            {/* Contacto */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                Contacto
              </label>
              <input 
                type="text"
                value={contactoCliente}
                onChange={(e) => setContactoCliente(e.target.value)}
                placeholder="Teléfono"
                className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-[#d6ad4a] transition-all"
              />
            </div>
          </div>

          {/* Desglose rápido */}
          {totalVal > 0 && (
            <div className="bg-[#050505] border border-[#d6ad4a]/15 rounded-xl p-4 flex flex-col gap-2">
              <div className="text-[10px] uppercase tracking-wider font-bold text-white/50 border-b border-white/5 pb-1 mb-1">
                Desglose Estimado:
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-white/70">Comisión Artista ({(1 - percentageVal) * 100}%):</span>
                <span className="font-semibold text-white">${calculatedComision.toFixed(2)} MXN</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-white/70">Neto Estudio ({percentageVal * 100}%):</span>
                <span className="font-semibold text-[#d6ad4a]">${calculatedNeto.toFixed(2)} MXN</span>
              </div>
              {parseFloat(tip) > 0 && (
                <div className="flex justify-between text-xs sm:text-sm text-green-400">
                  <span>Propina (100% Artista):</span>
                  <span className="font-semibold">${parseFloat(tip).toFixed(2)} MXN</span>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 mt-2 bg-[#d6ad4a] hover:bg-[#ebd28a] active:scale-[0.98] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
          >
            {submitting ? "Registrando en Sheets..." : "Registrar en Sheets ➔"}
          </button>

        </form>

      </div>

    </div>
  );
}
