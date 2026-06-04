import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { saveSiteContent } from "@/lib/siteContent";
import { DEFAULT_SERVICES, ICONS, type ServiceItem } from "@/components/sections/Services";
import { DEFAULT_TRAJECTORY, type TrajectoryContent } from "@/components/sections/Trajectory";
import { toast } from "sonner";
import { Plus, Trash2, Save, Upload } from "lucide-react";

/* ---------- Services Admin ---------- */
export function ServicesAdmin() {
  const [items, setItems] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("site_content").select("value").eq("key", "services").maybeSingle().then(({ data }) => {
      if (data?.value) setItems(data.value as ServiceItem[]);
    });
  }, []);

  const update = (i: number, patch: Partial<ServiceItem>) =>
    setItems((arr) => arr.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  const remove = (i: number) => setItems((arr) => arr.filter((_, idx) => idx !== i));
  const add = () => setItems((arr) => [...arr, { title: "Nuevo servicio", desc: "", icon: "Layers", color: "#00d2ff" }]);

  const uploadImage = async (i: number, file: File) => {
    const path = `services/${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;
    const { error } = await supabase.storage.from("site-media").upload(path, file);
    if (error) return toast.error(error.message);
    const url = supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl;
    update(i, { image: url, icon: undefined });
  };

  const save = async () => {
    setBusy(true);
    try {
      await saveSiteContent("services", items);
      toast.success("Servicios guardados");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="premium-card rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Servicios</h2>
        <div className="flex gap-2">
          <button onClick={add} className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs text-white hover:bg-card">
            <Plus className="h-3 w-3" /> Añadir
          </button>
          <button onClick={save} disabled={busy} className="flex items-center gap-1 rounded-lg bg-[#0046ff] px-3 py-1.5 text-xs font-bold text-white">
            <Save className="h-3 w-3" /> {busy ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((s, i) => (
          <div key={i} className="space-y-2 rounded-xl border border-border bg-background/50 p-4">
            <div className="flex items-center gap-3">
              {s.image ? (
                <img src={s.image} alt="" className="h-12 w-12 rounded-lg border border-border object-contain" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border text-xs text-muted-foreground">icon</div>
              )}
              <input
                value={s.title}
                onChange={(e) => update(i, { title: e.target.value })}
                placeholder="Título"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <textarea
              value={s.desc}
              onChange={(e) => update(i, { desc: e.target.value })}
              placeholder="Descripción"
              rows={2}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1 text-xs text-muted-foreground">
                Color
                <input type="color" value={s.color} onChange={(e) => update(i, { color: e.target.value })} className="h-7 w-10 cursor-pointer rounded border border-border bg-background" />
              </label>
              <select
                value={s.icon ?? ""}
                onChange={(e) => update(i, { icon: e.target.value || undefined, image: e.target.value ? undefined : s.image })}
                className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
              >
                <option value="">— sin icono —</option>
                {Object.keys(ICONS).map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <label className="flex cursor-pointer items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs text-white hover:bg-card">
                <Upload className="h-3 w-3" />
                Imagen
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(i, e.target.files[0])} />
              </label>
              <button onClick={() => remove(i)} className="ml-auto flex items-center gap-1 rounded-lg border border-red-500/30 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10">
                <Trash2 className="h-3 w-3" /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Trajectory Admin ---------- */
export function TrajectoryAdmin() {
  const [t, setT] = useState<TrajectoryContent>(DEFAULT_TRAJECTORY);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("site_content").select("value").eq("key", "trajectory").maybeSingle().then(({ data }) => {
      if (data?.value) setT(data.value as TrajectoryContent);
    });
  }, []);

  const set = (k: keyof TrajectoryContent, v: string) => setT((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setBusy(true);
    try {
      await saveSiteContent("trajectory", t);
      toast.success("Trayectoria guardada");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => setT(DEFAULT_TRAJECTORY);

  const fields: { k: keyof TrajectoryContent; label: string; textarea?: boolean }[] = [
    { k: "badge", label: "Etiqueta superior" },
    { k: "headline", label: "Titular" },
    { k: "paragraph", label: "Párrafo principal", textarea: true },
    { k: "bullet1", label: "Línea con icono (mapa)" },
    { k: "bullet2", label: "Línea con icono (check)" },
    { k: "stat1_value", label: "Estadística 1 — valor" },
    { k: "stat1_label", label: "Estadística 1 — etiqueta" },
    { k: "stat2_value", label: "Estadística 2 — valor" },
    { k: "stat2_label", label: "Estadística 2 — etiqueta" },
    { k: "guarantee_title", label: "Banner garantía — título" },
    { k: "guarantee_desc", label: "Banner garantía — descripción" },
  ];

  return (
    <section className="premium-card rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Empresa · Trayectoria sólida</h2>
        <div className="flex gap-2">
          <button onClick={reset} className="rounded-lg border border-border px-3 py-1.5 text-xs text-white hover:bg-card">Restablecer</button>
          <button onClick={save} disabled={busy} className="flex items-center gap-1 rounded-lg bg-[#0046ff] px-3 py-1.5 text-xs font-bold text-white">
            <Save className="h-3 w-3" /> {busy ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {fields.map((f) => (
          <label key={f.k} className={`flex flex-col gap-1 text-xs text-muted-foreground ${f.textarea ? "md:col-span-2" : ""}`}>
            {f.label}
            {f.textarea ? (
              <textarea value={t[f.k]} onChange={(e) => set(f.k, e.target.value)} rows={4} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-white" />
            ) : (
              <input value={t[f.k]} onChange={(e) => set(f.k, e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-white" />
            )}
          </label>
        ))}
      </div>
    </section>
  );
}
