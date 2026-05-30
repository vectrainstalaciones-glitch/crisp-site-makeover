import wera from "@/assets/sponsor-wera.png";
import jung from "@/assets/sponsor-jung.png";
import philips from "@/assets/sponsor-philips.png";
import simon from "@/assets/sponsor-simon.png";
import schneider from "@/assets/sponsor-schneider.png";

const logos = [
  { src: wera, name: "Wera" },
  { src: jung, name: "Jung" },
  { src: philips, name: "Philips" },
  { src: simon, name: "Simon" },
  { src: schneider, name: "Schneider Electric" },
];

export function Sponsors() {
  return (
    <section className="relative overflow-hidden border-y border-border/40 bg-black py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,70,255,0.12),transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-12 text-center text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
          Trabajamos con
        </p>

        <div className="relative h-[360px] sm:h-[320px]">
          {logos.map((logo, i) => (
            <div
              key={logo.name}
              className="sponsor-float absolute"
              style={{
                left: `${[6, 28, 50, 70, 14][i]}%`,
                top: `${[10, 55, 8, 50, 70][i]}%`,
                width: `${[180, 200, 190, 170, 210][i]}px`,
                animationDuration: `${[9, 11, 13, 10, 12][i]}s`,
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
          ))}
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
