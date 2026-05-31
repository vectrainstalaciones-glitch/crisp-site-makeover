import { Link } from "@tanstack/react-router";
import logo from "@/assets/vectra-logo.png";

const nav = [
  { to: "/", label: "Inicio" },
  { to: "/servicios", label: "Servicios" },
  { to: "/empresa", label: "Empresa" },
  { to: "/proyectos", label: "Proyectos" },
  { to: "/presupuestos", label: "Presupuestos" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex flex-shrink-0 items-center gap-3">
          <img
            src={logo}
            alt="Vectra Instalaciones"
            className="h-11 w-11 object-contain drop-shadow-[0_0_10px_rgba(0,70,255,0.55)] transition group-hover:scale-105"
          />
          <div className="leading-none">
            <span className="block text-xl font-black tracking-wider text-white">VECTRA</span>
            <span className="mt-1 block text-[9px] font-extrabold uppercase tracking-[0.22em]" style={{ color: "#e60012" }}>
              Instalaciones
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium tracking-wide md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-[#00d2ff]" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-white" }}
              className="transition"
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/presupuestos"
            className="rounded-lg border border-[#0046ff] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#0046ff]"
          >
            Solicitar Presupuesto
          </Link>
        </nav>
      </div>
    </header>
  );
}
