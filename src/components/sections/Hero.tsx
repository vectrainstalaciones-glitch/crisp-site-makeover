import logo from "@/assets/vectra-logo.png";
import heroBg from "@/assets/hero-bg.jpg";

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden border-b border-border/50 pt-20 pb-32 lg:pt-32 lg:pb-40">
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/85 to-background" />
      <div className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0046ff]/15 blur-[150px]" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 -z-10 h-[400px] w-[400px] rounded-full bg-[#e60012]/10 blur-[120px]" />

      <div className="pointer-events-none absolute right-0 top-10 hidden h-full w-1/2 select-none opacity-10 lg:block">
        <img src={logo} alt="" className="h-full w-full object-contain blur-sm" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-semibold text-gray-200 backdrop-blur-md">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#00d2ff]" />
            Instalaciones Eléctricas Profesionales
          </span>
          <h1 className="mb-6 text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Soluciones integrales de energía <br />
            <span className="text-gradient">comerciales e industriales</span>
          </h1>
          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Ingeniería, instalación y mantenimiento con la máxima precisión y seguridad. Atendemos la demanda de los
            clientes más exigentes desde nuestra sede en El Puerto de Santa María.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="#contacto"
              className="glow-button rounded-xl bg-[#0046ff] px-8 py-4 text-center text-sm font-bold uppercase tracking-wide text-white"
            >
              Solicitar Presupuesto
            </a>
            <a
              href="#servicios"
              className="rounded-xl border border-border bg-card/50 px-8 py-4 text-center text-sm font-bold uppercase tracking-wide text-gray-300 backdrop-blur-sm transition hover:border-gray-600 hover:text-white"
            >
              Nuestros Servicios
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
