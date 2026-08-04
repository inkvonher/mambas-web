"use client";

import Link from "next/link";

export default function QrFlyerPage() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 px-4 flex flex-col items-center justify-center font-sans antialiased print:bg-white print:p-0">
      
      {/* Control Bar (Hidden on print) */}
      <div className="w-full max-w-[500px] mb-6 flex justify-between items-center bg-[#0D2A22] text-white p-4 rounded-xl shadow-md print:hidden">
        <div>
          <h3 className="text-sm font-bold">Impresión de Cartel</h3>
          <p className="text-xs text-white/70">Colócalo en la recepción de Mambas.</p>
        </div>
        <div className="flex gap-2">
          <Link 
            href="/clientes/tatuaje"
            className="px-3 py-2 border border-white/20 hover:border-white text-xs font-bold uppercase rounded-lg transition-all"
          >
            Volver
          </Link>
          <button 
            onClick={handlePrint}
            className="bg-[#C5A059] text-[#0D2A22] px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#DDC086] transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Imprimir
          </button>
        </div>
      </div>

      {/* Poster Body */}
      <div className="w-full max-w-[500px] aspect-[1/1.414] bg-[#0D2A22] text-white p-8 sm:p-10 border-[5px] border-[#C5A059] rounded-3xl shadow-2xl relative flex flex-col items-center justify-between text-center print:border-none print:shadow-none print:bg-white print:text-black print:p-4 print:w-full print:max-w-none print:h-screen">
        
        {/* Decorative corner borders (Hidden on print) */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#C5A059] rounded-tl-lg print:hidden"></div>
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#C5A059] rounded-tr-lg print:hidden"></div>
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#C5A059] rounded-bl-lg print:hidden"></div>
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#C5A059] rounded-br-lg print:hidden"></div>

        {/* Header Logo */}
        <div className="flex flex-col items-center mt-2">
          <img 
            src="/logo.png" 
            alt="Mambas Tattoo Logo" 
            className="h-20 w-auto mb-3 object-contain filter brightness-110 print:invert-0 print:filter-none"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h1 className="font-serif text-[#C5A059] text-2xl sm:text-3xl tracking-[4px] uppercase font-bold print:text-black">
            Mambas Tattoo
          </h1>
          <div className="h-[2px] w-24 bg-[#C5A059] mt-2 print:bg-black"></div>
        </div>

        {/* Title */}
        <div className="my-4">
          <h2 className="text-white text-lg sm:text-xl font-bold uppercase tracking-wider mb-2 print:text-black">
            Consentimiento Sanitario
          </h2>
          <p className="text-[#FAF7F2]/80 text-xs sm:text-sm font-light max-w-[340px] leading-relaxed mx-auto print:text-gray-700">
            Por regulación oficial de <strong className="font-semibold text-white print:text-black">COFEPRIS</strong>, es obligatorio completar el cuestionario digital antes de realizar tu sesión.
          </p>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-5 rounded-2xl shadow-lg border-2 border-[#C5A059] my-2 print:border-black print:shadow-none">
          <img 
            src="/qr-cuestionario.png" 
            alt="Código QR Cuestionario Mambas" 
            className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
          />
        </div>

        {/* Call to Action */}
        <div className="my-2">
          <span className="text-[#C5A059] text-xs sm:text-sm tracking-[2px] uppercase font-bold print:text-black">
            ➔ ESCANEA EL CÓDIGO QR ➔
          </span>
          <p className="text-white/60 text-[10px] mt-1 print:text-gray-500">
            Apunta con la cámara de tu celular para abrir el formato.
          </p>
        </div>

        {/* Steps */}
        <div className="w-full text-left bg-black/30 p-4 sm:p-5 rounded-xl border border-[#C5A059]/20 flex flex-col gap-2.5 my-2 print:bg-gray-50 print:border-black print:text-black">
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#C5A059] text-[#0D2A22] text-xs font-bold shrink-0 print:bg-black print:text-white">1</span>
            <p className="text-xs text-white/90 leading-tight print:text-black">
              <strong className="text-[#C5A059] font-bold print:text-black">Escanea</strong> el código QR para abrir el formulario interactivo.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#C5A059] text-[#0D2A22] text-xs font-bold shrink-0 print:bg-black print:text-white">2</span>
            <p className="text-xs text-white/90 leading-tight print:text-black">
              <strong className="text-[#C5A059] font-bold print:text-black">Completa</strong> tus datos médicos, responde el cuestionario y firma.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#C5A059] text-[#0D2A22] text-xs font-bold shrink-0 print:bg-black print:text-white">3</span>
            <p className="text-xs text-white/90 leading-tight print:text-black">
              <strong className="text-[#C5A059] font-bold print:text-black">Envía</strong> a recepción por WhatsApp para el archivo reglamentario.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-2 text-[8px] sm:text-[9px] text-[#C5A059]/75 tracking-wider uppercase font-semibold leading-relaxed print:text-gray-500">
          Estudio Autorizado | Reg. Sanitario Responsable: Karen Muñoz González
          <br />
          Tarjeta de Control Sanitario: 33/TT0467/2024
        </div>

      </div>

    </div>
  );
}
