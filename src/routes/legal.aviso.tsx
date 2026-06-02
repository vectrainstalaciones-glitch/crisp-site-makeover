import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/legal/aviso")({
  head: () => ({
    meta: [
      { title: "Aviso legal | Vectra Instalaciones" },
      { name: "description", content: "Aviso legal de Vectra Instalaciones." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <h1 className="mb-8 text-3xl font-black text-white sm:text-4xl">Aviso legal</h1>
        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-2 text-base font-bold text-white">1. Titular del sitio</h2>
            <p>
              Vectra Instalaciones, con domicilio en El Puerto de Santa María (Cádiz). Para
              cualquier consulta puede contactar a través del formulario de la sección
              «Presupuestos» o del WhatsApp publicado en la web.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-bold text-white">2. Objeto</h2>
            <p>
              El presente sitio web tiene como finalidad informar sobre los servicios de
              instalaciones eléctricas que ofrece Vectra Instalaciones y permitir la
              solicitud de presupuestos.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-bold text-white">3. Propiedad intelectual</h2>
            <p>
              Todos los contenidos del sitio (textos, logotipos, imágenes, diseño) son
              propiedad de Vectra Instalaciones o de sus proveedores y están protegidos por
              la legislación vigente sobre propiedad intelectual.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-bold text-white">4. Responsabilidad</h2>
            <p>
              Vectra Instalaciones no se hace responsable de los daños derivados del uso
              indebido del sitio ni de la información contenida en webs de terceros
              enlazadas desde aquí.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-bold text-white">5. Legislación aplicable</h2>
            <p>
              El presente aviso legal se rige por la legislación española. Cualquier
              controversia se someterá a los juzgados y tribunales competentes.
            </p>
          </section>
        </div>
      </article>
    </SiteLayout>
  ),
});
