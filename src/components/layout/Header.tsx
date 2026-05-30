import { Link } from "@tanstack/react-router";
import logo from "@/assets/vectra-logo.png";
import { useAuth } from "@/lib/useAuth";

export function Header() {
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <a href="#inicio" className="group flex flex-shrink-0 items-center gap-3">
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
        </a>
        <nav className="hidden items-center gap-5 text-sm font-medium tracking-wide md:flex">
          <a href="#inicio" className="text-white transition hover:text-[#00d2ff]">Inicio</a>
          <a href="#servicios" className="text-muted-foreground transition hover:text-white">Servicios</a>
          <a href="#trayectoria" className="text-muted-foreground transition hover:text-white">Empresa</a>
          <a href="#proyectos" className="text-muted-foreground transition hover:text-white">Proyectos</a>
          {user && isAdmin && (
            <Link to="/admin" className="text-[#00d2ff] transition hover:text-white">Panel</Link>
          )}
          {!user ? (
            <Link to="/login" className="text-muted-foreground transition hover:text-white">Acceder</Link>
          ) : null}
          <a
            href="#contacto"
            className="rounded-lg border border-[#0046ff] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#0046ff]"
          >
            Solicitar Presupuesto
          </a>
        </nav>
      </div>
    </header>
  );
}
