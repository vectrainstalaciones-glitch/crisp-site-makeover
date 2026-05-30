import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SYSTEM_PROMPT = `Eres el asistente virtual de Vectra Instalaciones, una empresa de soluciones integradas de instalaciones industriales y civiles con sede en El Puerto de Santa María (Cádiz). El equipo técnico cuenta con más de 10 años de experiencia acumulada.

SERVICIOS:
- Infraestructura industrial pesada
- Mantenimiento preventivo y correctivo
- Cuadros y armarios eléctricos
- Redes y fibra óptica

CONTACTO:
- WhatsApp / Teléfono: +34 614 001 825
- Email: vectrainstalaciones@gmail.com
- Sede: El Puerto de Santa María (Cádiz)

INSTRUCCIONES:
- Responde en español, breve y profesional (máx 3 frases).
- Si la pregunta es compleja, requiere presupuesto, visita técnica o información comercial detallada, sugiere amablemente contactar por WhatsApp al +34 614 001 825.
- No inventes precios ni plazos concretos.
- Tono cercano pero técnico.`;

const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1).max(2000),
});

export const chatWithBot = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({
      messages: z.array(messageSchema).min(1).max(30),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { reply: "Lo siento, el asistente no está disponible ahora mismo. Contáctanos por WhatsApp al +34 614 001 825.", escalate: true };
    }

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...data.messages,
          ],
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("AI gateway error:", res.status, text);
        if (res.status === 429) {
          return { reply: "Estamos recibiendo muchas consultas. Por favor escríbenos por WhatsApp al +34 614 001 825.", escalate: true };
        }
        if (res.status === 402) {
          return { reply: "El asistente no está disponible temporalmente. Contáctanos por WhatsApp al +34 614 001 825.", escalate: true };
        }
        return { reply: "Ha ocurrido un error. Contáctanos por WhatsApp al +34 614 001 825.", escalate: true };
      }

      const json = await res.json();
      const reply: string = json.choices?.[0]?.message?.content ?? "¿Podrías reformular tu pregunta?";
      const escalate = /presupuesto|visita|precio|urgente|llamar|contactar/i.test(reply);
      return { reply, escalate };
    } catch (e) {
      console.error("chatWithBot error", e);
      return { reply: "Error de conexión. Escríbenos por WhatsApp al +34 614 001 825.", escalate: true };
    }
  });
