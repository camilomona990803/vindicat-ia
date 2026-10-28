import express, { Request, Response, NextFunction } from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "5mb" }));

interface CaseRequest {
  topic?: string;
  entity?: string;
  date?: string;
  notice?: string;
  facts?: string;
  docs?: string;
  documento?: string;
  placa?: string;
  consulta?: string;
}

function generateLocalGuidance(data: CaseRequest): { analysis: string; petition: string } {
  const topicName = data.topic || "infracción de tránsito";
  const entityName = data.entity || "SECRETARÍA DE MOVILIDAD / TRÁNSITO MUNICIPAL";
  const fecha = data.date || "Fecha no especificada";
  const notificacion = data.notice || "No especificada o en duda";
  const hechos = data.facts || data.consulta || "Hechos descritos por el ciudadano.";

  const analysis = `ANÁLISIS JURÍDICO INICIAL DE TRÁNSITO (COLOMBIA)
=====================================================
Tipo de asunto: ${topicName.toUpperCase()}
Entidad presunta: ${entityName}
Fecha del hecho: ${fecha}
Estado de notificación: ${notificacion}

1. MARCO JURÍDICO APLICABLE EN COLOMBIA:
- Ley 769 de 2002 (Código Nacional de Tránsito Terrestre).
- Ley 1843 de 2017 (Regulación e instalación de sistemas automáticos y semiautomáticos - Fotodetecciones).
- Sentencia C-038 de 2020 de la Corte Constitucional: Declaró inexequible la solidaridad automática entre propietario y conductor en fotodetecciones; la autoridad de tránsito está en la obligación de individualizar plenamente al conductor infractor.
- Sentencia C-321 de 2022: Reiteró las exigencias para la imputación personal y la garantía del debido proceso (Art. 29 CP).
- Caducidad (Art. 11 Ley 1843 de 2017 y Art. 161 CNT): El término para celebrar la audiencia y emitir fallo sancionatorio es de 1 año contado a partir de la ocurrencia de los hechos.
- Prescripción (Art. 159 CNT): Las multas de tránsito prescriben en 3 años desde la ocurrencia del hecho, o en 5 años si se libró y notificó mandamiento de pago dentro de los primeros 3 años.

2. EVALUACIÓN PRELIMINAR DEL CASO:
- Hechos aportados: "${hechos}"
- Aspecto crítico de notificación: La ley colombiana exige notificación personal o por correo certificado dentro de los términos perentorios. Si la notificación fue defectuosa, no se remitieron las fotos o la dirección estaba desactualizada por omisión de la entidad, procede alegar vulneración al debido proceso y derecho a la defensa.
- Si se trata de fotodetección sin detención física: La autoridad debe demostrar fehacientemente quién conducía el vehículo al momento de la supuesta infracción.

3. ACCIONES Y PASOS SUGERIDOS:
a. Radicar un Derecho de Petición (Art. 23 Constitución Política de Colombia y Ley 1755 de 2015) solicitando la copia íntegra del expediente contravencional, guía de entrega de la empresa de mensajería certificada y constancia de calibración de los dispositivos.
b. En caso de cobro coactivo o embargo, solicitar la declaración de prescripción si han transcurrido más de 3 años sin mandamiento notificado válidamente, o solicitar desembargo si se vulneró el debido proceso.
c. No realizar pagos voluntarios antes de verificar la legalidad de la notificación si se tiene la intención de controvertir la sanción.

*ADVERTENCIA:* Este informe es una orientación jurídica orientativa generada por el sistema Vindicat y no constituye representación legal directa ni garantiza la revocatoria automática del comparendo.`;

  const petition = `SEÑORES
${entityName.toUpperCase()}
OFICINA DE PETICIONES, QUEJAS Y RECURSOS (PQRS) / ÁREA JURÍDICA
Ciudad y Departamento

ASUNTO: DERECHO DE PETICIÓN EN INTERÉS PARTICULAR - SOLICITUD DE REVISIÓN, REVOCATORIA O DECLARATORIA DE VULNERACIÓN AL DEBIDO PROCESO (ART. 23 C.P. Y LEY 1755 DE 2015)

Yo, ciudadano identificado como aparece al pie de mi firma, en ejercicio del Derecho Fundamental de Petición consagrado en el artículo 23 de la Constitución Política de Colombia y en concordancia con el Código de Procedimiento Administrativo y de lo Contencioso Administrativo (Ley 1437 de 2011 sustituido por la Ley 1755 de 2015), me dirijo a su despacho con el fin de exponer los siguientes:

I. HECHOS
1. Con fecha ${fecha}, se registra la supuesta infracción de tránsito bajo el concepto de: ${topicName}.
2. Respecto a la notificación: ${notificacion}. Manifiesto bajo la gravedad del juramento que no tuve conocimiento efectivo y oportuno dentro de los términos legalmente fijados por la Ley 1843 de 2017 y el Código Nacional de Tránsito.
3. ${hechos}
4. De conformidad con la jurisprudencia constitucional, en especial la Sentencia C-038 de 2020, la responsabilidad administrativa en materia de tránsito no es objetiva ni solidaria automática, recayendo en la administración la carga de la prueba respecto a la identidad del infractor.

II. FUNDAMENTOS DE DERECHO
- Artículo 29 de la Constitución Política: Derecho Fundamental al Debido Proceso administrativo.
- Ley 769 de 2002 (Código Nacional de Tránsito Terrestre).
- Ley 1843 de 2017: Disposiciones de instalación, validación y términos perentorios de notificación de fotodetecciones.
- Sentencia C-038 de 2020 de la Corte Constitucional Colombiana.
- Artículos 159 y 161 de la Ley 769 de 2002 referentes a los fenómenos jurídicos de caducidad y prescripción de las acciones contravencionales.

III. PETICIONES
1. Se me expida y remita copia íntegra, digital y foliada del expediente contravencional correspondiente al comparendo o actuación en referencia.
2. Se allegue prueba documental idónea (guía de envío y acuse de recibido físico firmado) que demuestre la fecha, hora y dirección exacta en la cual se surtió la notificación reglamentaria.
3. En caso de fotodetección, se aporte la prueba técnica que identifique fehacientemente al conductor al momento de la infracción, en cumplimiento estricto del precedente vinculante de la Corte Constitucional (Sentencia C-038 de 2020).
4. Subsidiariamente, si han operado los términos legales de caducidad o prescripción extintiva de la acción sancionatoria, se declare de oficio y se proceda a la exoneración y actualización inmediata en el sistema SIMIT.

IV. PRUEBAS
Aporto como prueba sumaria los soportes de mi identidad y copia de la consulta efectuada ante el sistema de información.

V. NOTIFICACIONES
Recibiré comunicaciones oficiales y respuesta al presente trámite en:
Dirección: [Completar dirección física]
Correo electrónico: [Completar correo electrónico para notificación]
Teléfono de contacto: [Completar número telefónico]

Atentamente,

____________________________________________
FIRMA DEL PETICIONARIO
C.C. [Número de Cédula de Ciudadanía]
Expedida en: [Lugar de expedición]`;

  return { analysis, petition };
}

app.post("/api/asesoria", async (req: Request, res: Response) => {
  try {
    const { topic, entity, date, notice, facts, docs, documento, placa, consulta } = req.body as CaseRequest;

    const mainFacts = (facts || consulta || "").trim();
    const hasIdentifier = Boolean(documento || placa);

    if (!mainFacts && !hasIdentifier) {
      return res.status(400).json({
        error: "Por favor describe los hechos de tu caso, una placa o un documento para poder orientarte.",
      });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    // Use Gemini if available
    if (geminiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey: geminiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });

        const systemInstruction = `Eres Vindicat, el asistente y asesor legal experto en tránsito, transporte y derecho administrativo vial en Colombia.
Tu labor es orientar a los ciudadanos colombianos con exactitud técnica, profesionalismo y rigor normativo.
Conoces a profundidad:
- Código Nacional de Tránsito Terrestre (Ley 769 de 2002)
- Ley 1843 de 2017 (Fotodetecciones, plazos de validación y notificación)
- Sentencia C-038 de 2020 de la Corte Constitucional (prohibición de solidaridad automática, deber de individualizar al infractor)
- Sentencia C-321 de 2022
- Caducidad (Art. 11 Ley 1843 / Art. 161 CNT - 1 año para fallo)
- Prescripción (Art. 159 CNT - 3 años desde el hecho, o 5 años si hubo mandamiento de pago debidamente notificado)
- Derecho de petición (Art. 23 CP, Ley 1755 de 2015)
- Procedimiento ante organismos de tránsito, SIMIT y cobro coactivo.

Siempre debes generar una respuesta clara y estructurada en dos partes:
1. 'analysis': Análisis jurídico del caso, plazos, inconsistencias detectadas, normas aplicables, pasos a seguir y advertencias.
2. 'petition': Borrador completo y profesional de derecho de petición en interés particular, con hechos, fundamentos de derecho, peticiones concretas y campos para firma y notificación.`;

        const userPrompt = `Analiza el siguiente caso de tránsito en Colombia:
- Asunto / Motivo: ${topic || "Comparendo o infracción"}
- Entidad de tránsito: ${entity || "No especificada"}
- Fecha del hecho: ${date || "No especificada"}
- Estado / Fecha de notificación: ${notice || "No especificada"}
- Hechos detallados: ${mainFacts || `Identificador placa/documento: ${documento || placa}`}
- Pruebas o documentos disponibles: ${docs || "Ninguno adjunto aún"}

Genera el análisis jurídico y el borrador de derecho de petición correspondiente.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: userPrompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                analysis: {
                  type: Type.STRING,
                  description: "Análisis jurídico detallado para el ciudadano.",
                },
                petition: {
                  type: Type.STRING,
                  description: "Borrador completo editable de derecho de petición.",
                },
              },
              required: ["analysis", "petition"],
            },
          },
        });

        const rawText = response.text?.trim() || "";
        if (rawText) {
          try {
            const parsed = JSON.parse(rawText);
            if (parsed.analysis || parsed.petition) {
              return res.status(200).json({
                analysis: parsed.analysis || "Análisis completado.",
                petition: parsed.petition || "",
              });
            }
          } catch {
            return res.status(200).json({
              analysis: rawText,
              petition: generateLocalGuidance(req.body).petition,
            });
          }
        }
      } catch (geminiError: any) {
        console.error("Gemini API error, using legal engine fallback:", geminiError?.message || geminiError);
      }
    }

    // Fallback to OpenAI if configured
    if (openAiKey) {
      try {
        const promptText = `Eres Vindicat, asistente legal en tránsito en Colombia.
Analiza este caso y devuelve un análisis y un borrador de derecho de petición:
Asunto: ${topic || "Tránsito"}
Entidad: ${entity || "Organismo de tránsito"}
Fecha: ${date || "N/A"}
Notificación: ${notice || "N/A"}
Hechos: ${mainFacts}
Pruebas: ${docs || "N/A"}`;

        const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "Eres Vindicat, un asistente de tránsito en Colombia experto en fotomultas, prescripciones y defensas jurídicas. Devuelve tu respuesta con dos secciones claramente marcadas: '--- ANALISIS ---' y '--- DERECHO DE PETICION ---'.",
              },
              {
                role: "user",
                content: promptText,
              },
            ],
          }),
        });

        if (openAiRes.ok) {
          const data: any = await openAiRes.json();
          const content = data.choices?.[0]?.message?.content || "";
          if (content) {
            const parts = content.split("--- DERECHO DE PETICION ---");
            const analysis = parts[0]?.replace("--- ANALISIS ---", "").trim() || content;
            const petition = parts[1]?.trim() || generateLocalGuidance(req.body).petition;
            return res.status(200).json({ analysis, petition });
          }
        }
      } catch (openAiErr) {
        console.error("OpenAI fallback failed:", openAiErr);
      }
    }

    // Default intelligent Colombian legal guidance engine fallback
    const fallback = generateLocalGuidance(req.body);
    return res.status(200).json(fallback);
  } catch (err: any) {
    console.error("Error processing asesoria request:", err);
    return res.status(500).json({
      error: "Error interno al procesar la consulta: " + (err?.message || "Ocurrió un error inesperado."),
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);

    app.use("*", async (req: Request, res: Response, next: NextFunction) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vindicat full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
