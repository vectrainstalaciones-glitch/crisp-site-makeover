import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { BudgetAttachments, type Attachment } from "@/components/BudgetAttachments";

const schema = z.object({
  nombre: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  telefono: z.string().trim().max(30).optional(),
  mensaje: z.string().trim().min(10).max(2000),
});

export const Route = createFileRoute("/presupuestos/generico")({
  head: () => ({
    meta: [
      { title: "Consulta genérica | Vectra" },
      { name: "description", content: "Envía una consulta genérica para cualquier tipo de instalación eléctrica." },
    ],
  }),
  component: Page,
});

function Page() {
  const nav = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) return toast.error("Revisa los datos del formulario");
    setSubmitting(true);
    const { nombre, email, telefono, mensaje } = parsed.data;
    const { error } = await supabase.from("budget_requests").insert({
      nombre, email, telefono: telefono || null, mensaje,
      tipo: "generico",
      payload: { attachments } as any,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Consulta enviada. Te responderemos lo antes posible.");
    nav({ to: "/presupuestos" });
  };

  return (
    <SiteLayout>
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link to="/presupuestos" className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-white">
            <ArrowLeft className="h-3 w-3" /> Volver
          </Link>
          <h1 className="mb-3 text-3xl font-black text-white sm:text-4xl">Consulta genérica</h1>
          <p className="mb-10 text-muted-foreground">
            Cuéntanos lo que necesitas y te responderemos por email o teléfono lo antes posible.
          </p>
          <form onSubmit={onSubmit} className="premium-card space-y-6 rounded-3xl p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Nombre completo" name="nombre" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Teléfono (opcional)" name="telefono" type="tel" />
            </div>
            <div>
              <label className="mb-2.5 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Describe tu consulta
              </label>
              <textarea
                name="mensaje" required rows={7} maxLength={2000}
                placeholder="Cuéntanos qué necesitas: tipo de instalación, ubicación, plazos, dudas…"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#00d2ff]"
              />
            </div>
            <BudgetAttachments value={attachments} onChange={setAttachments} folder="generico" />
            <button
              type="submit" disabled={submitting}
              className="btn-silver w-full rounded-xl py-4 text-sm font-bold uppercase tracking-wide"
            >
              Enviar consulta
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field(props: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-2.5 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{props.label}</label>
      <input
        type={props.type ?? "text"} name={props.name} required={props.required} maxLength={255}
        className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-white outline-none transition-colors focus:border-[#00d2ff]"
      />
    </div>
  );
}
