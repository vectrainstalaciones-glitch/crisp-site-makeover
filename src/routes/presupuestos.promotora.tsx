import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

const PHONE = "34614001825";

const schema = z.object({
  nombre: z.string().trim().min(2).max(100),
  empresa: z.string().trim().max(100).optional(),
  email: z.string().trim().email().max(255),
  telefono: z.string().trim().max(30).optional(),
  mensaje: z.string().trim().min(10).max(1500),
});

export const Route = createFileRoute("/presupuestos/promotora")({
  head: () => ({
    meta: [
      { title: "Presupuesto promotora / industrial | Vectra" },
      { name: "description", content: "Solicita por WhatsApp un presupuesto para promotora o instalación industrial." },
    ],
  }),
  component: Page,
});

function Page() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) return toast.error("Revisa los datos del formulario");
    setSubmitting(true);
    const { nombre, empresa, email, telefono, mensaje } = parsed.data;
    try {
      await supabase.from("budget_requests").insert({
        nombre, empresa: empresa || null, email, telefono: telefono || null, mensaje,
        tipo: "promotora",
      });
    } catch { /* ignore log error */ }
    const text = `Hola Vectra, soy ${nombre}${empresa ? ` (${empresa})` : ""}.\nEmail: ${email}${telefono ? `\nTel: ${telefono}` : ""}\n\n${mensaje}`;
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    setSubmitting(false);
    form.reset();
    toast.success("Solicitud registrada. Te redirigimos a WhatsApp.");
  };

  return (
    <SiteLayout>
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link to="/presupuestos" className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-white">
            <ArrowLeft className="h-3 w-3" /> Volver
          </Link>
          <h1 className="mb-3 text-3xl font-black text-white sm:text-4xl">Presupuesto promotora / industrial</h1>
          <p className="mb-10 text-muted-foreground">
            Rellena los datos y te abriremos un chat de WhatsApp con tu consulta para gestionar tu propuesta.
          </p>
          <form onSubmit={onSubmit} className="premium-card space-y-6 rounded-3xl p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Nombre completo" name="nombre" required />
              <Field label="Empresa / promotora" name="empresa" />
              <Field label="Email" name="email" type="email" required />
              <Field label="Teléfono" name="telefono" type="tel" />
            </div>
            <div>
              <label className="mb-2.5 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Detalles del proyecto
              </label>
              <textarea
                name="mensaje" required rows={6} maxLength={1500}
                placeholder="Tipo de obra, ubicación, plazos aproximados, alcance…"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-white outline-none focus:border-[#00d2ff]"
              />
            </div>
            <button
              type="submit" disabled={submitting}
              className="glow-button w-full rounded-xl bg-[#0046ff] py-4 text-sm font-bold uppercase tracking-wide text-white"
            >
              Enviar por WhatsApp
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
        className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-white outline-none focus:border-[#00d2ff]"
      />
    </div>
  );
}
