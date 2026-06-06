import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import wera from "@/assets/sponsor-wera.png";
import jung from "@/assets/sponsor-jung.png";
import philips from "@/assets/sponsor-philips.png";
import simon from "@/assets/sponsor-simon.png";
import schneider from "@/assets/sponsor-schneider.png";

type Logo = { src: string; name: string };

const fallback: Logo[] = [
  { src: wera, name: "Wera" },
  { src: jung, name: "Jung" },
  { src: philips, name: "Philips" },
  { src: simon, name: "Simon" },
  { src: schneider, name: "Schneider Electric" },
];

export function Sponsors() {
  const [logos, setLogos] = useState<Logo[]>(fallback);

  useEffect(() => {
    supabase
      .from("sponsors")
      .select("name, logo_url")
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length > 0) {
          setLogos(data.map((s) => ({ src: s.logo_url, name: s.name })));
        }
      });
  }, []);

  if (logos.length === 0) return null;

  const positions = [
    { left: 6, top: 10, w: 180, dur: 9 },
    { left: 28, top: 55, w: 200, dur: 11 },
    { left: 50, top: 8, w: 190, dur: 13 },
    { left: 70, top: 50, w: 170, dur: 10 },
    { left: 14, top: 70, w: 210, dur: 12 },
  ];

  return (
    <section className="relative overflow-hidden border-y border-border/40 py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,70,255,0.12),transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-12 text-center text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
          Trabajamos con
        </p>

        <div className="relative h-[360px] sm:h-[320px]">
          {logos.map((logo, i) => {
            const p = positions[i % positions.length];
            return (
              <div
                key={`${logo.name}-${i}`}
                className="sponsor-float absolute"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: `${p.w}px`,
                  animationDuration: `${p.dur}s`,
                  animationDelay: `${i * -2}s`,
                }}
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  loading="lazy"
                  className="h-auto w-full select-none object-contain drop-shadow-[0_0_25px_rgba(0,210,255,0.25)]"
                />
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes sponsorFloat {
          0%   { transform: translate(0, 0) scale(0.85); }
          25%  { transform: translate(20px, -15px) scale(1.1); }
          50%  { transform: translate(-10px, 20px) scale(0.95); }
          75%  { transform: translate(15px, 10px) scale(1.15); }
          100% { transform: translate(0, 0) scale(0.85); }
        }
        .sponsor-float {
          animation-name: sponsorFloat;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}
