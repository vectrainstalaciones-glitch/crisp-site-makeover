import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Sponsor = { id: string; name: string; logo_url: string; website: string | null };

export function Sponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    supabase
      .from("sponsors")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => setSponsors(data ?? []));
  }, []);

  if (sponsors.length === 0) return null;

  const loop = [...sponsors, ...sponsors];

  return (
    <section className="border-y border-border/40 bg-card/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
          Trabajamos con
        </p>
        <div className="relative overflow-hidden">
          <div className="marquee flex w-max items-center gap-16">
            {loop.map((s, i) => (
              <a
                key={`${s.id}-${i}`}
                href={s.website ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-16 shrink-0 items-center opacity-60 transition hover:opacity-100"
              >
                <img src={s.logo_url} alt={s.name} className="max-h-12 w-auto object-contain" loading="lazy" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
