import { MapPin, Check, Award } from "lucide-react";

export function Trajectory() {
  return (
    <section id="trayectoria" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="premium-card relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-16">
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#0046ff]/10 blur-[100px]" />
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-[#00d2ff]">
              Trayectoria Sólida
            </span>
            <h3 className="mb-6 text-3xl font-black leading-tight text-white">
              Nueva constitución en 2026 con un bagaje intachable
            </h3>
            <p className="mb-6 leading-relaxed text-muted-foreground">
              Constituimos formalmente <strong className="text-white">Vectra Instalaciones en 2026</strong> con el propósito de
              liderar la digitalización y optimización energética. Nacemos con un pilar inquebrantable:{" "}
              <strong className="text-white">más de 10 años de experiencia acumulada</strong> por nuestro equipo de
              ingenieros y operarios.
            </p>
            <div className="mb-6 flex flex-col gap-3 text-sm text-gray-300">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#0046ff]/40 bg-[#0046ff]/20 text-[#00d2ff]">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <span>Sede central en <strong className="text-white">El Puerto de Santa María (Cádiz)</strong>.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#0046ff]/40 bg-[#0046ff]/20 text-[#00d2ff]">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>Ingeniería ágil adaptada a normativas de seguridad 2026.</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-background/80 p-8 text-center shadow-inner">
              <span className="mb-2 block text-5xl font-black tracking-tight text-white">+10</span>
              <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Años de experiencia técnica
              </span>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-background/80 p-8 text-center shadow-inner">
              <span className="mb-2 block text-5xl font-black tracking-tight text-[#e60012]">2026</span>
              <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Fundación de vanguardia
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-gradient-to-r from-[#0046ff]/10 to-[#e60012]/10 p-6 sm:col-span-2">
              <div className="flex items-center gap-4">
                <Award className="h-10 w-10 flex-shrink-0 text-[#00d2ff]" />
                <div className="text-left">
                  <span className="block text-sm font-bold text-white">Garantía Vectra Calidad</span>
                  <span className="text-xs text-muted-foreground">Materiales homologados y certificaciones oficiales.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
