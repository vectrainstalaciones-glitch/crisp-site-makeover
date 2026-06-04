import { Layers, Network, Wrench, Zap, ChevronRight, Cpu, Lightbulb, ShieldCheck } from "lucide-react";
import iconIndustrial from "@/assets/icon-industrial.png";
import iconMantenimiento from "@/assets/icon-mantenimiento.png";
import { useSiteContent } from "@/lib/siteContent";

export type ServiceItem = {
  title: string;
  desc: string;
  image?: string;
  icon?: string; // lucide icon name
  color: string;
};

export const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Layers, Network, Wrench, Zap, Cpu, Lightbulb, ShieldCheck,
};

export const DEFAULT_SERVICES: ServiceItem[] = [
  { title: "Infraestructura Industrial", desc: "Infraestructura industrial pesada. Distribución de potencia estructural adaptada al entorno.", image: iconIndustrial, color: "#e60012" },
  { title: "Mantenimiento Preventivo", desc: "Planes preventivos y correctivos para asegurar el suministro continuo, minimizando paradas y optimizando costes.", image: iconMantenimiento, color: "#c084fc" },
  { title: "Cuadros y Armarios", desc: "Diseño a medida, ensamblaje y testeo de cuadros de automatización, control y distribución de potencia.", icon: "Layers", color: "#22d3ee" },
  { title: "Redes y Fibra Óptica", desc: "Cableado estructurado certificado e infraestructuras críticas de transmisión de datos para la industria.", icon: "Network", color: "#ffffff" },
];

export function Services() {
  const { value: services } = useSiteContent<ServiceItem[]>("services", DEFAULT_SERVICES);

  return (
    <section id="servicios" className="relative bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <h2 className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#e60012]">
            Servicios de Alta Exigencia
          </h2>
          <p className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Equipo Técnico y Operaciones Certificadas
          </p>
          <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-[#0046ff] to-[#e60012]" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon ? ICONS[s.icon] : null;
            return (
              <div key={s.title} className="premium-card group flex flex-col justify-between rounded-2xl p-8">
                <div>
                  <div
                    className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border"
                    style={{
                      background: `linear-gradient(135deg, ${s.color}33, ${s.color}11)`,
                      borderColor: `${s.color}55`,
                      boxShadow: `0 0 25px ${s.color}22`,
                      color: s.color,
                    }}
                  >
                    {s.image ? (
                      <img src={s.image} alt={s.title} className="h-16 w-16 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" loading="lazy" />
                    ) : Icon ? (
                      <Icon className="h-8 w-8" />
                    ) : null}
                  </div>
                  <h3 className="mb-4 text-xl font-bold tracking-wide text-white">{s.title}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
                <a
                  href="#contacto"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition hover:text-white"
                  style={{ color: s.color }}
                >
                  Leer más <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
