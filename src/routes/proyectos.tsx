import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Projects } from "@/components/sections/Projects";

export const Route = createFileRoute("/proyectos")({
  head: () => ({
    meta: [
      { title: "Proyectos | Vectra Instalaciones" },
      { name: "description", content: "Proyectos realizados por Vectra Instalaciones: instalaciones industriales, civiles y mantenimiento en Andalucía." },
      { property: "og:title", content: "Proyectos | Vectra Instalaciones" },
      { property: "og:description", content: "Selección de proyectos ejecutados por el equipo de Vectra." },
    ],
  }),
  component: () => <SiteLayout><Projects /></SiteLayout>,
});
