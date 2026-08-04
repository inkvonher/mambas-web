"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRmqcIxfVpta89UlgPPN91qQse8-crJ-_Gvugdf9-1ithLE88ey0XOxzAnoFlhel0/exec";

function PrintPageContent() {
  const searchParams = useSearchParams();

  // Campos Básicos
  const [nombre, setNombre] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [edad, setEdad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [fechaRegistro, setFechaRegistro] = useState("");
  const [detallesMedicos, setDetallesMedicos] = useState("Ninguno especificado.");
  const [firma, setFirma] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Preguntas
  const [questions, setQuestions] = useState({
    hemofilia: "NO",
    diabetes: "NO",
    alergias: "NO",
    cardiacas: "NO",
    epilepsia: "NO",
    afeccion_piel: "NO",
    embarazo: "NO",
    hepatitis_vih: "NO",
    alcohol_drogas: "NO",
  });

  useEffect(() => {
    const id = searchParams.get("id");

    if (id) {
      setLoading(true);
      setErrorMsg("");
      fetch(`${SCRIPT_URL}?sheet=cuestionarios&id=${id}`)
        .then((response) => {
          if (!response.ok) throw new Error("Error de red");
          return response.json();
        })
        .then((data) => {
          setLoading(false);
          if (data && data.status !== "error") {
            setNombre(data.nombre || "");
            setFechaNacimiento(data.fecha_nacimiento || "");
            setEdad(data.edad || "");
            setTelefono(data.telefono || "");
            setCorreo(data.correo || "");
            setIdentificacion(data.identificacion || "");
            setFechaRegistro(data.fecha_registro || "");
            setDetallesMedicos(data.detalles_medicos || "Ninguno especificado.");
            setFirma(data.firma_base64 || "");
            setQuestions({
              hemofilia: data.hemofilia || "NO",
              diabetes: data.diabetes || "NO",
              alergias: data.alergias || "NO",
              cardiacas: data.cardiacas || "NO",
              epilepsia: data.epilepsia || "NO",
              afeccion_piel: data.afeccion_piel || "NO",
              embarazo: data.embarazo || "NO",
              hepatitis_vih: data.hepatitis_vih || "NO",
              alcohol_drogas: data.alcohol_drogas || "NO",
            });
          } else {
            setErrorMsg("No se encontró el cuestionario con el ID especificado.");
          }
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
          setErrorMsg("Error al obtener los datos desde Google Sheets.");
        });
    } else {
      // Fallback: Leer datos directamente desde la URL (comportamiento original)
      setNombre(searchParams.get("nombre") || "");
      setFechaNacimiento(searchParams.get("fecha_nacimiento") || "");
      setEdad(searchParams.get("edad") || "");
      setTelefono(searchParams.get("telefono") || "");
      setCorreo(searchParams.get("correo") || "");
      setIdentificacion(searchParams.get("identificacion") || "");
      
      let fReg = searchParams.get("fecha_registro");
      if (!fReg) {
        const d = new Date();
        const pad = (n: number) => n.toString().padStart(2, "0");
        fReg = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      }
      setFechaRegistro(fReg);

      const detalles = searchParams.get("detalles_medicos");
      if (detalles && detalles.trim() !== "") {
        setDetallesMedicos(detalles);
      }

      setFirma(searchParams.get("firma") || "");

      setQuestions({
        hemofilia: searchParams.get("hemofilia") || "NO",
        diabetes: searchParams.get("diabetes") || "NO",
        alergias: searchParams.get("alergias") || "NO",
        cardiacas: searchParams.get("cardiacas") || "NO",
        epilepsia: searchParams.get("epilepsia") || "NO",
        afeccion_piel: searchParams.get("afeccion_piel") || "NO",
        embarazo: searchParams.get("embarazo") || "NO",
        hepatitis_vih: searchParams.get("hepatitis_vih") || "NO",
        alcohol_drogas: searchParams.get("alcohol_drogas") || "NO",
      });
    }
  }, [searchParams]);

  // Imprimir
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const renderAnswer = (val: string) => {
    const isSi = val.toUpperCase().trim() === "SI" || val.toUpperCase().trim() === "SÍ";
    if (isSi) {
      return (
        <td className="border border-black p-2.5 text-center font-black bg-[#E5E7EB] text-black border-2 border-black print:exact">
          ⚠️ SÍ
        </td>
      );
    }
    return (
      <td className="border border-black p-2.5 text-center font-bold text-gray-900">
        NO
      </td>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black p-0 sm:p-10 font-sans print:bg-white print:p-0">
      
      {/* Control Bar (Hidden on print) */}
      <div className="max-w-[800px] mx-auto mb-5 flex justify-between items-center bg-[#0D2A22] text-white p-4 rounded-xl shadow-md print:hidden">
        <div>
          <h3 className="text-base font-semibold">Formato Digital de Sanidad</h3>
          <p className="text-xs text-white/80">Cuestionario listo para archivar/imprimir física o digitalmente.</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-[#C5A059] text-[#0D2A22] border-none px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#DDC086] transition-all"
        >
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Imprimir Formato
        </button>
      </div>

      {/* Official A4 / Letter sheet */}
      <div className="max-w-[800px] mx-auto bg-white p-8 sm:p-12 border border-gray-300 rounded shadow-sm relative print:border-none print:shadow-none print:p-0 print:m-0">
        
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#0D2A22] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-semibold">Descargando formato desde Google Sheets...</p>
          </div>
        ) : errorMsg ? (
          <div className="text-center py-20 text-red-600">
            <span className="text-4xl mb-4 block">✕</span>
            <p className="text-base font-bold">{errorMsg}</p>
            <p className="text-xs text-gray-500 mt-2">Por favor, verifique el enlace de WhatsApp o use el formato físico.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-5">
              <div className="flex items-center gap-4">
                <img 
                  src="/logo.png" 
                  alt="Mambas Tattoo Logo" 
                  className="h-16 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="text-left">
                  <h1 className="font-serif font-bold text-[18pt] uppercase tracking-wider leading-none mb-1">
                    Mambas Tattoo & Cuts
                  </h1>
                  <p className="text-[8.5pt] text-gray-600">Estudio Profesional de Tatuajes, Perforaciones y Micropigmentación</p>
                  <p className="text-[8.5pt] text-gray-600">Playa del Carmen, Quintana Roo, México</p>
                </div>
              </div>
              <div className="border border-black p-1.5 px-3 text-center font-bold text-[8.5pt] uppercase tracking-wider bg-gray-50">
                Cumplimiento COFEPRIS<br />
                <span className="text-[7pt] font-light normal-case">Regulación Sanitaria</span><br />
                <span className="text-[6.5pt] font-mono block mt-0.5">Tarj: 33/TT0467/2024</span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center text-[13pt] font-extrabold uppercase tracking-wide mb-6 underline">
              CUESTIONARIO DE SALUD Y CONSENTIMIENTO INFORMADO
            </div>

            {/* Client details table */}
            <table className="w-full border-collapse mb-6">
              <tbody>
                <tr>
                  <td className="border border-black p-2 text-[8.5pt] font-bold uppercase bg-gray-100 w-[25%]">Nombre del Cliente:</td>
                  <td className="border border-black p-2 text-[10pt] w-[75%]" colSpan={3}>{nombre}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 text-[8.5pt] font-bold uppercase bg-gray-100 w-[25%]">Fecha de Nacimiento:</td>
                  <td className="border border-black p-2 text-[10pt] w-[25%]">{fechaNacimiento}</td>
                  <td className="border border-black p-2 text-[8.5pt] font-bold uppercase bg-gray-100 w-[25%]">Edad del Cliente:</td>
                  <td className="border border-black p-2 text-[10pt] w-[25%]">{edad ? `${edad} años` : "--"}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 text-[8.5pt] font-bold uppercase bg-gray-100 w-[25%]">Teléfono de Contacto:</td>
                  <td className="border border-black p-2 text-[10pt] w-[25%]">{telefono}</td>
                  <td className="border border-black p-2 text-[8.5pt] font-bold uppercase bg-gray-100 w-[25%]">Correo Electrónico:</td>
                  <td className="border border-black p-2 text-[10pt] w-[25%]">{correo}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 text-[8.5pt] font-bold uppercase bg-gray-100 w-[25%]">Identificación Oficial:</td>
                  <td className="border border-black p-2 text-[10pt] w-[75%]" colSpan={3}>{identificacion}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 text-[8.5pt] font-bold uppercase bg-gray-100 w-[25%]">Fecha de Registro:</td>
                  <td className="border border-black p-2 text-[10pt] w-[75%]" colSpan={3}>{fechaRegistro}</td>
                </tr>
              </tbody>
            </table>

            {/* Medical Questionnaire Table */}
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-black p-2 text-[9pt] font-bold uppercase text-center w-[5%]">No.</th>
                  <th className="border border-black p-2 text-[9pt] font-bold uppercase text-left w-[75%]">Evaluación Médica Requerida</th>
                  <th className="border border-black p-2 text-[9pt] font-bold uppercase text-center w-[20%]">Respuesta</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2 text-center font-bold">1</td>
                  <td className="border border-black p-2 text-[9.5pt]">¿Padece de hemofilia, problemas de coagulación o cicatrización difícil?</td>
                  {renderAnswer(questions.hemofilia)}
                </tr>
                <tr>
                  <td className="border border-black p-2 text-center font-bold">2</td>
                  <td className="border border-black p-2 text-[9.5pt]">¿Padece diabetes o problemas de glucemia?</td>
                  {renderAnswer(questions.diabetes)}
                </tr>
                <tr>
                  <td className="border border-black p-2 text-center font-bold">3</td>
                  <td className="border border-black p-2 text-[9.5pt]">¿Tiene alergias a medicamentos, tintas, metales, látex o anestésicos?</td>
                  {renderAnswer(questions.alergias)}
                </tr>
                <tr>
                  <td className="border border-black p-2 text-center font-bold">4</td>
                  <td className="border border-black p-2 text-[9.5pt]">¿Sufre de afecciones cardíacas, problemas de presión arterial o usa marcapasos?</td>
                  {renderAnswer(questions.cardiacas)}
                </tr>
                <tr>
                  <td className="border border-black p-2 text-center font-bold">5</td>
                  <td className="border border-black p-2 text-[9.5pt]">¿Padece epilepsia, convulsiones o desmayos recurrentes?</td>
                  {renderAnswer(questions.epilepsia)}
                </tr>
                <tr>
                  <td className="border border-black p-2 text-center font-bold">6</td>
                  <td className="border border-black p-2 text-[9.5pt]">¿Tiene alguna afección activa en la piel (eccema, psoriasis, queloides) en la zona del servicio?</td>
                  {renderAnswer(questions.afeccion_piel)}
                </tr>
                <tr>
                  <td className="border border-black p-2 text-center font-bold">7</td>
                  <td className="border border-black p-2 text-[9.5pt]">En caso de mujeres, ¿se encuentra embarazada o en periodo de lactancia?</td>
                  {renderAnswer(questions.embarazo)}
                </tr>
                <tr>
                  <td className="border border-black p-2 text-center font-bold">8</td>
                  <td className="border border-black p-2 text-[9.5pt]">¿Padece o ha padecido hepatitis (A, B, C o D), VIH u otra enfermedad de transmisión sanguínea?</td>
                  {renderAnswer(questions.hepatitis_vih)}
                </tr>
                <tr>
                  <td className="border border-black p-2 text-center font-bold">9</td>
                  <td className="border border-black p-2 text-[9.5pt]">¿Ha consumido alcohol, anticoagulantes (como aspirinas) o estupefacientes en las últimas 24 horas?</td>
                  {renderAnswer(questions.alcohol_drogas)}
                </tr>
              </tbody>
            </table>

            {/* Observations box */}
            <div className="border border-black p-3.5 mb-6 text-[9.5pt] min-h-[50px]">
              <div className="font-bold uppercase text-[8.5pt] text-gray-700 mb-1">
                Observaciones / Detalles de Condiciones Médicas:
              </div>
              <div>{detallesMedicos}</div>
            </div>

            {/* Legal text */}
            <div className="text-[8.5pt] text-justify mb-8 leading-normal">
              <strong>DECLARACIÓN DE CONSENTIMIENTO:</strong> Declaro que la información anterior es exacta y completa bajo protesta de decir verdad. Omitir información de salud puede conllevar riesgos severos durante y después del procedimiento. Otorgo mi pleno consentimiento para la realización del procedimiento estético y deslindo de toda responsabilidad al establecimiento y al artista que realiza el servicio por complicaciones resultantes de condiciones preexistentes no declaradas.
            </div>

            {/* Signatures */}
            <div className="flex justify-between items-end mt-12 print:avoid">
              <div className="w-[45%] text-center flex flex-col items-center">
                <div className="h-[70px] flex items-center justify-center -mb-2.5">
                  {firma ? (
                    <img src={firma} alt="Firma Digital" className="max-h-[70px] max-w-full object-contain" />
                  ) : (
                    <span className="text-gray-400 text-[8pt] italic">Sin firma digital</span>
                  )}
                </div>
                <div className="border-t border-black w-full pt-2">
                  <div className="text-[9pt] font-bold uppercase">{nombre || "Firma del Cliente"}</div>
                  <div className="text-[8pt] text-gray-500">{identificacion ? `Identificación: ${identificacion}` : "INE / Pasaporte"}</div>
                </div>
              </div>

              <div className="w-[45%] text-center flex flex-col items-center">
                <div className="h-[70px] flex items-center justify-center">
                  {/* Espacio firma artista */}
                </div>
                <div className="border-t border-black w-full pt-2">
                  <div className="text-[9pt] font-bold uppercase">Firma del Artista / Responsable</div>
                  <div className="text-[8.5pt] text-gray-800">Karen Muñoz González</div>
                  <div className="text-[7.5pt] text-gray-500 font-mono">Reg: 33/TT0467/2024</div>
                  <div className="text-[7pt] text-gray-400">Mambas Tattoo & Cuts</div>
                </div>
              </div>
            </div>

            {/* Legal compliance footer */}
            <div className="mt-10 pt-3 border-t border-dashed border-gray-400 text-[7.5pt] text-gray-500 text-justify">
              Este documento contiene datos personales sensibles protegidos por la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (México). De conformidad con la regulación de la Comisión Federal para la Protección contra Riesgos Sanitarios (COFEPRIS), este expediente debe ser resguardado y archivado de manera física o digital en el establecimiento por un periodo mínimo de dos (2) años a partir de la fecha de su firma, estando disponible para auditorías e inspecciones sanitarias correspondientes.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PrintPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white text-black flex items-center justify-center font-sans">
        Cargando formato de impresión...
      </div>
    }>
      <PrintPageContent />
    </Suspense>
  );
}
