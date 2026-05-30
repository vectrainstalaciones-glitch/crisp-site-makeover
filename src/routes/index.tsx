import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Trajectory } from "@/components/sections/Trajectory";
import { Projects } from "@/components/sections/Projects";
import { Sponsors } from "@/components/sections/Sponsors";
import { Contact } from "@/components/sections/Contact";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vectra Instalaciones | Instalaciones Industriales y Civiles" },
      { name: "description", content: "Soluciones integradas de instalaciones industriales y civiles. Equipo técnico con más de 10 años de experiencia. Sede en El Puerto de Santa María (Cádiz)." },
      { property: "og:title", content: "Vectra Instalaciones — Instalaciones Industriales y Civiles" },
      { property: "og:description", content: "Soluciones integradas de instalaciones industriales y civiles, mantenimiento y cuadros. Cádiz." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Sponsors />
        <Services />
        <Trajectory />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <ChatWidget />
    </div>
  );
}
