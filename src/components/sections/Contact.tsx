import { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const PHONE = "34614001825";

const schema = z.object({
  nombre: z.string().trim().min(2).max(100),
  empresa: z.string().trim().max(100).optional(),
  email: z.string().trim().email().max(255),
  telefono: z.string().trim().max(30).optional(),
  mensaje: z.string().trim().min(10).max(1500),
});

export function Contact() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error("Revisa los datos del formulario");
      return;
    }
    setSubmitting(true);
    const { nombre, empresa, email, telefono, mensaje } = parsed.data;

    // Registrar la solicitud en la base de datos
    try {
      await supabase.from("budget_requests").insert({
        nombre,
        empresa: empresa || null,
        email,
        telefono: telefono || null,
        mensaje,
      });
    } catch {
      // continúa aunque falle el log
    }

    const text = `Hola Vectra, soy ${nombre}${empresa ? ` (${empresa})` : ""}.\nEmail: ${email}${telefono ? `\nTel: ${telefono}` : ""}\n\n${mensaje}`;
    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitting(false);
    form.reset();
    toast.success("Solicitud registrada. Te redirigimos a WhatsApp.");
  };

  return (
    <section id="contacto" className="relative border-t border-border/60 bg-card/20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Hablemos de su próximo proyecto
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
            Remita sus requerimientos y nuestro equipo técnico elaborará una propuesta a medida.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0046ff]/15 text-[#00d2ff]">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dirección</p>
                <p className="text-white">El Puerto de Santa María, Cádiz</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0046ff]/15 text-[#00d2ff]">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Teléfono / WhatsApp</p>
                <a href={`https://wa.me/${PHONE}`} className="text-white hover:text-[#00d2ff]">+34 614 001 825</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0046ff]/15 text-[#00d2ff]">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</p>
                <a href="mailto:vectrainstalaciones@gmail.com" className="text-white hover:text-[#00d2ff]">vectrainstalaciones@gmail.com</a>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="premium-card space-y-6 rounded-3xl p-8 sm:p-10">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Nombre completo" name="nombre" placeholder="Juan Pérez" required />
              <Field label="Empresa" name="empresa" placeholder="Compañía / Industria" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Email corporativo" name="email" type="email" placeholder="contacto@empresa.com" required />
              <Field label="Teléfono" name="telefono" type="tel" placeholder="+34 600 000 000" />
            </div>
            <div>
              <label className="mb-2.5 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Especificaciones del proyecto
              </label>
              <textarea
                name="mensaje"
                required
                rows={5}
                maxLength={1500}
                placeholder="Describe brevemente tu proyecto..."
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-white outline-none transition focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff]"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="glow-button w-full rounded-xl bg-[#0046ff] py-4 text-sm font-bold uppercase tracking-wide text-white"
            >
              Enviar por WhatsApp
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field(props: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-2.5 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {props.label}
      </label>
      <input
        type={props.type ?? "text"}
        name={props.name}
        required={props.required}
        placeholder={props.placeholder}
        maxLength={255}
        className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff]"
      />
    </div>
  );
}
