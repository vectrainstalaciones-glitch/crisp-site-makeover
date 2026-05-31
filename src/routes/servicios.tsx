import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Services } from "@/components/sections/Services";

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios | Vectra Instalaciones" },
      { name: "description", content: "Servicios de instalaciones eléctricas industriales y civiles, mantenimiento preventivo, cuadros y redes de datos en Cádiz." },
      { property: "og:title", content: "Servicios | Vectra Instalaciones" },
      { property: "og:description", content: "Instalaciones industriales y civiles, mantenimiento, cuadros y fibra óptica." },
    ],
  }),
  component: () => <SiteLayout><Services /></SiteLayout>,
});
