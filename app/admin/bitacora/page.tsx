"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// SCRIPT_URL de Google Apps Script. 
// REEMPLAZAR CON TU URL DE IMPLEMENTACIÓN DE GOOGLE APPS SCRIPT
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRmqcIxfVpta89UlgPPN91qQse8-crJ-_Gvugdf9-1ithLE88ey0XOxzAnoFlhel0/exec"; 

export default function BitacoraPage() {
  const [fechaServicio, setFechaServicio] = useState("");
  const [tipoServicio, setTipoServicio] = useState("");
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteEdad, setClienteEdad] = useState("");
  const [artistaNombre, setArtistaNombre] = useState("");
  const [loteAgujas, setLoteAgujas] = useState("");
  const [loteTintas, setLoteTintas] = useState("");

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fecha por defecto al cargar (hoy)
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFechaServicio(today);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowSuccess(false);

    const dataObject = {
      form_type: "bitacora",
      fecha_servicio: fechaServicio,
      tipo_servicio: tipoServicio,
      cliente_nombre: clienteNombre,
      cliente_edad: clienteEdad,
      artista_nombre: artistaNombre,
      lote_agujas: loteAgujas,
      lote_tintas: loteTintas,
    };

    try {
      // Mandamos en no-cors
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(dataObject),
      });

      // Asumimos éxito
      setTimeout(() => {
        setLoading(false);
        setShowSuccess(true);

        // Limpiar formulario parcialmente para el siguiente cliente
        setClienteNombre("");
        setClienteEdad("");
        setLoteAgujas("");
        setLoteTintas("");

        window.scrollTo({ top: 0, behavior: "smooth" });

        // Ocultar banner de éxito en 6 segundos
        setTimeout(() => {
          setShowSuccess(false);
        }, 6000);
      }, 1200);

    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Error al intentar registrar los datos en Google Sheets. Verifique su red.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-4 font-sans antialiased">
      <div className="max-w-[600px] mx-auto bg-[#0A0A0A] rounded-2xl overflow-hidden shadow-2xl border border-[#d6ad4a]/20">
        
        {/* Header */}
        <div className="bg-[#050505] py-7 text-center border-b-[3px] border-[#d6ad4a]">
          <h1 className="font-serif text-[#d6ad4a] text-xl sm:text-2xl tracking-[3px] uppercase font-bold mb-1">
            Mambas Tattoo
          </h1>
          <p className="text-white/70 text-xs sm:text-sm font-light tracking-[1px] uppercase">
            Bitácora Sanitaria Digital (COFEPRIS)
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          
          {/* Admin Navigation */}
          <div className="flex justify-between items-center mb-8 text-xs sm:text-sm font-medium">
            <Link 
              href="/admin/bitacora/reporte"
              className="text-[#d6ad4a] hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              Ver Reporte/Libro Completo
            </Link>
            <Link 
              href="/clientes/tatuaje" 
              target="_blank"
              className="text-[#d6ad4a]/80 hover:text-white transition-colors"
            >
              Abrir Cuestionario Cliente →
            </Link>
          </div>

          {/* Success Banner */}
          {showSuccess && (
            <div className="bg-[#2C6E49]/10 border border-[#2C6E49] text-[#2C6E49] p-4 rounded-lg mb-6 text-center font-semibold text-sm animate-fadeIn">
              ¡Servicio registrado con éxito en la Bitácora Sanitaria!
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <h2 className="font-serif text-[#d6ad4a] text-lg font-semibold border-b border-[#d6ad4a]/15 pb-2 mb-6 uppercase tracking-wider">
              Registro de Servicio
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              
              {/* Fecha Servicio */}
              <div className="flex flex-col">
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                  Fecha del Servicio
                </label>
                <input 
                  type="date" 
                  value={fechaServicio}
                  onChange={(e) => setFechaServicio(e.target.value)}
                  className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-base focus:outline-none focus:border-[#d6ad4a] focus:ring-2 focus:ring-[#d6ad4a]/10 transition-all"
                  required 
                />
              </div>

              {/* Tipo Servicio */}
              <div className="flex flex-col">
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                  Tipo de Servicio
                </label>
                <select 
                  value={tipoServicio}
                  onChange={(e) => setTipoServicio(e.target.value)}
                  className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-base focus:outline-none focus:border-[#d6ad4a] transition-all"
                  required
                >
                  <option value="" className="bg-[#0A0A0A]">Seleccione...</option>
                  <option value="Tatuaje" className="bg-[#0A0A0A]">Tatuaje</option>
                  <option value="Perforación" className="bg-[#0A0A0A]">Perforación</option>
                  <option value="Micropigmentación" className="bg-[#0A0A0A]">Micropigmentación</option>
                </select>
              </div>

              {/* Nombre Cliente */}
              <div className="flex flex-col sm:col-span-2">
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                  Nombre del Cliente
                </label>
                <input 
                  type="text" 
                  value={clienteNombre}
                  onChange={(e) => setClienteNombre(e.target.value)}
                  className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-base focus:outline-none focus:border-[#d6ad4a] transition-all"
                  placeholder="Nombre completo" 
                  required 
                />
              </div>

              {/* Edad Cliente */}
              <div className="flex flex-col">
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                  Edad del Cliente
                </label>
                <input 
                  type="number" 
                  value={clienteEdad}
                  onChange={(e) => setClienteEdad(e.target.value)}
                  className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-base focus:outline-none focus:border-[#d6ad4a] transition-all"
                  min="1" 
                  max="120" 
                  required 
                />
              </div>

              {/* Nombre Artista */}
              <div className="flex flex-col">
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                  Nombre del Artista
                </label>
                <input 
                  type="text" 
                  value={artistaNombre}
                  onChange={(e) => setArtistaNombre(e.target.value)}
                  className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-base focus:outline-none focus:border-[#d6ad4a] transition-all"
                  placeholder="Tatuador / Perforador" 
                  required 
                />
              </div>

              {/* Lote Agujas */}
              <div className="flex flex-col sm:col-span-2">
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                  Lote de Agujas / Cartuchos
                </label>
                <input 
                  type="text" 
                  value={loteAgujas}
                  onChange={(e) => setLoteAgujas(e.target.value)}
                  className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-base focus:outline-none focus:border-[#d6ad4a] transition-all"
                  placeholder="Ej. L-38492026-X" 
                  required 
                />
                <span className="text-[10px] text-white/50 mt-1">
                  Especifica el número de lote impreso en el empaque esterilizado individual.
                </span>
              </div>

              {/* Lote Tintas */}
              <div className="flex flex-col sm:col-span-2">
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                  Marca y Lote de Tintas / Joyería
                </label>
                <input 
                  type="text" 
                  value={loteTintas}
                  onChange={(e) => setLoteTintas(e.target.value)}
                  className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-base focus:outline-none focus:border-[#d6ad4a] transition-all"
                  placeholder="Ej. Dynamic Black - Lote #938292" 
                  required 
                />
                <span className="text-[10px] text-white/50 mt-1">
                  Especificar marca y número de lote de los pigmentos o pieza de joyería esterilizada.
                </span>
              </div>

            </div>

            <button 
              type="submit" 
              className="w-full py-4 bg-gradient-to-r from-[#d6ad4a] to-[#a6803b] text-black font-extrabold text-base rounded-xl cursor-pointer hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[#d6ad4a]/15 active:translate-y-0 tracking-[1.5px] uppercase transition-all"
            >
              Registrar en Bitácora
            </button>
          </form>

        </div>
      </div>

      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-[#050505]/85 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center text-white">
          <div className="w-12 h-12 border-4 border-white/20 border-t-[#d6ad4a] rounded-full animate-spin mb-5"></div>
          <h3 className="text-lg font-medium tracking-wide">Enviando datos al registro de sanidad...</h3>
        </div>
      )}
    </div>
  );
}
