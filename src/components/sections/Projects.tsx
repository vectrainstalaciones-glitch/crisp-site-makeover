import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Project = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  location: string | null;
};

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => setProjects(data ?? []));
  }, []);

  return (
    <section id="proyectos" className="border-t border-border/40 bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#00d2ff]">Proyectos</h2>
          <p className="text-3xl font-black tracking-tight text-white sm:text-4xl">Obras realizadas</p>
          <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-[#00d2ff] to-[#0046ff]" />
        </div>

        {projects.length === 0 ? (
          <p className="text-center text-muted-foreground">Próximamente añadiremos nuestros proyectos destacados.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <article key={p.id} className="premium-card group overflow-hidden rounded-2xl">
                {p.image_url && (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={p.image_url}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="mb-2 text-lg font-bold text-white">{p.title}</h3>
                  {p.location && <p className="mb-2 text-xs uppercase tracking-wider text-[#00d2ff]">{p.location}</p>}
                  {p.description && <p className="text-sm leading-relaxed text-muted-foreground">{p.description}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
