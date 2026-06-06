import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Hero } from "@/components/sections/Hero";
import { Trajectory } from "@/components/sections/Trajectory";
import { Projects } from "@/components/sections/Projects";
import { Sponsors } from "@/components/sections/Sponsors";

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
  useEffect(() => {
    if (typeof window === "undefined") return;
    const KEY = "vectra_visit_logged";
    if (sessionStorage.getItem(KEY)) return;
    sessionStorage.setItem(KEY, "1");
    let sid = localStorage.getItem("vectra_sid");
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem("vectra_sid", sid);
    }
    supabase.from("page_visits").insert({
      path: window.location.pathname,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent.slice(0, 500),
      session_id: sid,
    }).then(() => {});
  }, []);

  return (
    <SiteLayout>
      <Hero />
      <Sponsors />
      <Trajectory />
      <Projects />
    </SiteLayout>
  );
}

