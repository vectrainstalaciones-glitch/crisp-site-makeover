import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Building2, Home, FileText, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/presupuestos/")({
  head: () => ({
    meta: [
      { title: "Solicitar presupuesto | Vectra Instalaciones" },
      { name: "description", content: "Solicita tu presupuesto: promotora o industrial, vivienda online o consulta genérica." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <section className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h1 className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#e60012]">
              Solicitar presupuesto
            </h1>
            <p className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              ¿Qué tipo de presupuesto necesitas?
            </p>
            <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-[#0046ff] to-[#e60012]" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card
              to="/presupuestos/promotora"
              icon={<Building2 className="h-7 w-7" />}
              accent="#e60012"
              title="Promotora o industrial"
              text="Obra, nave, comunidad, automatización, mantenimiento… Te contactamos por WhatsApp."
              cta="Empezar"
            />
            <Card
              to="/presupuestos/vivienda"
              icon={<Home className="h-7 w-7" />}
              accent="#00d2ff"
              title="Vivienda (online)"
              text="Estancia por estancia eliges los elementos. Te enviamos el presupuesto por email."
              cta="Crear presupuesto"
            />
            <Card
              to="/presupuestos/generico"
              icon={<FileText className="h-7 w-7" />}
              accent="#0046ff"
              title="Consulta genérica"
              text="No sabes en qué categoría encaja tu proyecto. Cuéntanoslo y te respondemos."
              cta="Contactar"
            />
          </div>
        </div>
      </section>
    </SiteLayout>
  ),
});

function Card(props: { to: string; icon: React.ReactNode; accent: string; title: string; text: string; cta: string }) {
  return (
    <Link
      to={props.to as any}
      className="premium-card group flex flex-col rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_-15px_rgba(0,70,255,0.45)]"
    >
      <div
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-110"
        style={{ borderColor: `${props.accent}66`, background: `${props.accent}1a`, color: props.accent }}
      >
        {props.icon}
      </div>
      <h2 className="mb-2 text-lg font-bold text-white">{props.title}</h2>
      <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">{props.text}</p>
      <span
        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors group-hover:text-white"
        style={{ color: props.accent }}
      >
        {props.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
