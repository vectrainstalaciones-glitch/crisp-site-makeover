import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Trajectory } from "@/components/sections/Trajectory";

export const Route = createFileRoute("/empresa")({
  head: () => ({
    meta: [
      { title: "Empresa | Vectra Instalaciones" },
      { name: "description", content: "Conoce Vectra Instalaciones: equipo técnico con más de 10 años de experiencia en instalaciones industriales y civiles." },
      { property: "og:title", content: "Empresa | Vectra Instalaciones" },
      { property: "og:description", content: "Equipo técnico, trayectoria y valores de Vectra Instalaciones." },
    ],
  }),
  component: () => <SiteLayout><Trajectory /></SiteLayout>,
});
