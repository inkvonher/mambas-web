"use client";

import { useEffect, useRef, useState } from "react";

// SCRIPT_URL de Google Apps Script. 
// REEMPLAZAR CON TU URL DE IMPLEMENTACIÓN DE GOOGLE APPS SCRIPT
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRmqcIxfVpta89UlgPPN91qQse8-crJ-_Gvugdf9-1ithLE88ey0XOxzAnoFlhel0/exec"; 

// Teléfono de recepción de Mambas para el WhatsApp
const RECEPCION_WHATSAPP = "5219841820414"; 

interface QuestionState {
  hemofilia: string;
  diabetes: string;
  alergias: string;
  cardiacas: string;
  epilepsia: string;
  afeccion_piel: string;
  embarazo: string;
  hepatitis_vih: string;
  alcohol_drogas: string;
}

export default function TatuajePage() {
  const [nombre, setNombre] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [edad, setEdad] = useState<number | "">("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [detallesMedicos, setDetallesMedicos] = useState("");
  
  // Respuestas de las 9 preguntas
  const [answers, setAnswers] = useState<QuestionState>({
    hemofilia: "",
    diabetes: "",
    alergias: "",
    cardiacas: "",
    epilepsia: "",
    afeccion_piel: "",
    embarazo: "NO", // Por defecto NO
    hepatitis_vih: "",
    alcohol_drogas: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("#");

  // Referencias para el canvas de firma
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);

  // Calcular la edad cuando cambia la fecha de nacimiento
  useEffect(() => {
    if (!fechaNacimiento) return;
    const dob = new Date(fechaNacimiento);
    const today = new Date();
    let calculatedAge = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      calculatedAge--;
    }
    
    setEdad(calculatedAge < 0 ? 0 : calculatedAge);
  }, [fechaNacimiento]);

  // Configurar e inicializar el canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 180;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Dibujar línea guía inicial
    clearCanvasUI(canvas, ctx);

    // Ajustar resolución si cambia el tamaño de pantalla
    const handleResize = () => {
      const currentRect = canvas.getBoundingClientRect();
      // Guardar firma actual antes de redimensionar
      const tempImage = canvas.toDataURL();
      
      canvas.width = currentRect.width;
      canvas.height = 180;
      
      // Volver a dibujar la firma o la línea
      if (!isSignatureEmpty) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.src = tempImage;
      } else {
        clearCanvasUI(canvas, ctx);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSignatureEmpty]);

  const clearCanvasUI = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#D1C7BD";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(30, canvas.height - 40);
    ctx.lineTo(canvas.width - 30, canvas.height - 40);
    ctx.stroke();
    ctx.setLineDash([]); // Reset
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    clearCanvasUI(canvas, ctx);
    setIsSignatureEmpty(true);
  };

  // Dibujo con Mouse
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0D2A22";
    setIsDrawing(true);
    setIsSignatureEmpty(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  // Dibujo con Touch
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0D2A22";
    setIsDrawing(true);
    setIsSignatureEmpty(false);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // Compresión de la firma para la URL de WhatsApp
  const getCompressedSignatureBase64 = () => {
    const canvas = canvasRef.current;
    if (!canvas || isSignatureEmpty) return "";
    
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return "";
    tempCanvas.width = 200;
    tempCanvas.height = 80;
    
    tempCtx.fillStyle = "#FFFFFF";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 200, 80);
    return tempCanvas.toDataURL("image/jpeg", 0.6);
  };

  // Selección de Respuesta
  const toggleAnswer = (key: keyof QuestionState, value: "SI" | "NO") => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  // Envío del Formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar preguntas
    const keys: (keyof QuestionState)[] = [
      "hemofilia", "diabetes", "alergias", "cardiacas", 
      "epilepsia", "afeccion_piel", "embarazo", "hepatitis_vih", "alcohol_drogas"
    ];
    
    for (const key of keys) {
      if (!answers[key]) {
        alert("Por favor, responda todas las preguntas médicas del cuestionario.");
        return;
      }
    }

    // Validar firma
    if (isSignatureEmpty) {
      alert("Por favor, dibuje su firma digital para otorgar el consentimiento.");
      return;
    }

    setLoading(true);

    const signatureDataUrl = getCompressedSignatureBase64();

    // Armar el objeto a enviar
    const dataObject = {
      form_type: "cuestionario",
      nombre,
      fecha_nacimiento: fechaNacimiento,
      edad: String(edad),
      telefono,
      correo,
      identificacion,
      hemofilia: answers.hemofilia,
      diabetes: answers.diabetes,
      alergias: answers.alergias,
      cardiacas: answers.cardiacas,
      epilepsia: answers.epilepsia,
      afeccion_piel: answers.afeccion_piel,
      embarazo: answers.embarazo,
      hepatitis_vih: answers.hepatitis_vih,
      alcohol_drogas: answers.alcohol_drogas,
      detalles_medicos: detallesMedicos,
      firma_base64: signatureDataUrl,
    };

    // Crear la URL de impresión basada en el origen actual
    const printBaseUrl = window.location.origin + "/clientes/tatuaje/imprimir";
    const printQueryParams = new URLSearchParams();
    
    // Meter todos los datos necesarios para renderizar el formato impreso
    Object.entries(dataObject).forEach(([k, v]) => {
      if (k !== "form_type" && k !== "firma_base64") {
        printQueryParams.append(k, v);
      }
    });
    printQueryParams.append("firma", signatureDataUrl);
    
    const fullPrintUrl = printBaseUrl + "?" + printQueryParams.toString();

    try {
      // Mandamos en no-cors de texto plano para evitar preflight
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(dataObject),
      });

      // Como no-cors da respuesta opaca, asumimos éxito
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
        
        // Crear mensaje y link de WhatsApp
        const waMessage = `¡Hola! Acabo de completar mi Cuestionario de Salud y Consentimiento Informado para mi sesión. Aquí está el enlace oficial para impresión (COFEPRIS):\n\n${fullPrintUrl}`;
        setWhatsappUrl(`https://api.whatsapp.com/send?phone=${RECEPCION_WHATSAPP}&text=${encodeURIComponent(waMessage)}`);
        
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 1500);

    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Ocurrió un error al procesar el cuestionario. Por favor, llénelo de forma física al llegar al estudio.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E2522] py-10 px-4 font-sans antialiased">
      <div className="max-w-[650px] mx-auto bg-white rounded-3xl overflow-hidden shadow-xl border border-[#C5A059]/20">
        
        {/* Header */}
        <div className="bg-[#0D2A22] py-8 text-center border-b-[3px] border-[#C5A059] relative">
          <h1 className="font-serif text-[#C5A059] text-2xl sm:text-3xl tracking-[3px] uppercase font-bold mb-1">
            Mambas Tattoo
          </h1>
          <p className="text-[#FAF7F2] text-xs sm:text-sm font-light tracking-[1px] uppercase opacity-90">
            Consentimiento & Cuestionario Sanitario
          </p>
        </div>

        {!submitted ? (
          <form className="p-6 sm:p-8" onSubmit={handleSubmit}>
            {/* Seccion 1 */}
            <h2 className="font-serif text-[#0D2A22] text-lg font-semibold border-b border-[#C5A059]/20 pb-2 mb-6 uppercase tracking-wider">
              Datos Personales
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              <div className="flex flex-col sm:col-span-2">
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[#0D2A22] mb-1.5">
                  Nombre Completo (como en identificación)
                </label>
                <input 
                  type="text" 
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)}
                  className="p-3 border border-[#0D2A22]/15 bg-[#FAF7F2] rounded-lg text-base focus:outline-none focus:border-[#C5A059] focus:bg-white focus:ring-2 focus:ring-[#C5A059]/15 transition-all"
                  required 
                  placeholder="Ej. Juan Pérez López"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[#0D2A22] mb-1.5">
                  Fecha de Nacimiento
                </label>
                <input 
                  type="date" 
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  className="p-3 border border-[#0D2A22]/15 bg-[#FAF7F2] rounded-lg text-base focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all"
                  required 
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[#0D2A22] mb-1.5">
                  Edad Calculada
                </label>
                <div className="p-3 text-lg font-bold text-[#0D2A22]">
                  {edad !== "" ? `${edad} años` : "-- años"}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[#0D2A22] mb-1.5">
                  Teléfono (WhatsApp)
                </label>
                <input 
                  type="tel" 
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="p-3 border border-[#0D2A22]/15 bg-[#FAF7F2] rounded-lg text-base focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all"
                  required 
                  placeholder="10 dígitos"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[#0D2A22] mb-1.5">
                  Correo Electrónico
                </label>
                <input 
                  type="email" 
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="p-3 border border-[#0D2A22]/15 bg-[#FAF7F2] rounded-lg text-base focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all"
                  required 
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="flex flex-col sm:col-span-2">
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[#0D2A22] mb-1.5">
                  Identificación Oficial (INE / Pasaporte)
                </label>
                <input 
                  type="text" 
                  value={identificacion}
                  onChange={(e) => setIdentificacion(e.target.value)}
                  className="p-3 border border-[#0D2A22]/15 bg-[#FAF7F2] rounded-lg text-base focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all"
                  required 
                  placeholder="Clave de Elector o No. Pasaporte"
                />
              </div>
            </div>

            {/* Seccion 2 */}
            <h2 className="font-serif text-[#0D2A22] text-lg font-semibold border-b border-[#C5A059]/20 pb-2 mb-4 uppercase tracking-wider">
              Cuestionario Médico (COFEPRIS)
            </h2>
            <p className="text-xs sm:text-sm text-[#55605C] mb-6">
              Por tu seguridad y cumplimiento sanitario, selecciona honestamente si padeces o has experimentado alguna de las siguientes situaciones:
            </p>

            <div className="flex flex-col gap-4 mb-8">
              {[
                { id: "hemofilia", text: "1. ¿Padece de hemofilia, problemas de coagulación o cicatrización difícil?" },
                { id: "diabetes", text: "2. ¿Padece diabetes o problemas de glucemia?" },
                { id: "alergias", text: "3. ¿Tiene alergias a medicamentos, tintas, metales, látex o anestésicos?" },
                { id: "cardiacas", text: "4. ¿Sufre de afecciones cardíacas, problemas de presión arterial o usa marcapasos?" },
                { id: "epilepsia", text: "5. ¿Padece epilepsia, convulsiones o desmayos recurrentes?" },
                { id: "afeccion_piel", text: "6. ¿Tiene alguna afección activa en la piel (eccema, psoriasis, queloides) en la zona del servicio?" },
                { id: "embarazo", text: "7. En caso de mujeres, ¿se encuentra embarazada o en periodo de lactancia?" },
                { id: "hepatitis_vih", text: "8. ¿Padece o ha padecido hepatitis (A, B, C o D), VIH u otra enfermedad de transmisión sanguínea?" },
                { id: "alcohol_drogas", text: "9. ¿Ha consumido alcohol, anticoagulantes (como aspirinas) o estupefacientes en las últimas 24 horas?" }
              ].map((q) => {
                const key = q.id as keyof QuestionState;
                const value = answers[key];
                return (
                  <div key={q.id} className="bg-[#FAF7F2] p-5 rounded-xl border border-[#0D2A22]/5 flex flex-col gap-4 hover:border-[#C5A059]/30 transition-all">
                    <div className="text-sm font-medium text-[#1E2522]">{q.text}</div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => toggleAnswer(key, "SI")}
                        className={`py-3 rounded-lg border text-sm font-semibold tracking-wider transition-all ${
                          value === "SI" 
                            ? "bg-[#9E3E3E] text-white border-[#9E3E3E] shadow-lg shadow-[#9E3E3E]/20" 
                            : "bg-white text-[#1E2522] border-[#0D2A22]/20 hover:bg-[#0D2A22]/3"
                        }`}
                      >
                        SÍ
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleAnswer(key, "NO")}
                        className={`py-3 rounded-lg border text-sm font-semibold tracking-wider transition-all ${
                          value === "NO" 
                            ? "bg-[#0D2A22] text-white border-[#0D2A22] shadow-lg shadow-[#0D2A22]/20" 
                            : "bg-white text-[#1E2522] border-[#0D2A22]/20 hover:bg-[#0D2A22]/3"
                        }`}
                      >
                        NO
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detalles */}
            <div className="flex flex-col mb-8">
              <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[#0D2A22] mb-1.5">
                Detalles de Afecciones (si contestó SÍ a alguna pregunta):
              </label>
              <textarea 
                value={detallesMedicos}
                onChange={(e) => setDetallesMedicos(e.target.value)}
                className="p-3 border border-[#0D2A22]/15 bg-[#FAF7F2] rounded-lg text-base min-h-[90px] focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all resize-y"
                placeholder="Especificar medicamentos, alergias o condiciones marcadas como SÍ..."
              />
            </div>

            {/* Seccion 3 */}
            <h2 className="font-serif text-[#0D2A22] text-lg font-semibold border-b border-[#C5A059]/20 pb-2 mb-4 uppercase tracking-wider">
              Consentimiento y Deslinde
            </h2>
            <div className="text-[0.8rem] text-[#55605C] bg-[#C5A059]/5 border border-[#C5A059]/25 rounded-lg p-4 mb-8 text-justify leading-relaxed max-h-[130px] overflow-y-auto">
              Declaro bajo protesta de decir verdad que los datos proporcionados en este cuestionario son totalmente verídicos y que no he omitido información médica alguna. Entiendo que los procedimientos de tatuajes, micropigmentación y/o perforaciones implican riesgos de infección, reacciones alérgicas o cicatrización no deseada. Deslindo a Mambas Tattoo, a sus directivos y al artista de cualquier responsabilidad civil o penal derivada de reacciones imprevistas o por omitir información de salud relevante en este formulario. Acepto realizarme el procedimiento bajo mi propio consentimiento.
            </div>

            {/* Firma */}
            <div className="mb-8">
              <label className="text-[0.75rem] font-bold uppercase tracking-wider text-[#0D2A22] mb-1.5 block">
                Firma Digital (Dibuja sobre el cuadro)
              </label>
              <div className="border-[1.5px] border-[#C5A059]/40 bg-white rounded-xl overflow-hidden relative">
                <canvas 
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleMouseUp}
                  className="block w-full h-[180px] touch-none cursor-crosshair"
                />
                <div className="flex justify-end p-2 bg-[#C5A059]/5 border-t border-[#C5A059]/20">
                  <button 
                    type="button" 
                    onClick={clearSignature}
                    className="text-[#9E3E3E] font-semibold text-xs tracking-wider uppercase py-1 px-2 hover:opacity-80 transition-all"
                  >
                    Limpiar Firma
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-4 bg-gradient-to-r from-[#C5A059] to-[#A6803B] text-white font-bold text-base rounded-xl cursor-pointer hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[#C5A059]/30 active:translate-y-0 tracking-[1.5px] uppercase transition-all"
            >
              Enviar Cuestionario
            </button>
          </form>
        ) : (
          /* Pantalla Exito */
          <div className="p-8 sm:p-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-[#2C6E49]/10 rounded-full flex items-center justify-center text-[#2C6E49] text-3xl font-bold mb-5 border border-[#2C6E49]/30">
              ✓
            </div>
            <h2 className="font-serif text-[#0D2A22] text-2xl font-bold mb-4 uppercase tracking-wider">
              ¡Registro Exitoso!
            </h2>
            <p className="text-sm text-[#55605C] mb-8 max-w-[450px] leading-relaxed">
              Tus datos sanitarios y deslinde han sido guardados de manera segura en el sistema de cumplimiento de COFEPRIS.
              <br /><br />
              <strong>Paso Final Obligatorio:</strong> Haz clic en el botón de abajo para enviar tu formato digital a la recepción del estudio mediante WhatsApp para proceder a su impresión y archivo.
            </p>
            
            <a 
              href={whatsappUrl} 
              target="_blank"
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center gap-2.5 bg-[#2C6E49] text-white px-8 py-4.5 rounded-xl font-bold text-lg hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[#2C6E49]/35 tracking-wider uppercase transition-all animate-pulse duration-1000"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.574 1.97 14.101.943 11.997.943c-5.44 0-9.866 4.372-9.87 9.802 0 1.73.46 3.42 1.332 4.926l-.995 3.63 3.731-.969c1.514.823 3.013 1.258 4.791 1.258zm11.367-7.251c-.26-.13-1.534-.759-1.771-.845-.237-.086-.41-.13-.582.13-.172.26-.668.845-.819 1.018-.151.172-.301.194-.56.064-.26-.13-1.097-.404-2.09-1.29-.77-.687-1.29-1.536-1.44-1.796-.15-.26-.016-.4.113-.53.117-.118.26-.301.39-.452.13-.15.173-.258.26-.43.085-.172.043-.323-.022-.452-.064-.13-.582-1.402-.797-1.921-.21-.504-.417-.435-.582-.443-.15-.007-.323-.008-.495-.008-.172 0-.452.064-.688.323-.236.258-.903.885-.903 2.158s.925 2.502 1.054 2.675c.13.172 1.82 2.78 4.41 3.896.615.265 1.096.423 1.472.542.618.196 1.18.169 1.624.1.496-.076 1.534-.627 1.75-.1233.215-.607.215-1.12.162-1.205-.054-.086-.194-.13-.453-.26z"/>
              </svg>
              Enviar a Recepción
            </a>
          </div>
        )}
      </div>

      {/* Pantalla de Carga */}
      {loading && (
        <div className="fixed inset-0 bg-[#0D2A22]/85 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center text-white">
          <div className="w-12 h-12 border-4 border-white/20 border-t-[#C5A059] rounded-full animate-spin mb-5"></div>
          <h3 className="text-lg font-medium tracking-wide">Guardando en base de datos de COFEPRIS...</h3>
          <p className="text-xs opacity-70 mt-1.5">Por favor, no cierres esta ventana.</p>
        </div>
      )}
    </div>
  );
}
