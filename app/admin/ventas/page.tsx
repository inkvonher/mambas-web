"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRmqcIxfVpta89UlgPPN91qQse8-crJ-_Gvugdf9-1ithLE88ey0XOxzAnoFlhel0/exec";

interface Sale {
  id?: number;
  fecha_registro: string;
  dia: number;
  trabajo: string;
  artista: string;
  total: number;
  tip: number;
  porcentaje: number;
  nombre_cliente: string;
  contacto_cliente: string;
  comision_artista: number;
  neto_estudio: number;
}

export default function SalesAdminPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "form">("dashboard");

  // Form State
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [trabajo, setTrabajo] = useState("TATTOO");
  const [artista, setArtista] = useState("VONY");
  const [total, setTotal] = useState("");
  const [tip, setTip] = useState("");
  const [porcentaje, setPorcentaje] = useState("0.50");
  const [nombreCliente, setNombreCliente] = useState("");
  const [contactoCliente, setContactoCliente] = useState("");

  // Filters State
  const [filterArtist, setFilterArtist] = useState("ALL");
  const [filterMonth, setFilterMonth] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${SCRIPT_URL}?sheet=ventas`);
      const data = await response.json();
      if (Array.isArray(data)) {
        // Formatear tipos de datos numéricos que vengan del sheets API
        const formatted: Sale[] = data.map((item: any) => ({
          id: item.id,
          fecha_registro: item.fecha_registro || item.fecha || "",
          dia: parseInt(item.dia) || 1,
          trabajo: String(item.trabajo || "").toUpperCase(),
          artista: String(item.artista || "").toUpperCase(),
          total: parseFloat(item.total) || 0,
          tip: parseFloat(item.tip) || 0,
          porcentaje: parseFloat(item.porcentaje) || 0.50,
          nombre_cliente: item.nombre_cliente || item.cliente || "",
          contacto_cliente: item.contacto_cliente || item.contacto || "",
          comision_artista: parseFloat(item.comision_artista) || 0,
          neto_estudio: parseFloat(item.neto_estudio) || 0,
        }));

        // Sort by date descending (latest first)
        const sorted = formatted.sort((a, b) => {
          const parseDate = (dStr: string) => {
            if (!dStr) return 0;
            const parts = dStr.split("/");
            if (parts.length === 3) {
              return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
            }
            return 0;
          };
          return parseDate(b.fecha_registro) - parseDate(a.fecha_registro);
        });

        setSales(sorted);
      }
    } catch (err) {
      console.error("Error fetching sales:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const totalVal = parseFloat(total) || 0;
    const tipVal = parseFloat(tip) || 0;
    const percentageVal = parseFloat(porcentaje) || 0.50;

    const comision_artista = totalVal * (1 - percentageVal);
    const neto_estudio = totalVal * percentageVal;

    // Convert fecha (YYYY-MM-DD) to (DD/MM/YYYY)
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
        alert("¡Venta registrada con éxito!");
        // Reset form
        setTotal("");
        setTip("");
        setNombreCliente("");
        setContactoCliente("");
        setActiveTab("dashboard");
        // Reload data
        fetchSales();
      } else {
        alert("Error al guardar: " + resData.message);
      }
    } catch (err) {
      console.error("Error saving sale:", err);
      alert("Error de conexión. Asegúrate de haber actualizado el Apps Script.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper parsing helper for calculations
  const totalVal = parseFloat(total) || 0;
  const percentageVal = parseFloat(porcentaje) || 0.5;
  const calculatedComision = totalVal * (1 - percentageVal);
  const calculatedNeto = totalVal * percentageVal;

  // Filter lists
  const filteredSales = sales.filter((item) => {
    // Filter by Artist
    if (filterArtist !== "ALL" && item.artista.toUpperCase() !== filterArtist.toUpperCase()) {
      return false;
    }
    // Filter by Job Type
    if (filterType !== "ALL" && item.trabajo.toUpperCase() !== filterType.toUpperCase()) {
      return false;
    }
    // Filter by Month (Format: DD/MM/YYYY)
    if (filterMonth !== "ALL") {
      const parts = item.fecha_registro.split("/");
      if (parts.length === 3) {
        const m = parseInt(parts[1]).toString(); // '1' matches Enero
        if (m !== filterMonth) return false;
      } else {
        return false;
      }
    }
    return true;
  });

  // Calculate totals
  const totalBruto = filteredSales.reduce((acc, item) => acc + item.total, 0);
  const totalTips = filteredSales.reduce((acc, item) => acc + item.tip, 0);
  const totalComisiones = filteredSales.reduce((acc, item) => acc + item.comision_artista, 0);
  const totalEstudio = filteredSales.reduce((acc, item) => acc + item.neto_estudio, 0);

  // Get unique artists and jobs in dataset
  const uniqueArtists = Array.from(new Set(sales.map((item) => item.artista))).filter(Boolean);
  const uniqueTypes = Array.from(new Set(sales.map((item) => item.trabajo))).filter(Boolean);

  const monthsMap = [
    { label: "Enero", val: "1" },
    { label: "Febrero", val: "2" },
    { label: "Marzo", val: "3" },
    { label: "Abril", val: "4" },
    { label: "Mayo", val: "5" },
    { label: "Junio", val: "6" },
    { label: "Julio", val: "7" },
    { label: "Agosto", val: "8" },
    { label: "Septiembre", val: "9" },
    { label: "Octubre", val: "10" },
    { label: "Noviembre", val: "11" },
    { label: "Diciembre", val: "12" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white py-10 px-4 font-sans antialiased">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#d6ad4a]/15 flex flex-col md:flex-row justify-between md:items-center gap-5 mb-8">
          <div className="flex items-center gap-4">
            <img 
              src="/logo.png" 
              alt="Mambas Tattoo Logo" 
              className="h-16 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <h1 className="font-serif text-[#d6ad4a] text-xl sm:text-2xl font-bold tracking-[2px] uppercase">
                Mambas Tattoo & Cuts
              </h1>
              <p className="text-white/60 text-xs sm:text-sm font-light uppercase tracking-[1px] mt-0.5">
                Bitácora Analítica de Ventas y Comisiones
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link 
              href="/admin"
              className="px-4 py-2 border border-white/20 hover:border-[#d6ad4a] hover:text-[#d6ad4a] text-xs font-bold uppercase rounded-lg transition-all"
            >
              Dashboard
            </Link>
            <button 
              onClick={() => {
                setActiveTab(activeTab === "dashboard" ? "form" : "dashboard");
              }}
              className="px-4 py-2 bg-[#d6ad4a] text-black hover:bg-[#f3d27a] text-xs font-bold uppercase rounded-lg transition-all"
            >
              {activeTab === "dashboard" ? "+ Registrar Venta" : "Ver Dashboard"}
            </button>
          </div>
        </div>

        {activeTab === "form" ? (
          /* REGISTRATION FORM */
          <div className="max-w-[650px] mx-auto bg-[#0A0A0A] border border-[#d6ad4a]/25 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-[#050505] py-5 text-center border-b border-[#d6ad4a]/15">
              <h2 className="font-serif text-[#d6ad4a] text-lg font-bold uppercase tracking-wider">
                Registrar Nueva Venta
              </h2>
            </div>
            
            <form className="p-6 sm:p-8 flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Fecha */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                    Fecha del Trabajo
                  </label>
                  <input 
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-sm focus:outline-none focus:border-[#d6ad4a] transition-all"
                    required
                  />
                </div>

                {/* Tipo de Trabajo */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                    Tipo de Servicio
                  </label>
                  <select
                    value={trabajo}
                    onChange={(e) => setTrabajo(e.target.value)}
                    className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-sm focus:outline-none focus:border-[#d6ad4a] transition-all"
                  >
                    <option value="TATTOO">TATTOO</option>
                    <option value="PIERCING">PIERCING</option>
                    <option value="JOYERÍA">JOYERÍA</option>
                    <option value="INSUMOS">INSUMOS</option>
                    <option value="OTROS">OTROS</option>
                  </select>
                </div>

                {/* Artista */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                    Artista / Colaborador
                  </label>
                  <select
                    value={artista}
                    onChange={(e) => setArtista(e.target.value)}
                    className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-sm focus:outline-none focus:border-[#d6ad4a] transition-all"
                  >
                    <option value="VONY">VONY</option>
                    <option value="KAREN">KAREN</option>
                    <option value="DAVID">DAVID</option>
                    <option value="STAFF">STAFF</option>
                    <option value="INVITADO">INVITADO</option>
                  </select>
                </div>

                {/* Porcentaje Estudio */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                    Porcentaje Estudio (%)
                  </label>
                  <select
                    value={porcentaje}
                    onChange={(e) => setPorcentaje(e.target.value)}
                    className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-sm focus:outline-none focus:border-[#d6ad4a] transition-all"
                  >
                    <option value="0.50">50% Estudio / 50% Artista (0.50)</option>
                    <option value="0.45">45% Estudio / 55% Artista (0.45)</option>
                    <option value="0.40">40% Estudio / 60% Artista (0.40)</option>
                    <option value="0.30">30% Estudio / 70% Artista (0.30)</option>
                    <option value="1.00">100% Estudio / 0% Artista (1.00)</option>
                    <option value="0.00">0% Estudio / 100% Artista (0.00)</option>
                  </select>
                </div>

                {/* Total */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                    Total del Servicio ($ MXN)
                  </label>
                  <input 
                    type="number"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    placeholder="Ej. 2500"
                    className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-sm focus:outline-none focus:border-[#d6ad4a] transition-all"
                    required
                    min="0"
                  />
                </div>

                {/* Propina */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                    Propina ($ MXN)
                  </label>
                  <input 
                    type="number"
                    value={tip}
                    onChange={(e) => setTip(e.target.value)}
                    placeholder="Ej. 200 (opcional)"
                    className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-sm focus:outline-none focus:border-[#d6ad4a] transition-all"
                    min="0"
                  />
                </div>

                {/* Nombre Cliente */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                    Nombre del Cliente
                  </label>
                  <input 
                    type="text"
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                    placeholder="Nombre del cliente (opcional)"
                    className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-sm focus:outline-none focus:border-[#d6ad4a] transition-all"
                  />
                </div>

                {/* Contacto Cliente */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#d6ad4a] mb-1.5">
                    Contacto del Cliente
                  </label>
                  <input 
                    type="text"
                    value={contactoCliente}
                    onChange={(e) => setContactoCliente(e.target.value)}
                    placeholder="Teléfono (opcional)"
                    className="p-3 border border-[#d6ad4a]/20 bg-[#050505] rounded-lg text-white text-sm focus:outline-none focus:border-[#d6ad4a] transition-all"
                  />
                </div>
              </div>

              {/* Live Calculations Visual Block */}
              {totalVal > 0 && (
                <div className="bg-[#050505] border border-[#d6ad4a]/15 rounded-xl p-4 flex flex-col gap-2">
                  <div className="text-xs uppercase tracking-wider font-bold text-white/50 border-b border-white/5 pb-1 mb-1">
                    Desglose Estimado:
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Comisión Artista ({(1 - percentageVal) * 100}%):</span>
                    <span className="font-semibold text-white">${calculatedComision.toFixed(2)} MXN</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Neto para el Estudio ({percentageVal * 100}%):</span>
                    <span className="font-semibold text-[#d6ad4a]">${calculatedNeto.toFixed(2)} MXN</span>
                  </div>
                  {parseFloat(tip) > 0 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span>Propina (100% Artista):</span>
                      <span className="font-semibold">${parseFloat(tip).toFixed(2)} MXN</span>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-[#d6ad4a] to-[#a6803b] text-black font-extrabold text-sm rounded-xl cursor-pointer hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[#d6ad4a]/15 active:translate-y-0 tracking-[1.5px] uppercase transition-all disabled:opacity-50"
              >
                {submitting ? "Guardando en Google Sheets..." : "Registrar en Base de Datos"}
              </button>
            </form>
          </div>
        ) : (
          /* ANALYTICS DASHBOARD */
          <div className="flex flex-col gap-8">
            
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Gross total */}
              <div className="bg-[#0A0A0A] p-5 rounded-2xl border border-white/5 flex flex-col gap-1">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/50">Ingreso Bruto</span>
                <span className="text-xl sm:text-3xl font-bold tracking-tight text-white">${totalBruto.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="text-[9px] text-white/40 mt-1">Suma de cargos base</span>
              </div>

              {/* Studio Net */}
              <div className="bg-[#0A0A0A] p-5 rounded-2xl border border-[#d6ad4a]/25 flex flex-col gap-1 shadow-lg shadow-[#d6ad4a]/5">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#d6ad4a]">Neto Estudio</span>
                <span className="text-xl sm:text-3xl font-bold tracking-tight text-[#d6ad4a]">${totalEstudio.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="text-[9px] text-[#d6ad4a]/60 mt-1">Ganancia neta del estudio</span>
              </div>

              {/* Artist Comission */}
              <div className="bg-[#0A0A0A] p-5 rounded-2xl border border-white/5 flex flex-col gap-1">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/50">Comisión Artistas</span>
                <span className="text-xl sm:text-3xl font-bold tracking-tight text-white">${totalComisiones.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="text-[9px] text-white/40 mt-1">Monto para pago a tatuadores</span>
              </div>

              {/* Tips */}
              <div className="bg-[#0A0A0A] p-5 rounded-2xl border border-white/5 flex flex-col gap-1">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/50">Total Propinas</span>
                <span className="text-xl sm:text-3xl font-bold tracking-tight text-green-400">${totalTips.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="text-[9px] text-white/40 mt-1">100% entregado a artistas</span>
              </div>
            </div>

            {/* Filter Controls Bar */}
            <div className="bg-[#0A0A0A] p-4 rounded-xl border border-white/5 flex flex-wrap gap-4 items-center">
              <span className="text-xs uppercase font-bold text-white/40 tracking-wider">Filtros:</span>
              
              {/* Filter Artist */}
              <div className="flex flex-col gap-1 min-w-[120px]">
                <select
                  value={filterArtist}
                  onChange={(e) => setFilterArtist(e.target.value)}
                  className="p-2 bg-[#050505] border border-white/10 rounded-lg text-xs focus:outline-none focus:border-[#d6ad4a]"
                >
                  <option value="ALL">Todos los Artistas</option>
                  {uniqueArtists.map((artist) => (
                    <option key={artist} value={artist}>{artist}</option>
                  ))}
                </select>
              </div>

              {/* Filter Month */}
              <div className="flex flex-col gap-1 min-w-[120px]">
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="p-2 bg-[#050505] border border-white/10 rounded-lg text-xs focus:outline-none focus:border-[#d6ad4a]"
                >
                  <option value="ALL">Todos los Meses</option>
                  {monthsMap.map((m) => (
                    <option key={m.val} value={m.val}>{m.label}</option>
                  ))}
                </select>
              </div>

              {/* Filter Service Type */}
              <div className="flex flex-col gap-1 min-w-[120px]">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="p-2 bg-[#050505] border border-white/10 rounded-lg text-xs focus:outline-none focus:border-[#d6ad4a]"
                >
                  <option value="ALL">Todos los Servicios</option>
                  {uniqueTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="ml-auto text-xs text-white/40 font-mono">
                Filtrados: {filteredSales.length} transacciones
              </div>
            </div>

            {/* Table Area */}
            <div className="bg-[#0A0A0A] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
              <div className="bg-[#050505] p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#d6ad4a]">
                  Registro Diario de Transacciones
                </h3>
                <button 
                  onClick={fetchSales}
                  className="px-3 py-1 border border-white/10 hover:border-[#d6ad4a] rounded text-[11px] uppercase tracking-wider font-bold transition-all"
                >
                  Recargar
                </button>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="text-center py-20 text-white/50">
                    <div className="w-8 h-8 border-2 border-white/10 border-t-[#d6ad4a] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xs uppercase tracking-wider">Cargando base de datos analítica...</p>
                  </div>
                ) : filteredSales.length === 0 ? (
                  <div className="text-center py-20 text-white/40">
                    <span className="text-3xl block mb-2">📋</span>
                    <p className="text-sm">No se encontraron ventas para los filtros seleccionados.</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#050505] border-b border-white/10 text-white/60 font-bold uppercase">
                        <th className="p-4 w-[10%]">Fecha</th>
                        <th className="p-4 w-[12%]">Trabajo</th>
                        <th className="p-4 w-[12%]">Artista</th>
                        <th className="p-4 w-[12%]">Bruto</th>
                        <th className="p-4 w-[8%]">Tip</th>
                        <th className="p-4 w-[8%]">Estudio %</th>
                        <th className="p-4 w-[15%]">Comisión Artista</th>
                        <th className="p-4 w-[15%]">Neto Estudio</th>
                        <th className="p-4 w-[15%]">Cliente</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredSales.map((sale, idx) => (
                        <tr key={sale.id || idx} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 font-mono font-semibold">{sale.fecha_registro}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              sale.trabajo === "TATTOO" ? "bg-red-500/10 text-red-400" :
                              sale.trabajo === "PIERCING" ? "bg-purple-500/10 text-purple-400" :
                              "bg-zinc-500/10 text-zinc-400"
                            }`}>
                              {sale.trabajo}
                            </span>
                          </td>
                          <td className="p-4 font-bold">{sale.artista}</td>
                          <td className="p-4 font-semibold text-white">${sale.total.toFixed(2)}</td>
                          <td className={`p-4 ${sale.tip > 0 ? "text-green-400 font-semibold" : "text-white/40"}`}>
                            {sale.tip > 0 ? `$${sale.tip.toFixed(2)}` : "-"}
                          </td>
                          <td className="p-4 text-white/50">{(sale.porcentaje * 100).toFixed(0)}%</td>
                          <td className="p-4 font-semibold text-white/80">${sale.comision_artista.toFixed(2)}</td>
                          <td className="p-4 font-bold text-[#d6ad4a]">${sale.neto_estudio.toFixed(2)}</td>
                          <td className="p-4">
                            {sale.nombre_cliente ? (
                              <div>
                                <div className="text-white font-medium">{sale.nombre_cliente}</div>
                                <div className="text-[10px] text-white/40 font-mono">{sale.contacto_cliente}</div>
                              </div>
                            ) : (
                              <span className="text-white/20 italic">No especificado</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
