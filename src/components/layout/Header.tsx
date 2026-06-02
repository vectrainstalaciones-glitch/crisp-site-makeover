import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu } from "lucide-react";
import logo from "@/assets/vectra-logo.png";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const nav = [
  { to: "/", label: "Inicio" },
  { to: "/servicios", label: "Servicios" },
  { to: "/empresa", label: "Empresa" },
  { to: "/proyectos", label: "Proyectos" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

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

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 text-sm font-medium tracking-wide md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-[#00d2ff]" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-white" }}
              className="transition-colors duration-200"
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/presupuestos"
            className="rounded-lg border border-[#0046ff] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-[#0046ff] hover:shadow-[0_0_18px_rgba(0,70,255,0.55)]"
          >
            Solicitar Presupuesto
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Abrir menú"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border text-white transition-colors hover:border-[#00d2ff] hover:text-[#00d2ff] md:hidden"
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[82%] border-l border-border bg-background p-0 sm:max-w-sm">
            <SheetTitle className="sr-only">Menú</SheetTitle>
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-3 border-b border-border px-6 py-5">
                <img src={logo} alt="" className="h-9 w-9 object-contain" />
                <div className="leading-none">
                  <span className="block text-base font-black tracking-wider text-white">VECTRA</span>
                  <span className="mt-1 block text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#e60012]">
                    Instalaciones
                  </span>
                </div>
              </div>
              <nav className="flex flex-col gap-1 px-4 py-6">
                {nav.map((n, i) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: true }}
                    activeProps={{ className: "bg-[#0046ff]/15 text-[#00d2ff]" }}
                    inactiveProps={{ className: "text-muted-foreground hover:bg-card hover:text-white" }}
                    className="rounded-lg px-4 py-3 text-base font-medium tracking-wide transition-colors duration-200"
                    style={{ animation: `slideIn 0.3s ease ${i * 0.05}s both` }}
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto border-t border-border px-4 py-5">
                <Link
                  to="/presupuestos"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-lg bg-[#0046ff] px-5 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#0035cc]"
                >
                  Solicitar Presupuesto
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </header>
  );
}
