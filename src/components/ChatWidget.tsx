import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Send, X, Sparkles } from "lucide-react";
import { chatWithBot } from "@/lib/chat.functions";

type Msg = { role: "user" | "assistant"; content: string };

const PHONE = "34614001825";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "¡Hola! Soy el asistente de Vectra. ¿En qué puedo ayudarte? (Si necesitas presupuesto o atención directa, puedo derivarte a WhatsApp)" },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chat = useServerFn(chatWithBot);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await chat({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Error. Prueba por WhatsApp al +34 614 001 825." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir asistente"
          className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#0046ff] to-[#00d2ff] text-white shadow-[0_10px_30px_rgba(0,70,255,0.5)] transition hover:scale-110"
        >
          <Sparkles className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 left-6 z-50 flex h-[540px] w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-[#0046ff] to-[#00d2ff] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <div className="text-sm font-bold">Asistente Vectra</div>
                <div className="text-[10px] opacity-80">Responde al instante · IA</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Cerrar">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-background/50 p-4 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 ${m.role === "user" ? "bg-[#0046ff] text-white" : "bg-secondary text-foreground"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-secondary px-3 py-2 text-muted-foreground">…</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-border bg-card p-3">
            <a
              href={`https://wa.me/${PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2 block text-center text-xs text-[#25D366] hover:underline"
            >
              ¿Prefieres hablar con una persona? Abrir WhatsApp →
            </a>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Escribe tu pregunta..."
                maxLength={500}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#00d2ff]"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0046ff] text-white disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
