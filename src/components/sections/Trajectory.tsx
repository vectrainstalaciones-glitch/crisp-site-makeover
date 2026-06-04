import { MapPin, Check, Award } from "lucide-react";
import { useSiteContent } from "@/lib/siteContent";

export type TrajectoryContent = {
  badge: string;
  headline: string;
  paragraph: string;
  bullet1: string;
  bullet2: string;
  stat1_value: string;
  stat1_label: string;
  stat2_value: string;
  stat2_label: string;
  guarantee_title: string;
  guarantee_desc: string;
};

export const DEFAULT_TRAJECTORY: TrajectoryContent = {
  badge: "Trayectoria Sólida",
  headline: "Nueva constitución en 2026 con un bagaje intachable",
  paragraph:
    "Constituimos formalmente Vectra Instalaciones en 2026 con el propósito de liderar la digitalización y optimización energética. Nacemos con un pilar inquebrantable: más de 10 años de experiencia acumulada por nuestro equipo técnico y operarios.",
  bullet1: "Sede central en El Puerto de Santa María (Cádiz).",
  bullet2: "Equipo técnico ágil adaptado a normativas de seguridad 2026.",
  stat1_value: "+10",
  stat1_label: "Años de experiencia técnica",
  stat2_value: "2026",
  stat2_label: "Fundación de vanguardia",
  guarantee_title: "Garantía Vectra Calidad",
  guarantee_desc: "Materiales homologados y certificaciones oficiales.",
};

export function Trajectory() {
  const { value: t } = useSiteContent<TrajectoryContent>("trajectory", DEFAULT_TRAJECTORY);

  return (
    <section id="trayectoria" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="premium-card relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-16">
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#0046ff]/10 blur-[100px]" />
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-[#00d2ff]">{t.badge}</span>
            <h3 className="mb-6 text-3xl font-black leading-tight text-white">{t.headline}</h3>
            <p className="mb-6 whitespace-pre-wrap leading-relaxed text-muted-foreground">{t.paragraph}</p>
            <div className="mb-6 flex flex-col gap-3 text-sm text-gray-300">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#0046ff]/40 bg-[#0046ff]/20 text-[#00d2ff]">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <span>{t.bullet1}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#0046ff]/40 bg-[#0046ff]/20 text-[#00d2ff]">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>{t.bullet2}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-background/80 p-8 text-center shadow-inner">
              <span className="mb-2 block text-5xl font-black tracking-tight text-white">{t.stat1_value}</span>
              <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.stat1_label}</span>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-background/80 p-8 text-center shadow-inner">
              <span className="mb-2 block text-5xl font-black tracking-tight text-[#e60012]">{t.stat2_value}</span>
              <span className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">{t.stat2_label}</span>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-gradient-to-r from-[#0046ff]/10 to-[#e60012]/10 p-6 sm:col-span-2">
              <div className="flex items-center gap-4">
                <Award className="h-10 w-10 flex-shrink-0 text-[#00d2ff]" />
                <div className="text-left">
                  <span className="block text-sm font-bold text-white">{t.guarantee_title}</span>
                  <span className="text-xs text-muted-foreground">{t.guarantee_desc}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
