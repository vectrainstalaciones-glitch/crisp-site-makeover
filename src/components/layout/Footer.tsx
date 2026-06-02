import { Link } from "@tanstack/react-router";
import logo from "@/assets/vectra-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 text-sm text-muted-foreground md:flex-row md:justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="" className="h-8 w-8 object-contain" />
          <span className="text-white">VECTRA <span className="text-[#e60012]">Instalaciones</span></span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
          <Link to="/legal/aviso" className="transition-colors hover:text-white">Aviso legal</Link>
          <span className="opacity-40">·</span>
          <Link to="/legal/privacidad" className="transition-colors hover:text-white">Privacidad (RGPD)</Link>
          <span className="opacity-40">·</span>
          <Link to="/legal/cookies" className="transition-colors hover:text-white">Cookies</Link>
        </nav>

        <p className="text-center text-xs md:text-right">
          © {new Date().getFullYear()} Vectra Instalaciones · El Puerto de Santa María
        </p>
      </div>
    </footer>
  );
}
