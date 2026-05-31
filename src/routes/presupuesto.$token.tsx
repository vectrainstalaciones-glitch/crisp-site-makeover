import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Printer } from "lucide-react";
import logo from "@/assets/vectra-logo.png";

export const Route = createFileRoute("/presupuesto/$token")({
  head: () => ({ meta: [{ title: "Presupuesto | Vectra" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

type Budget = {
  id: string; nombre: string; email: string; telefono: string | null; direccion: string | null;
  lines: Array<{ concepto: string; descripcion?: string | null; cantidad: number; precio_unitario: number }>;
  total: number; created_at: string; sent_at: string | null;
};

function Page() {
  const { token } = useParams({ from: "/presupuesto/$token" });
  const [b, setB] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.rpc("get_budget_by_token", { _token: token }).then(({ data }) => {
      setB((data as any) ?? null);
      setLoading(false);
    });
  }, [token]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-white"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!b) return <div className="flex min-h-screen items-center justify-center bg-white text-gray-700">Presupuesto no encontrado.</div>;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-3xl px-6 py-10 print:px-0 print:py-0">
        <div className="mb-8 flex items-center justify-between border-b pb-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Vectra" className="h-14 w-14" />
            <div>
              <p className="text-xl font-black tracking-wider">VECTRA <span style={{ color: "#e60012" }}>INSTALACIONES</span></p>
              <p className="text-xs text-gray-500">El Puerto de Santa María, Cádiz · vectrainstalaciones@gmail.com</p>
            </div>
          </div>
          <button onClick={() => window.print()} className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs hover:bg-gray-50 print:hidden">
            <Printer className="h-3 w-3" /> Imprimir / Guardar PDF
          </button>
        </div>

        <h1 className="mb-1 text-2xl font-bold">Presupuesto</h1>
        <p className="mb-6 text-sm text-gray-500">{new Date(b.created_at).toLocaleDateString("es-ES")}</p>

        <div className="mb-8 grid gap-2 text-sm">
          <p><strong>Cliente:</strong> {b.nombre}</p>
          <p><strong>Email:</strong> {b.email}</p>
          {b.telefono && <p><strong>Teléfono:</strong> {b.telefono}</p>}
          {b.direccion && <p><strong>Dirección:</strong> {b.direccion}</p>}
        </div>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-gray-900 text-left">
              <th className="py-2">Concepto</th>
              <th className="py-2 text-center">Cant.</th>
              <th className="py-2 text-right">P. Unit.</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {(b.lines || []).map((l, i) => (
              <tr key={i} className="border-b border-gray-200 align-top">
                <td className="py-2 pr-2">
                  <p className="font-medium">{l.concepto}</p>
                  {l.descripcion && <p className="text-xs text-gray-500">{l.descripcion}</p>}
                </td>
                <td className="py-2 text-center">{l.cantidad}</td>
                <td className="py-2 text-right">{l.precio_unitario.toFixed(2)} €</td>
                <td className="py-2 text-right">{(l.cantidad * l.precio_unitario).toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-900">
              <td colSpan={3} className="py-3 text-right font-bold">TOTAL</td>
              <td className="py-3 text-right text-lg font-black">{Number(b.total).toFixed(2)} €</td>
            </tr>
          </tfoot>
        </table>

        <p className="mt-10 text-xs text-gray-500">
          Presupuesto orientativo, IVA no incluido salvo indicación expresa. Validez 30 días.
          Para cualquier consulta: vectrainstalaciones@gmail.com · WhatsApp +34 614 001 825.
        </p>
      </div>
    </div>
  );
}
