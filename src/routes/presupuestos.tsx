import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Building2, Home, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/presupuestos")({
  head: () => ({
    meta: [
      { title: "Solicitar presupuesto | Vectra Instalaciones" },
      { name: "description", content: "Solicita tu presupuesto: instalaciones para promotora o industrial, o presupuesto online para vivienda." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <section className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h1 className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#e60012]">
              Solicitar presupuesto
            </h1>
            <p className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              ¿Qué tipo de presupuesto necesitas?
            </p>
            <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-[#0046ff] to-[#e60012]" />
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Link
              to="/presupuestos/promotora"
              className="premium-card group flex flex-col rounded-2xl p-8 transition hover:scale-[1.01]"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e60012]/40 bg-[#e60012]/10 text-[#e60012]">
                <Building2 className="h-8 w-8" />
              </div>
              <h2 className="mb-3 text-xl font-bold text-white">Promotora o industrial</h2>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                Cuéntanos tu proyecto (obra, nave, comunidad, mantenimiento…) y te contactamos
                directamente por WhatsApp para preparar la propuesta.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#e60012] group-hover:text-white">
                Empezar <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <Link
              to="/presupuestos/vivienda"
              className="premium-card group flex flex-col rounded-2xl p-8 transition hover:scale-[1.01]"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#00d2ff]/40 bg-[#00d2ff]/10 text-[#00d2ff]">
                <Home className="h-8 w-8" />
              </div>
              <h2 className="mb-3 text-xl font-bold text-white">Presupuesto online para vivienda</h2>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                Estancia por estancia (salón, cocina, baños, habitaciones, exteriores…), eliges los
                elementos que necesitas. Nuestro equipo revisa la solicitud, aplica precios y te lo
                enviamos por email.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#00d2ff] group-hover:text-white">
                Crear presupuesto <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  ),
});
