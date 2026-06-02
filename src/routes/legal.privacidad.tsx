import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/legal/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de privacidad (RGPD) | Vectra Instalaciones" },
      { name: "description", content: "Política de privacidad y protección de datos de Vectra Instalaciones." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <h1 className="mb-8 text-3xl font-black text-white sm:text-4xl">Política de privacidad</h1>
        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-2 text-base font-bold text-white">1. Responsable del tratamiento</h2>
            <p>
              Vectra Instalaciones, con domicilio en El Puerto de Santa María (Cádiz).
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-bold text-white">2. Finalidad</h2>
            <p>
              Los datos que nos facilita a través de los formularios (nombre, email,
              teléfono, dirección, descripción del proyecto) se utilizan exclusivamente
              para gestionar su solicitud de presupuesto y mantener la comunicación
              comercial relativa a la misma.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-bold text-white">3. Legitimación</h2>
            <p>
              La base legal del tratamiento es su consentimiento al enviar el formulario y
              la ejecución de medidas precontractuales a petición del interesado (artículo
              6.1.a y 6.1.b del RGPD).
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-bold text-white">4. Conservación</h2>
            <p>
              Los datos se conservarán mientras dure la relación comercial y, posteriormente,
              durante los plazos legales aplicables.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-bold text-white">5. Destinatarios</h2>
            <p>
              No se cederán datos a terceros salvo obligación legal. Los datos se almacenan
              en servidores de proveedores tecnológicos con garantías adecuadas dentro del
              Espacio Económico Europeo.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-bold text-white">6. Derechos</h2>
            <p>
              Puede ejercer sus derechos de acceso, rectificación, supresión, oposición,
              limitación y portabilidad enviando una solicitud por escrito a través del
              formulario de contacto del sitio. También puede presentar una reclamación
              ante la Agencia Española de Protección de Datos (www.aepd.es).
            </p>
          </section>
        </div>
      </article>
    </SiteLayout>
  ),
});
