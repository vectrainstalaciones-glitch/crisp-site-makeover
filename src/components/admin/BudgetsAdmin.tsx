import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Mail, Copy, Edit2, Save } from "lucide-react";

type CatalogItem = {
  id: string; concepto: string; descripcion: string | null;
  precio_unitario: number; categoria: string; sort_order: number; activo: boolean;
};

type Line = { concepto: string; descripcion?: string | null; cantidad: number; precio_unitario: number; catalog_id?: string };

type BudgetRequest = {
  id: string; nombre: string; empresa: string | null; email: string; telefono: string | null;
  direccion: string | null; mensaje: string; status: string; created_at: string;
  tipo: string; payload: any; lines: Line[]; total: number; public_token: string; sent_at: string | null;
};

/* ============== Catálogo CRUD ============== */
export function CatalogAdmin() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<CatalogItem> | null>(null);

  const load = () => {
    setLoading(true);
    supabase.from("catalog_items").select("*").order("sort_order").then(({ data }) => {
      setItems((data ?? []) as CatalogItem[]);
      setLoading(false);
    });
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.concepto) return toast.error("Concepto obligatorio");
    const row = {
      concepto: editing.concepto,
      descripcion: editing.descripcion ?? null,
      precio_unitario: Number(editing.precio_unitario ?? 0),
      categoria: editing.categoria ?? "general",
      sort_order: Number(editing.sort_order ?? items.length * 10),
      activo: editing.activo ?? true,
    };
    const { error } = editing.id
      ? await supabase.from("catalog_items").update(row).eq("id", editing.id)
      : await supabase.from("catalog_items").insert(row);
    if (error) return toast.error(error.message);
    toast.success("Guardado");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este item del catálogo?")) return;
    const { error } = await supabase.from("catalog_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <section className="premium-card rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Catálogo de items</h2>
        <button onClick={() => setEditing({ activo: true, precio_unitario: 0, categoria: "general" })}
          className="flex items-center gap-2 rounded-lg bg-[#0046ff] px-3 py-1.5 text-sm text-white">
          <Plus className="h-4 w-4" /> Añadir item
        </button>
      </div>

      {editing && (
        <div className="mb-6 grid gap-3 rounded-xl border border-[#00d2ff]/40 bg-background/60 p-4 md:grid-cols-2">
          <input placeholder="Concepto" value={editing.concepto ?? ""} onChange={(e) => setEditing({ ...editing, concepto: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm md:col-span-2" />
          <input placeholder="Descripción" value={editing.descripcion ?? ""} onChange={(e) => setEditing({ ...editing, descripcion: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm md:col-span-2" />
          <input type="number" step="0.01" placeholder="Precio unitario (€)" value={editing.precio_unitario ?? 0}
            onChange={(e) => setEditing({ ...editing, precio_unitario: parseFloat(e.target.value) })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <input placeholder="Categoría" value={editing.categoria ?? "general"} onChange={(e) => setEditing({ ...editing, categoria: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <input type="number" placeholder="Orden" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value || "0") })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <label className="flex items-center gap-2 text-sm text-white">
            <input type="checkbox" checked={editing.activo ?? true} onChange={(e) => setEditing({ ...editing, activo: e.target.checked })} />
            Activo
          </label>
          <div className="flex gap-2 md:col-span-2">
            <button onClick={save} className="flex items-center gap-1 rounded-lg bg-[#00d2ff] px-3 py-2 text-sm font-bold text-black"><Save className="h-3 w-3" /> Guardar</button>
            <button onClick={() => setEditing(null)} className="rounded-lg border border-border px-3 py-2 text-sm text-white">Cancelar</button>
          </div>
        </div>
      )}

      {loading ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
              <th className="py-2">Concepto</th><th>Categ.</th><th className="text-right">Precio</th><th>Orden</th><th>Activo</th><th></th>
            </tr></thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b border-border/40">
                  <td className="py-2 pr-2">
                    <p className="text-white">{it.concepto}</p>
                    {it.descripcion && <p className="text-xs text-muted-foreground">{it.descripcion}</p>}
                  </td>
                  <td className="text-xs text-muted-foreground">{it.categoria}</td>
                  <td className="text-right text-white">{Number(it.precio_unitario).toFixed(2)} €</td>
                  <td className="text-xs text-muted-foreground">{it.sort_order}</td>
                  <td>
                    <button
                      onClick={async () => {
                        await supabase.from("catalog_items").update({ activo: !it.activo }).eq("id", it.id);
                        load();
                      }}
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${it.activo ? "bg-[#00d2ff]/20 text-[#00d2ff]" : "bg-muted text-muted-foreground"}`}
                      title={it.activo ? "Visible para clientes — clic para ocultar" : "Oculto — clic para mostrar"}
                    >
                      {it.activo ? "Visible" : "Oculto"}
                    </button>
                  </td>
                  <td className="text-right">
                    <button onClick={() => setEditing(it)} className="mr-1 rounded p-1 text-[#00d2ff] hover:bg-card" title="Editar"><Edit2 className="h-3 w-3" /></button>
                    <button onClick={() => remove(it.id)} className="rounded p-1 text-red-400 hover:bg-red-500/10" title="Eliminar"><Trash2 className="h-3 w-3" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/* ============== Solicitudes + Editor de presupuesto ============== */
export function BudgetRequestsAdminV2() {
  const [list, setList] = useState<BudgetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    supabase.from("budget_requests").select("*").order("created_at", { ascending: false }).limit(200)
      .then(({ data }) => { setList((data ?? []) as BudgetRequest[]); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar esta solicitud?")) return;
    await supabase.from("budget_requests").delete().eq("id", id);
    load();
  };

  const open = list.find((r) => r.id === openId) ?? null;
  if (open) return <BudgetEditor budget={open} onClose={() => { setOpenId(null); load(); }} />;

  return (
    <section className="premium-card rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Solicitudes de presupuesto</h2>
        <span className="rounded-full border border-[#00d2ff]/40 bg-[#00d2ff]/10 px-3 py-1 text-xs text-[#00d2ff]">{list.length}</span>
      </div>
      {loading ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : list.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin solicitudes todavía.</p>
      ) : (
        <div className="space-y-3">
          {list.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-background/60 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-white">
                    <span className={`mr-2 rounded px-1.5 py-0.5 text-[10px] uppercase ${r.tipo === "vivienda" ? "bg-[#00d2ff]/20 text-[#00d2ff]" : "bg-[#e60012]/20 text-[#e60012]"}`}>{r.tipo}</span>
                    {r.nombre}{r.empresa && <span className="text-muted-foreground"> · {r.empresa}</span>}
                  </p>
                  <p className="text-xs text-[#00d2ff]">{r.email}{r.telefono && ` · ${r.telefono}`}</p>
                  <p className="text-[10px] uppercase text-muted-foreground">
                    {new Date(r.created_at).toLocaleString("es-ES")} · {r.status}{r.sent_at && ` · Enviado ${new Date(r.sent_at).toLocaleDateString("es-ES")}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  {r.tipo === "vivienda" && (
                    <button onClick={() => setOpenId(r.id)} className="rounded-lg bg-[#0046ff] px-3 py-1 text-xs font-bold text-white">Revisar / Enviar</button>
                  )}
                  <button onClick={() => remove(r.id)} className="rounded-lg border border-red-500/30 p-1.5 text-red-400 hover:bg-red-500/10"><Trash2 className="h-3 w-3" /></button>
                </div>
              </div>
              {r.mensaje && <p className="mt-2 whitespace-pre-wrap rounded-lg bg-card/40 p-2 text-xs text-white/80">{r.mensaje}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function BudgetEditor({ budget, onClose }: { budget: BudgetRequest; onClose: () => void }) {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [lines, setLines] = useState<Line[]>(() => {
    if (budget.lines && budget.lines.length) return budget.lines;
    // Build initial lines from payload (client's room selections), no prices yet
    const rooms = (budget.payload?.rooms ?? []) as Array<{ items: Array<{ catalog_id: string; concepto: string; cantidad: number }> }>;
    const map = new Map<string, Line>();
    rooms.forEach((r) => r.items?.forEach((i) => {
      const key = i.catalog_id;
      if (map.has(key)) map.get(key)!.cantidad += i.cantidad;
      else map.set(key, { catalog_id: key, concepto: i.concepto, cantidad: i.cantidad, precio_unitario: 0 });
    }));
    return Array.from(map.values());
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("catalog_items").select("*").eq("activo", true).order("sort_order")
      .then(({ data }) => {
        const cat = (data ?? []) as CatalogItem[];
        setCatalog(cat);
        // Auto-fill missing prices from catalog on first open
        setLines((prev) => prev.map((l) => {
          if (l.precio_unitario > 0) return l;
          const c = cat.find((x) => x.id === l.catalog_id);
          return c ? { ...l, precio_unitario: Number(c.precio_unitario), descripcion: c.descripcion } : l;
        }));
      });
  }, []);

  const total = lines.reduce((s, l) => s + l.cantidad * l.precio_unitario, 0);

  const setLine = (i: number, patch: Partial<Line>) => setLines(lines.map((l, idx) => idx === i ? { ...l, ...patch } : l));
  const removeLine = (i: number) => setLines(lines.filter((_, idx) => idx !== i));
  const addFromCatalog = (id: string) => {
    const c = catalog.find((x) => x.id === id);
    if (!c) return;
    setLines([...lines, { catalog_id: c.id, concepto: c.concepto, descripcion: c.descripcion, cantidad: 1, precio_unitario: Number(c.precio_unitario) }]);
  };
  const addCustom = () => setLines([...lines, { concepto: "Nuevo item", cantidad: 1, precio_unitario: 0 }]);

  const persist = async (extra: Partial<BudgetRequest> = {}) => {
    setSaving(true);
    const { error } = await supabase.from("budget_requests").update({
      lines: lines as any, total, ...extra,
    }).eq("id", budget.id);
    setSaving(false);
    if (error) { toast.error(error.message); return false; }
    return true;
  };

  const saveDraft = async () => { if (await persist({ status: "en_revision" })) toast.success("Borrador guardado"); };

  const sendToClient = async () => {
    if (lines.length === 0) return toast.error("Añade al menos una línea");
    if (!(await persist({ status: "enviado", sent_at: new Date().toISOString() }))) return;
    const url = `${window.location.origin}/presupuesto/${budget.public_token}`;
    const subject = `Tu presupuesto Vectra Instalaciones`;
    const body = `Hola ${budget.nombre},\n\nAquí tienes tu presupuesto personalizado:\n${url}\n\nTotal: ${total.toFixed(2)} €\n\nPuedes abrirlo, imprimirlo o guardarlo como PDF desde el navegador.\nCualquier duda, responde a este email o escríbenos por WhatsApp al +34 614 001 825.\n\nUn saludo,\nVectra Instalaciones`;
    window.open(`mailto:${budget.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    toast.success("Presupuesto guardado. Se ha abierto tu cliente de email.");
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/presupuesto/${budget.public_token}`;
    await navigator.clipboard.writeText(url);
    toast.success("Enlace copiado");
  };

  return (
    <section className="premium-card rounded-2xl p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <button onClick={onClose} className="rounded-lg border border-border px-3 py-1.5 text-sm text-white">← Volver</button>
        <div className="flex flex-wrap gap-2">
          <button onClick={copyLink} className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-white"><Copy className="h-3 w-3" /> Copiar enlace</button>
          <button onClick={saveDraft} disabled={saving} className="rounded-lg border border-[#00d2ff]/40 px-3 py-1.5 text-xs text-[#00d2ff]">Guardar borrador</button>
          <button onClick={sendToClient} disabled={saving} className="flex items-center gap-1 rounded-lg bg-[#0046ff] px-3 py-1.5 text-xs font-bold text-white"><Mail className="h-3 w-3" /> Enviar al cliente</button>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-border bg-background/40 p-4 text-sm">
        <p className="font-bold text-white">{budget.nombre}</p>
        <p className="text-xs text-[#00d2ff]">{budget.email} {budget.telefono && `· ${budget.telefono}`}</p>
        {budget.direccion && <p className="text-xs text-muted-foreground">{budget.direccion}</p>}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select onChange={(e) => { if (e.target.value) { addFromCatalog(e.target.value); e.target.value = ""; } }}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-white">
          <option value="">+ Añadir del catálogo…</option>
          {catalog.map((c) => <option key={c.id} value={c.id}>{c.concepto} — {Number(c.precio_unitario).toFixed(2)} €</option>)}
        </select>
        <button onClick={addCustom} className="rounded-lg border border-border px-3 py-2 text-sm text-white">+ Item personalizado</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
            <th className="py-2">Concepto</th><th className="w-20">Cant.</th><th className="w-32 text-right">P. Unit. (€)</th><th className="w-32 text-right">Total</th><th></th>
          </tr></thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={i} className="border-b border-border/40">
                <td className="py-2 pr-2">
                  <input value={l.concepto} onChange={(e) => setLine(i, { concepto: e.target.value })}
                    className="w-full rounded border border-border bg-background px-2 py-1 text-sm text-white" />
                  {l.descripcion && <p className="mt-1 text-[11px] text-muted-foreground">{l.descripcion}</p>}
                </td>
                <td><input type="number" min={0} value={l.cantidad} onChange={(e) => setLine(i, { cantidad: parseInt(e.target.value || "0") })}
                  className="w-full rounded border border-border bg-background px-2 py-1 text-center text-sm text-white" /></td>
                <td><input type="number" step="0.01" min={0} value={l.precio_unitario} onChange={(e) => setLine(i, { precio_unitario: parseFloat(e.target.value || "0") })}
                  className="w-full rounded border border-border bg-background px-2 py-1 text-right text-sm text-white" /></td>
                <td className="text-right text-white">{(l.cantidad * l.precio_unitario).toFixed(2)} €</td>
                <td className="text-right"><button onClick={() => removeLine(i)} className="rounded p-1 text-red-400 hover:bg-red-500/10"><Trash2 className="h-3 w-3" /></button></td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr className="border-t-2 border-border">
            <td colSpan={3} className="py-3 text-right font-bold text-white">TOTAL</td>
            <td className="text-right text-lg font-black text-[#00d2ff]">{total.toFixed(2)} €</td><td></td>
          </tr></tfoot>
        </table>
      </div>
    </section>
  );
}
