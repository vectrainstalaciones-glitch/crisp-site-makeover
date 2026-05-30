import logo from "@/assets/vectra-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-3">
          <img src={logo} alt="" className="h-8 w-8 object-contain" />
          <span className="text-white">VECTRA <span className="text-[#e60012]">Instalaciones</span></span>
        </div>
        <p>© {new Date().getFullYear()} Vectra Instalaciones · El Puerto de Santa María</p>
      </div>
    </footer>
  );
}
