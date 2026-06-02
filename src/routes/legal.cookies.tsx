import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/legal/cookies")({
  head: () => ({
    meta: [
      { title: "Política de cookies | Vectra Instalaciones" },
      { name: "description", content: "Política de cookies de Vectra Instalaciones." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <h1 className="mb-8 text-3xl font-black text-white sm:text-4xl">Política de cookies</h1>
        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-2 text-base font-bold text-white">¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que un sitio web guarda en su
              dispositivo para recordar información sobre su visita.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-bold text-white">Cookies utilizadas</h2>
            <p>
              Este sitio utiliza únicamente cookies técnicas estrictamente necesarias para
              el funcionamiento del sitio (sesión, preferencias de interfaz) y una cookie
              anónima de medición interna para conocer las páginas más visitadas. No se
              utilizan cookies publicitarias ni de terceros para perfilado comercial.
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-base font-bold text-white">Gestión de cookies</h2>
            <p>
              Puede configurar o bloquear las cookies desde la configuración de su
              navegador. La desactivación puede afectar al funcionamiento del sitio.
            </p>
          </section>
        </div>
      </article>
    </SiteLayout>
  ),
});
