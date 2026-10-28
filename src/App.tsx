import React, { useState } from "react";
import {
  ShieldCheck,
  Search,
  Scale,
  FileDown,
  Sparkles,
  ChevronDown,
  Copy,
  Check,
  AlertCircle,
  Menu,
  X,
  FileText,
  Clock,
  Car
} from "lucide-react";

interface FormState {
  topic: string;
  entity: string;
  date: string;
  notice: string;
  facts: string;
  docs: string;
  consent: boolean;
}

interface ApiResponse {
  analysis?: string;
  petition?: string;
  error?: string;
}

export default function App() {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState<FormState>({
    topic: "comparendo",
    entity: "",
    date: "",
    notice: "",
    facts: "",
    docs: "",
    consent: false,
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ message: string; type: "ok" | "error" } | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"analysis" | "petition">("analysis");
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

  const downloadDoc = (filename: string, title: string, text: string) => {
    const esc = String(text || "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] || c));
    const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font: 12pt Arial, sans-serif; line-height: 1.6; margin: 2.5cm; color: #172033; }
    h1 { font-size: 18pt; color: #0b1a30; border-bottom: 2px solid #263752; padding-bottom: 8px; }
    p.meta { color: #5a6e8c; font-size: 10pt; margin-top: 4px; }
    hr { border: none; border-top: 1px solid #d0d7e2; margin: 20px 0; }
    pre { white-space: pre-wrap; font: 11pt Arial, sans-serif; line-height: 1.6; }
    .footer-note { font-size: 9pt; color: #73849f; margin-top: 30px; border-top: 1px solid #e1e7f0; padding-top: 10px; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p class="meta">Vindicat · Inteligencia jurídica vial en Colombia · Borrador para revisión</p>
  <hr />
  <pre>${esc}</pre>
  <hr />
  <p class="footer-note">Verifica hechos, fechas, normas y anexos antes de firmar o presentar ante el organismo de tránsito competente.</p>
</body>
</html>`;

    const blob = new Blob([html], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      setStatus({ message: "Debes aceptar el aviso para continuar.", type: "error" });
      return;
    }

    if (formData.facts.trim().length < 20) {
      setStatus({
        message: "Por favor describe los hechos con al menos 20 caracteres para poder realizar un análisis adecuado.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    setStatus({ message: "Procesando tu consulta con inteligencia jurídica. No cierres esta página…", type: "ok" });

    try {
      const response = await fetch("/api/asesoria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: formData.topic,
          entity: formData.entity.trim(),
          date: formData.date,
          notice: formData.notice.trim(),
          facts: formData.facts.trim(),
          docs: formData.docs.trim(),
        }),
      });

      const data: ApiResponse = await response.json().catch(() => ({
        error: "Respuesta no válida del servidor.",
      }));

      if (!response.ok) {
        throw new Error(data.error || "No fue posible procesar la consulta.");
      }

      setResult(data);
      setActiveTab(data.analysis ? "analysis" : "petition");
      setStatus({
        message: "Análisis completado con éxito. Verifica los hechos y fechas antes de radicar cualquier documento.",
        type: "ok",
      });
    } catch (err: any) {
      setStatus({
        message:
          (err?.message || "Ocurrió un error al procesar el caso.") +
          " Si estás usando un proveedor externo, verifica la configuración de claves en el servidor.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-[#edf3ff]">
      {/* Top Navigation */}
      <header className="border-b border-white/10 sticky top-0 z-50 bg-[#0b1220]/90 backdrop-blur-md">
        <div className="w-[min(1120px,calc(100%-36px))] mx-auto h-[78px] flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 font-heading font-extrabold text-[21px] tracking-tight">
            <span className="h-10 w-10 rounded-[13px] bg-gradient-to-br from-[#6aa8ff] to-[#72e1d1] grid place-items-center text-[#071322] font-black text-xl shadow-md">
              V
            </span>
            <div className="leading-tight">
              <span className="block tracking-wider">VINDICAT</span>
              <span className="block text-[10px] tracking-[1.6px] text-[#a5b4cc] font-sans font-medium">
                INTELIGENCIA JURÍDICA VIAL
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-[#a5b4cc] text-sm font-medium">
            <a href="#como-funciona" className="hover:text-white transition-colors">
              Cómo funciona
            </a>
            <a href="#asesoria" className="hover:text-white transition-colors">
              Asesoría IA
            </a>
            <a href="#servicios" className="hover:text-white transition-colors">
              Servicios
            </a>
            <a href="#preguntas" className="hover:text-white transition-colors">
              Preguntas
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href="#asesoria" className="btn-primary text-sm py-2.5 px-4 font-bold">
              Analizar mi caso ↗
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#a5b4cc] hover:text-white p-2 rounded-lg bg-[#111c2f] border border-[#263752]"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#263752] bg-[#0b1220] px-6 py-4 flex flex-col gap-3">
            <a
              href="#como-funciona"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#a5b4cc] hover:text-white py-2"
            >
              Cómo funciona
            </a>
            <a
              href="#asesoria"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#a5b4cc] hover:text-white py-2"
            >
              Asesoría IA
            </a>
            <a
              href="#servicios"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#a5b4cc] hover:text-white py-2"
            >
              Servicios
            </a>
            <a
              href="#preguntas"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#a5b4cc] hover:text-white py-2"
            >
              Preguntas
            </a>
            <a
              href="#asesoria"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary text-center py-3 mt-2"
            >
              Analizar mi caso ↗
            </a>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="w-[min(1120px,calc(100%-36px))] mx-auto py-16 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7">
            <span className="tag-badge">
              <span className="h-2 w-2 rounded-full bg-[#72e1d1] animate-pulse"></span>
              ORIENTACIÓN JURÍDICA VIAL EN COLOMBIA
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.1] tracking-tight my-6 font-heading">
              Entiende tu caso.
              <br />
              <span className="text-gradient">Defiende tus derechos.</span>
            </h1>

            <p className="text-lg text-[#a5b4cc] max-w-[590px] leading-relaxed">
              Una guía clara para revisar comparendos, fotodetecciones y trámites administrativos. Organiza tus hechos y
              prepara documentos con apoyo de inteligencia artificial.
            </p>

            <div className="flex flex-wrap gap-3 my-8">
              <a href="#asesoria" className="btn-primary">
                Iniciar asesoría gratuita →
              </a>
              <a href="#servicios" className="btn-secondary">
                Ver servicios
              </a>
            </div>

            <p className="text-xs text-[#a5b4cc]">
              Orientación informativa · Documentos editables · Sin promesas de resultados garantizados
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-panel p-6 shadow-2xl relative">
              <div className="flex items-center gap-1.5 mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#57708d]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#57708d]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#57708d]"></span>
                <span className="text-[11px] text-[#a5b4cc] font-semibold uppercase tracking-wider ml-2">
                  Panel de orientación
                </span>
              </div>

              <div className="flex items-center gap-4 my-4 p-3 bg-[#0b1423]/60 rounded-xl border border-[#263752]">
                <div className="w-12 h-12 rounded-xl bg-[#72e1d1]/15 text-[#72e1d1] grid place-items-center text-2xl font-bold shrink-0">
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <strong className="block text-lg font-heading text-white font-bold">Tu caso, paso a paso</strong>
                  <span className="text-xs text-[#a5b4cc]">Revisión de hechos, fechas y documentos</span>
                </div>
              </div>

              <div className="p-4 border border-[#263752] rounded-xl mt-4 bg-[#0b1423]/80">
                <span className="text-[10px] text-[#72e1d1] font-extrabold tracking-wider uppercase block mb-1">
                  01 · COMPRENDER
                </span>
                <strong className="text-sm font-semibold text-white block">Identifica los puntos clave</strong>
                <p className="text-xs text-[#a5b4cc] mt-1.5 leading-relaxed">
                  Ordena fechas, notificaciones, entidad responsable y pruebas disponibles.
                </p>
              </div>

              <div className="p-4 border border-[#263752] rounded-xl mt-3 bg-[#0b1423]/80">
                <span className="text-[10px] text-[#72e1d1] font-extrabold tracking-wider uppercase block mb-1">
                  02 · PREPARAR
                </span>
                <strong className="text-sm font-semibold text-white block">Construye un borrador</strong>
                <p className="text-xs text-[#a5b4cc] mt-1.5 leading-relaxed">
                  Genera un documento para revisar antes de presentarlo ante la autoridad.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Cómo Funciona */}
        <section id="como-funciona" className="py-16 md:py-20 border-t border-white/5">
          <div className="w-[min(1120px,calc(100%-36px))] mx-auto">
            <div className="max-w-[680px] mb-10">
              <span className="tag-badge">UN PROCESO MÁS CLARO</span>
              <h2 className="text-3xl md:text-4xl font-extrabold font-heading mt-3.5 mb-3">
                La información correcta es el primer paso.
              </h2>
              <p className="text-[#a5b4cc]">
                Vindicat te ayuda a organizar tu situación y entender qué conviene verificar antes de actuar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <article className="bg-panel p-6 transition-transform hover:-translate-y-1">
                <div className="h-11 w-11 grid place-items-center bg-[#6aa8ff]/15 text-[#6aa8ff] rounded-xl text-xl mb-4">
                  <Search size={22} />
                </div>
                <h3 className="text-lg font-bold font-heading mb-2">1. Analiza los hechos</h3>
                <p className="text-sm text-[#a5b4cc] leading-relaxed">
                  Describe qué pasó, las fechas relevantes y qué documentos tienes. La IA te ayuda a identificar dudas y
                  datos faltantes.
                </p>
              </article>

              <article className="bg-panel p-6 transition-transform hover:-translate-y-1">
                <div className="h-11 w-11 grid place-items-center bg-[#6aa8ff]/15 text-[#6aa8ff] rounded-xl text-xl mb-4">
                  <Scale size={22} />
                </div>
                <h3 className="text-lg font-bold font-heading mb-2">2. Revisa opciones</h3>
                <p className="text-sm text-[#a5b4cc] leading-relaxed">
                  Recibe orientación general sobre procedimientos y posibles pasos, distinguiendo hechos confirmados de
                  aspectos por comprobar.
                </p>
              </article>

              <article className="bg-panel p-6 transition-transform hover:-translate-y-1">
                <div className="h-11 w-11 grid place-items-center bg-[#6aa8ff]/15 text-[#6aa8ff] rounded-xl text-xl mb-4">
                  <FileDown size={22} />
                </div>
                <h3 className="text-lg font-bold font-heading mb-2">3. Prepara un documento</h3>
                <p className="text-sm text-[#a5b4cc] leading-relaxed">
                  Genera un borrador editable, revísalo y completa la información antes de presentarlo por canales
                  oficiales.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Section: Asesoría IA */}
        <section id="asesoria" className="py-16 md:py-20 border-t border-white/5">
          <div className="w-[min(1120px,calc(100%-36px))] mx-auto">
            <div className="max-w-[680px] mb-10">
              <span className="tag-badge">ASISTENTE DE ORIENTACIÓN</span>
              <h2 className="text-3xl md:text-4xl font-extrabold font-heading mt-3.5 mb-3">
                Cuéntanos tu situación.
              </h2>
              <p className="text-[#a5b4cc]">
                Completa lo que sepas. No incluyas contraseñas, datos bancarios ni información sensible innecesaria.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Form Panel */}
              <form
                onSubmit={handleSubmit}
                id="caseForm"
                className="lg:col-span-6 bg-panel p-6 md:p-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold font-heading">Datos del caso</h2>
                  <Car size={20} className="text-[#6aa8ff]" />
                </div>
                <p className="text-sm text-[#a5b4cc] mb-6">
                  La precisión de las fechas y los hechos ayuda a una orientación más útil.
                </p>

                <div className="mb-4">
                  <label htmlFor="topic" className="block text-[13px] font-bold text-[#dbe7fa] mb-2">
                    ¿Qué necesitas revisar?
                  </label>
                  <select
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    required
                    className="w-full border border-[#30435e] bg-[#0b1423] text-white rounded-xl px-3.5 py-3 outline-none focus:border-[#6aa8ff] transition-colors"
                  >
                    <option value="comparendo">Comparendo o multa de tránsito</option>
                    <option value="fotodeteccion">Fotodetección / Fotomulta</option>
                    <option value="prescripcion">Posible prescripción o cobro</option>
                    <option value="embargo">Embargo o cobro coactivo</option>
                    <option value="derecho_peticion">Derecho de petición</option>
                    <option value="otro">Otro asunto administrativo vial</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="entity" className="block text-[13px] font-bold text-[#dbe7fa] mb-2">
                      Entidad (si la conoces)
                    </label>
                    <input
                      id="entity"
                      type="text"
                      placeholder="Ej. Secretaría de Tránsito"
                      value={formData.entity}
                      onChange={(e) => setFormData({ ...formData, entity: e.target.value })}
                      className="w-full border border-[#30435e] bg-[#0b1423] text-white rounded-xl px-3.5 py-3 outline-none focus:border-[#6aa8ff] transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-[13px] font-bold text-[#dbe7fa] mb-2">
                      Fecha del hecho o comparendo
                    </label>
                    <input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full border border-[#30435e] bg-[#0b1423] text-white rounded-xl px-3.5 py-3 outline-none focus:border-[#6aa8ff] transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="notice" className="block text-[13px] font-bold text-[#dbe7fa] mb-2">
                    ¿Cuándo te notificaron?
                  </label>
                  <input
                    id="notice"
                    type="text"
                    placeholder="Ej. No sé / 15 de mayo de 2025"
                    value={formData.notice}
                    onChange={(e) => setFormData({ ...formData, notice: e.target.value })}
                    className="w-full border border-[#30435e] bg-[#0b1423] text-white rounded-xl px-3.5 py-3 outline-none focus:border-[#6aa8ff] transition-colors text-sm"
                  />
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="facts" className="block text-[13px] font-bold text-[#dbe7fa]">
                      Describe qué ocurrió <span className="text-[#6aa8ff]">*</span>
                    </label>
                    <span className="text-[11px] text-[#a5b4cc]">{formData.facts.length}/8000</span>
                  </div>
                  <textarea
                    id="facts"
                    required
                    minLength={20}
                    maxLength={8000}
                    rows={4}
                    placeholder="Cuenta los hechos en orden, qué respuesta recibiste y qué necesitas conseguir."
                    value={formData.facts}
                    onChange={(e) => setFormData({ ...formData, facts: e.target.value })}
                    className="w-full border border-[#30435e] bg-[#0b1423] text-white rounded-xl p-3 outline-none focus:border-[#6aa8ff] transition-colors text-sm resize-y"
                  ></textarea>
                </div>

                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="docs" className="block text-[13px] font-bold text-[#dbe7fa]">
                      Documentos o pruebas disponibles (opcional)
                    </label>
                    <span className="text-[11px] text-[#a5b4cc]">{formData.docs.length}/2500</span>
                  </div>
                  <textarea
                    id="docs"
                    maxLength={2500}
                    rows={2}
                    placeholder="Ej. comparendo, guía de notificación, respuesta a derecho de petición, consulta SIMIT..."
                    value={formData.docs}
                    onChange={(e) => setFormData({ ...formData, docs: e.target.value })}
                    className="w-full border border-[#30435e] bg-[#0b1423] text-white rounded-xl p-3 outline-none focus:border-[#6aa8ff] transition-colors text-sm resize-y"
                  ></textarea>
                </div>

                <label className="flex items-start gap-3 text-xs text-[#a5b4cc] mb-5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="consent"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-1 accent-[#72e1d1] rounded"
                  />
                  <span>
                    Entiendo que la información se enviará al servidor y al proveedor de IA para procesar la consulta. He
                    leído el{" "}
                    <a href="#privacidad" className="text-[#a9d0ff] underline">
                      aviso de privacidad
                    </a>
                    .
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  id="submitBtn"
                  className="btn-primary w-full text-base py-3.5 font-bold"
                >
                  {loading ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⟳</span> Analizando caso…
                    </>
                  ) : (
                    <>Analizar mi caso con IA ↗</>
                  )}
                </button>

                {status && (
                  <div
                    className={`mt-4 p-3.5 rounded-xl text-xs md:text-sm border flex items-start gap-2.5 ${
                      status.type === "error"
                        ? "bg-red-500/10 border-red-500/30 text-red-200"
                        : "bg-[#72e1d1]/10 border-[#72e1d1]/30 text-[#c9fff6]"
                    }`}
                  >
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span>{status.message}</span>
                  </div>
                )}
              </form>

              {/* Result Panel */}
              <section className="lg:col-span-6 bg-panel p-6 md:p-8 min-h-[460px] sticky top-24 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="tag-badge">RESULTADO</span>
                  {result && (
                    <div className="flex items-center gap-1.5 bg-[#0b1423] p-1 rounded-lg border border-[#263752]">
                      <button
                        type="button"
                        onClick={() => setActiveTab("analysis")}
                        className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors ${
                          activeTab === "analysis" ? "bg-[#263752] text-white" : "text-[#a5b4cc] hover:text-white"
                        }`}
                      >
                        Orientación
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("petition")}
                        className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors ${
                          activeTab === "petition" ? "bg-[#263752] text-white" : "text-[#a5b4cc] hover:text-white"
                        }`}
                      >
                        Borrador Petición
                      </button>
                    </div>
                  )}
                </div>

                <h2 className="text-xl md:text-2xl font-bold font-heading mt-3 mb-4">
                  {result ? (activeTab === "analysis" ? "Orientación jurídica" : "Borrador de derecho de petición") : "Tu orientación aparecerá aquí"}
                </h2>

                {!result ? (
                  <div className="my-auto py-12 text-center text-[#a5b4cc] flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#6aa8ff]/10 text-[#6aa8ff] grid place-items-center text-3xl mb-4">
                      <Sparkles size={28} />
                    </div>
                    <p className="max-w-[340px] text-sm leading-relaxed">
                      Completa el formulario para recibir un análisis inicial y, si procede, un borrador de derecho de
                      petición.
                    </p>
                    <p className="text-[11px] text-[#a5b4cc]/70 mt-3">
                      No se presenta ningún documento automáticamente.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="bg-[#0b1423] border border-[#263752] rounded-xl p-4 max-h-[380px] overflow-y-auto mb-4 text-sm leading-relaxed text-[#dce7f7] whitespace-pre-wrap font-sans">
                      {activeTab === "analysis" ? (
                        result.analysis || "No se generó análisis de texto."
                      ) : (
                        result.petition || "No se requiere o no se generó borrador de petición para este caso."
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-2.5 mb-3">
                        <button
                          type="button"
                          id="downloadPetition"
                          disabled={!result.petition}
                          onClick={() =>
                            result.petition &&
                            downloadDoc(
                              "borrador-derecho-peticion.doc",
                              "Borrador de derecho de petición",
                              result.petition
                            )
                          }
                          className="btn-primary text-xs flex-1 py-2.5 font-bold min-w-[140px]"
                        >
                          <FileDown size={15} /> Descargar borrador (.doc)
                        </button>

                        <button
                          type="button"
                          id="downloadAnalysis"
                          disabled={!result.analysis}
                          onClick={() =>
                            result.analysis &&
                            downloadDoc(
                              "orientacion-vindicat.doc",
                              "Orientación jurídica inicial - Vindicat",
                              result.analysis
                            )
                          }
                          className="btn-secondary text-xs flex-1 py-2.5 font-bold min-w-[140px]"
                        >
                          <FileText size={15} /> Descargar análisis
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(activeTab === "analysis" ? result.analysis || "" : result.petition || "")
                          }
                          className="btn-secondary text-xs py-2.5 px-3"
                          title="Copiar texto al portapapeles"
                        >
                          {copied ? <Check size={15} className="text-[#72e1d1]" /> : <Copy size={15} />}
                        </button>
                      </div>

                      <p className="text-[11px] text-[#a5b4cc] text-center">
                        Revisa y completa el documento antes de firmarlo o radicarlo ante la autoridad.
                      </p>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Notice */}
            <div className="mt-8 border border-[#f1c879]/30 bg-[#f1c879]/5 rounded-2xl p-4 md:p-5 text-[#e8d7b4] text-xs leading-relaxed">
              <strong className="font-bold">Importante:</strong> la IA puede equivocarse y no sustituye una revisión
              profesional habilitada. Los plazos y efectos jurídicos dependen de los hechos, notificaciones, normas y
              documentos aportados. No se garantiza eliminar multas, comparendos, reportes o embargos.
            </div>
          </div>
        </section>

        {/* Section: Servicios */}
        <section id="servicios" className="py-16 md:py-20 border-t border-white/5">
          <div className="w-[min(1120px,calc(100%-36px))] mx-auto">
            <div className="max-w-[680px] mb-10">
              <span className="tag-badge">SERVICIOS</span>
              <h2 className="text-3xl md:text-4xl font-extrabold font-heading mt-3.5 mb-3">
                Elige el apoyo que necesitas.
              </h2>
              <p className="text-[#a5b4cc]">Los precios y servicios se confirmarán antes de habilitar cobros reales.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Service 1 */}
              <article className="bg-panel p-6 flex flex-col justify-between">
                <div>
                  <span className="tag-badge text-[10px] py-1 px-2.5">INICIO</span>
                  <h3 className="text-xl font-bold font-heading mt-4 mb-2">Orientación inicial</h3>
                  <p className="text-xs text-[#a5b4cc] mb-4">Organiza tu caso e identifica qué debes comprobar.</p>
                  <div className="text-3xl font-extrabold font-heading text-white my-4">
                    $0 <span className="text-xs font-sans text-[#a5b4cc] font-normal">COP</span>
                  </div>
                  <ul className="text-xs text-[#a5b4cc] space-y-2.5 mb-6 list-disc pl-4 min-h-[80px]">
                    <li>Formulario de caso y hechos</li>
                    <li>Orientación inicial con IA</li>
                    <li>Lista de datos por verificar</li>
                  </ul>
                </div>
                <a href="#asesoria" className="btn-secondary text-center text-xs py-3 w-full font-bold">
                  Comenzar gratis
                </a>
              </article>

              {/* Service 2 - Featured */}
              <article className="bg-panel p-6 flex flex-col justify-between border-[#6aa8ff]/50 relative shadow-xl shadow-[#6aa8ff]/5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="tag-badge text-[10px] py-1 px-2.5 border-[#6aa8ff] text-[#6aa8ff]">DOCUMENTOS</span>
                    <span className="text-[10px] uppercase tracking-wider text-[#72e1d1] font-bold">Destacado</span>
                  </div>
                  <h3 className="text-xl font-bold font-heading mt-4 mb-2">Borrador personalizado</h3>
                  <p className="text-xs text-[#a5b4cc] mb-4">Prepara un derecho de petición para revisar.</p>
                  <div className="text-2xl font-extrabold font-heading text-white my-4">
                    Por definir <span className="text-xs font-sans text-[#a5b4cc] font-normal">COP</span>
                  </div>
                  <ul className="text-xs text-[#a5b4cc] space-y-2.5 mb-6 list-disc pl-4 min-h-[80px]">
                    <li>Texto adaptado a los hechos de tu caso</li>
                    <li>Archivo descargable compatible con Word</li>
                    <li>Revisión antes de radicar</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setPaymentNotice(
                      "Los pagos aún no están habilitados. No transfieras dinero desde esta página. Todas las herramientas actuales son gratuitas."
                    )
                  }
                  className="btn-secondary text-center text-xs py-3 w-full font-bold"
                >
                  Próximamente
                </button>
              </article>

              {/* Service 3 */}
              <article className="bg-panel p-6 flex flex-col justify-between">
                <div>
                  <span className="tag-badge text-[10px] py-1 px-2.5">REVISIÓN</span>
                  <h3 className="text-xl font-bold font-heading mt-4 mb-2">Revisión ampliada</h3>
                  <p className="text-xs text-[#a5b4cc] mb-4">Organiza evidencias y preguntas para revisión humana.</p>
                  <div className="text-2xl font-extrabold font-heading text-white my-4">
                    Por definir <span className="text-xs font-sans text-[#a5b4cc] font-normal">COP</span>
                  </div>
                  <ul className="text-xs text-[#a5b4cc] space-y-2.5 mb-6 list-disc pl-4 min-h-[80px]">
                    <li>Lista de documentos faltantes</li>
                    <li>Identificación de dudas y riesgos</li>
                    <li>Sin promesa de resultado</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setPaymentNotice(
                      "Los pagos aún no están habilitados. No transfieras dinero desde esta página. Todas las herramientas actuales son gratuitas."
                    )
                  }
                  className="btn-secondary text-center text-xs py-3 w-full font-bold"
                >
                  Próximamente
                </button>
              </article>
            </div>
          </div>
        </section>

        {/* Section: Preguntas Frecuentes */}
        <section id="preguntas" className="py-16 md:py-20 border-t border-white/5">
          <div className="w-[min(1120px,calc(100%-36px))] mx-auto max-w-3xl">
            <div className="mb-8">
              <span className="tag-badge">PREGUNTAS FRECUENTES</span>
              <h2 className="text-3xl font-extrabold font-heading mt-3.5 mb-3">Antes de presentar un documento.</h2>
            </div>

            <div className="divide-y divide-[#263752]">
              <details className="py-4 group">
                <summary className="flex items-center justify-between font-bold cursor-pointer text-base text-white list-none">
                  <span>¿Garantiza Vindicat que eliminarán mi comparendo?</span>
                  <ChevronDown size={18} className="text-[#a5b4cc] transition-transform group-open:rotate-180" />
                </summary>
                <p className="text-sm text-[#a5b4cc] mt-3 leading-relaxed">
                  No. El resultado de cualquier actuación jurídica o administrativa depende de la norma aplicable, los
                  hechos comprobados, las pruebas y el procedimiento legal seguido por el organismo de tránsito.
                </p>
              </details>

              <details className="py-4 group">
                <summary className="flex items-center justify-between font-bold cursor-pointer text-base text-white list-none">
                  <span>¿El borrador se presenta automáticamente?</span>
                  <ChevronDown size={18} className="text-[#a5b4cc] transition-transform group-open:rotate-180" />
                </summary>
                <p className="text-sm text-[#a5b4cc] mt-3 leading-relaxed">
                  No. Debes revisar su exactitud, completar tus datos personales, cédula y anexos, y radicarlo por el canal
                  oficial correspondiente (ventanilla virtual, correo institucional o presencialmente).
                </p>
              </details>

              <details className="py-4 group">
                <summary className="flex items-center justify-between font-bold cursor-pointer text-base text-white list-none">
                  <span>¿La IA reemplaza a un abogado?</span>
                  <ChevronDown size={18} className="text-[#a5b4cc] transition-transform group-open:rotate-180" />
                </summary>
                <p className="text-sm text-[#a5b4cc] mt-3 leading-relaxed">
                  No. Es una herramienta de orientación técnica e informativa. Para decisiones complejas o montos
                  significativos, te recomendamos consultar a un profesional del derecho debidamente habilitado.
                </p>
              </details>

              <details className="py-4 group">
                <summary className="flex items-center justify-between font-bold cursor-pointer text-base text-white list-none">
                  <span>¿Puedo pagar ahora?</span>
                  <ChevronDown size={18} className="text-[#a5b4cc] transition-transform group-open:rotate-180" />
                </summary>
                <p className="text-sm text-[#a5b4cc] mt-3 leading-relaxed">
                  No. Los pagos están completamente deshabilitados en esta versión inicial. El análisis y los borradores
                  ofrecidos son para validación y orientación.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Section: Privacidad */}
        <section id="privacidad" className="py-16 md:py-20 border-t border-white/5">
          <div className="w-[min(1120px,calc(100%-36px))] mx-auto max-w-3xl">
            <div className="mb-6">
              <span className="tag-badge">PRIVACIDAD</span>
              <h2 className="text-3xl font-extrabold font-heading mt-3.5 mb-3">Usa el servicio con cuidado.</h2>
            </div>
            <div className="space-y-4 text-sm text-[#a5b4cc] leading-relaxed">
              <p>
                La consulta se envía al servidor de Vindicat y, al usar IA, al proveedor de inteligencia artificial para
                procesarla. No ingreses números de cédula completos, claves, contraseñas, números de cuentas bancarias ni
                información de terceros innecesaria.
              </p>
              <p>
                Antes de abrir el servicio al público general con prestaciones comerciales, el responsable debe publicar
                una política completa de tratamiento de datos personales conforme a la Ley 1581 de 2012 de Colombia,
                definir plazos de retención y eliminación, canal de consultas y demás obligaciones legales aplicables. Este
                texto es solo un aviso inicial.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#263752] py-8 text-xs text-[#a5b4cc]">
        <div className="w-[min(1120px,calc(100%-36px))] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#6aa8ff] to-[#72e1d1] grid place-items-center text-[#071322] font-black text-sm">
              V
            </span>
            <span className="font-heading font-bold text-sm tracking-wider text-white">VINDICAT</span>
          </div>

          <p>© {currentYear} Vindicat · Colombia. Todos los derechos reservados.</p>

          <p className="text-center md:text-right">
            Orientación informativa de tránsito. Verifica siempre fuentes oficiales.
          </p>
        </div>
      </footer>

      {/* Payment Notice Modal */}
      {paymentNotice && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 grid place-items-center p-4">
          <div className="bg-[#111c2f] border border-[#263752] rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fade-in">
            <div className="flex items-center gap-3 mb-3 text-[#f1c879]">
              <Clock size={24} />
              <h3 className="font-heading font-bold text-lg text-white">Información de pago</h3>
            </div>
            <p className="text-sm text-[#a5b4cc] leading-relaxed mb-6">{paymentNotice}</p>
            <button
              type="button"
              onClick={() => setPaymentNotice(null)}
              className="btn-primary w-full text-xs font-bold py-2.5"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
