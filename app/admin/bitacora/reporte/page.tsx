"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Endpoint de base de datos
const PROXY_URL = "/api/sheets-proxy"; 

interface BitacoraRecord {
  id: number;
  fecha_registro: string;
  fecha_servicio?: string;
  tipo_servicio?: string;
  servicio?: string;
  cliente_nombre?: string;
  nombre?: string;
  cliente_edad?: string;
  edad?: string;
  artista_nombre?: string;
  artista?: string;
  lote_agujas?: string;
  lote_tintas?: string;
}

export default function ReporteBitacoraPage() {
  const [allRecords, setAllRecords] = useState<BitacoraRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<BitacoraRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch(`${PROXY_URL}?sheet=bitacora`);
      if (!response.ok) {
        throw new Error("Error al conectar con la base de datos de Sheets.");
      }
      const data = await response.json();
      setAllRecords(data);
      setFilteredRecords(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setErrorMsg("No se pudo descargar la bitácora. Verifique la conexión o el ID del script.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Aplicar filtros en tiempo real
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = allRecords.filter(record => {
      const cliente = String(record.cliente_nombre || record.nombre || "").toLowerCase();
      const artista = String(record.artista_nombre || record.artista || "").toLowerCase();
      const loteAgujas = String(record.lote_agujas || "").toLowerCase();
      const loteTintas = String(record.lote_tintas || "").toLowerCase();
      const servicio = String(record.tipo_servicio || record.servicio || "").toLowerCase();

      const matchText = 
        cliente.includes(query) || 
        artista.includes(query) || 
        loteAgujas.includes(query) || 
        loteTintas.includes(query);

      let matchService = true;
      if (serviceFilter) {
        matchService = servicio === serviceFilter.toLowerCase();
      }

      return matchText && matchService;
    });

    setFilteredRecords(filtered);
  }, [searchQuery, serviceFilter, allRecords]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const formatDateString = (str: string) => {
    if (!str || str === "--") return "--";
    if (str.includes("-")) {
      const parts = str.split("T")[0].split("-");
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/AAAA
      }
    }
    return str;
  };

  const getServiceBadgeClass = (servicio: string) => {
    const s = String(servicio || "").toLowerCase();
    if (s.includes("perforac") || s.includes("pierc")) {
      return "bg-[#FEF3C7] text-[#B45309] border border-[#B45309]/10";
    }
    if (s.includes("micro")) {
      return "bg-[#F3E8FF] text-[#7E22CE] border border-[#7E22CE]/10";
    }
    return "bg-[#E0F2FE] text-[#0369A1] border border-[#0369A1]/10";
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white py-10 px-4 font-sans antialiased print:bg-white print:p-0 print:text-black">
      
      {/* Estilos para impresión horizontal forzada */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: landscape !important;
            margin: 0.8cm !important;
          }
          body {
            background-color: white !important;
            color: black !important;
            font-size: 8pt !important;
          }
          .no-print {
            display: none !important;
          }
          .print-wrapper {
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-header {
            border-bottom: 2px solid black !important;
            padding-bottom: 10px !important;
            margin-bottom: 15px !important;
            color: black !important;
            background: transparent !important;
          }
          .print-header h1 {
            color: black !important;
            font-size: 15pt !important;
            font-weight: bold !important;
          }
          .print-table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          .print-table th {
            background-color: #E5E7EB !important;
            color: black !important;
            border: 1px solid black !important;
            font-size: 7.5pt !important;
            font-weight: bold !important;
            padding: 5px 8px !important;
          }
          .print-table td {
            border: 1px solid black !important;
            padding: 5px 8px !important;
            font-size: 7.5pt !important;
            color: black !important;
          }
          .print-badge {
            background: transparent !important;
            border: 1px solid black !important;
            color: black !important;
            padding: 1px 4px !important;
            font-size: 7.5pt !important;
            border-radius: 0 !important;
          }
        }
      ` }} />

      <div className="max-w-[1200px] mx-auto bg-[#0A0A0A] rounded-2xl overflow-hidden shadow-2xl border border-[#d6ad4a]/15 print-wrapper">
        
        {/* Header */}
        <div className="bg-[#050505] p-6 sm:p-8 border-b-2 border-[#d6ad4a]/20 flex flex-col sm:flex-row justify-between sm:items-center gap-5 print-header">
          <div className="flex items-center gap-4 text-left">
            <img 
              src="/logo.png" 
              alt="Mambas Tattoo Logo" 
              className="h-14 w-auto object-contain filter grayscale brightness-125"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <h1 className="font-serif text-[#d6ad4a] text-xl sm:text-2xl font-bold tracking-[2px] uppercase">
                Mambas Tattoo & Cuts
              </h1>
              <p className="text-white/70 text-xs sm:text-sm font-light uppercase tracking-[1px] mt-0.5 print:text-gray-600">
                Libro de Registro Diario y Bitácora Sanitaria (COFEPRIS)
              </p>
              <p className="text-[10px] text-white/50 font-mono tracking-wider mt-0.5 print:text-gray-600">
                Tarjeta Sanitaria: 33/TT0467/2024 | Tatuador Karen Muñoz González
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 no-print">
            <button 
              onClick={fetchData}
              className="px-4 py-2 border border-white/20 hover:border-[#d6ad4a] hover:text-[#d6ad4a] text-xs sm:text-sm font-bold uppercase rounded-lg transition-all flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
              </svg>
              Recargar
            </button>
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-[#d6ad4a] text-black hover:bg-[#f3d27a] text-xs sm:text-sm font-bold uppercase rounded-lg transition-all flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Imprimir
            </button>
          </div>
        </div>

        {/* Filters (Hidden on print) */}
        <div className="p-6 border-b border-[#d6ad4a]/10 flex flex-col sm:flex-row gap-4 bg-[#080808] no-print">
          <div className="flex-grow">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 border border-white/10 bg-[#050505] text-white rounded-lg text-sm focus:outline-none focus:border-[#d6ad4a] transition-all"
              placeholder="Buscar por cliente, artista o lote..."
            />
          </div>
          
          <div className="min-w-[180px]">
            <select 
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full p-3 border border-white/10 bg-[#050505] text-white rounded-lg text-sm focus:outline-none focus:border-[#d6ad4a] cursor-pointer"
            >
              <option value="" className="bg-[#0A0A0A]">Todos los servicios</option>
              <option value="Tatuaje" className="bg-[#0A0A0A]">Tatuajes</option>
              <option value="Perforación" className="bg-[#0A0A0A]">Perforaciones</option>
              <option value="Micropigmentación" className="bg-[#0A0A0A]">Micropigmentación</option>
            </select>
          </div>
        </div>

        {/* Table/Data Area */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-16 text-white/60">
              <div className="w-10 h-10 border-4 border-white/10 border-t-[#d6ad4a] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm">Descargando registros oficiales desde Google Sheets...</p>
            </div>
          ) : errorMsg ? (
            <div className="text-center py-16 text-[#9E3E3E] font-medium">
              <p className="mb-2">✕ {errorMsg}</p>
              <button 
                onClick={fetchData}
                className="mt-2 text-xs border border-[#9E3E3E] px-3 py-1 rounded hover:bg-[#9E3E3E]/10"
              >
                Reintentar
              </button>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-16 text-white/50 text-sm">
              No se encontraron registros de servicios sanitarios en esta bitácora.
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-sm print-table">
              <thead>
                <tr className="bg-white/[0.03] text-[#d6ad4a]">
                  <th className="p-4 border-b border-white/10 font-bold uppercase text-xs tracking-wider w-[80px]">Folio</th>
                  <th className="p-4 border-b border-white/10 font-bold uppercase text-xs tracking-wider w-[110px]">Fecha Serv.</th>
                  <th className="p-4 border-b border-white/10 font-bold uppercase text-xs tracking-wider">Cliente</th>
                  <th className="p-4 border-b border-white/10 font-bold uppercase text-xs tracking-wider w-[70px] text-center">Edad</th>
                  <th className="p-4 border-b border-white/10 font-bold uppercase text-xs tracking-wider">Servicio</th>
                  <th className="p-4 border-b border-white/10 font-bold uppercase text-xs tracking-wider">Artista</th>
                  <th className="p-4 border-b border-white/10 font-bold uppercase text-xs tracking-wider">Lote Agujas</th>
                  <th className="p-4 border-b border-white/10 font-bold uppercase text-xs tracking-wider">Lote Tintas / Joyería</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => {
                  const folio = String(record.id || (index + 1)).padStart(4, "0");
                  const fecha = formatDateString(record.fecha_servicio || record.fecha_registro || "--");
                  const cliente = record.cliente_nombre || record.nombre || "--";
                  const edad = record.cliente_edad || record.edad || "--";
                  const servicio = record.tipo_servicio || record.servicio || "--";
                  const artista = record.artista_nombre || record.artista || "--";
                  const loteAgujas = record.lote_agujas || "--";
                  const loteTintas = record.lote_tintas || "--";

                  return (
                    <tr key={record.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                      <td className="p-4 font-mono font-bold text-[#d6ad4a]">{folio}</td>
                      <td className="p-4 font-semibold">{fecha}</td>
                      <td className="p-4">{cliente}</td>
                      <td className="p-4 text-center">{edad}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase print-badge ${getServiceBadgeClass(servicio)}`}>
                          {servicio}
                        </span>
                      </td>
                      <td className="p-4">{artista}</td>
                      <td className="p-4 font-mono text-xs text-white/70 print:text-black">{loteAgujas}</td>
                      <td className="p-4 text-xs text-white/70 print:text-black">{loteTintas}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Inspection Footer */}
        <div className="p-6 bg-white/[0.01] border-t border-white/5 text-[10px] sm:text-xs text-white/50 text-justify leading-relaxed print:hidden">
          <strong>INSPECCIÓN Y ARCHIVO SANITARIO:</strong> Esta bitácora digital constituye el Libro de Registro Oficial exigido por el Reglamento de la Ley General de Salud en materia de control sanitario de establecimientos que realicen tatuajes, micropigmentaciones y perforaciones en México. Cada fila representa un folio único consecutivo. La veracidad de los lotes de agujas, tintas y esterilización es responsabilidad de los artistas prestadores del servicio. Este documento debe conservarse para auditorías sanitarias de COFEPRIS por al menos dos años.
        </div>

      </div>
    </div>
  );
}
