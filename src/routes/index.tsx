import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vectra Instalaciones | Ingeniería y Montajes Eléctricos Industriales" },
      { name: "description", content: "Instalaciones eléctricas profesionales para sectores comerciales e industriales. Sede en El Puerto de Santa María (Cádiz). +10 años de experiencia." },
      { property: "og:title", content: "Vectra Instalaciones — Ingeniería Eléctrica" },
      { property: "og:description", content: "Soluciones integrales de energía, mantenimiento y ATEX. Cádiz." },
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
