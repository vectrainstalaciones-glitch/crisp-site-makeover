import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, LogOut, ArrowLeft } from "lucide-react";
import { BudgetRequestsAdminV2, CatalogAdmin } from "@/components/admin/BudgetsAdmin";
import { ServicesAdmin, TrajectoryAdmin } from "@/components/admin/ContentAdmin";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Panel | Vectra" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Project = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  location: string | null;
  sort_order: number;
};

type Sponsor = { id: string; name: string; logo_url: string; website: string | null; sort_order: number };

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && !user) nav({ to: "/login" });
  }, [loading, user, nav]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="dark flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <h1 className="text-2xl font-bold text-white">Acceso restringido</h1>
        <p className="max-w-md text-muted-foreground">
          Tu cuenta <strong>{user.email}</strong> aún no tiene permisos de administrador.
          Comparte este email con el desarrollador para que te active el rol <code className="rounded bg-card px-1">admin</code>.
        </p>
        <button
          onClick={async () => { await supabase.auth.signOut(); nav({ to: "/" }); }}
          className="rounded-lg border border-border px-4 py-2 text-sm text-white hover:bg-card"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const nav = useNavigate();

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Volver a la web
            </Link>
            <h1 className="text-lg font-bold text-white">Panel Vectra</h1>
          </div>
          <button
            onClick={async () => { await supabase.auth.signOut(); nav({ to: "/" }); }}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-card"
          >
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 p-6">
        <VisitsStats />
        <BudgetRequestsAdminV2 />
        <CatalogAdmin />
        <ProjectsAdmin />
        <ServicesAdmin />
        <TrajectoryAdmin />
        <SponsorsAdmin />
        <ChatInbox />
      </main>
    </div>
  );
}

/* ----------------- Visits stats ----------------- */
type Bucket = "hour" | "day" | "week" | "month" | "year";

function VisitsStats() {
  const [bucket, setBucket] = useState<Bucket>("day");
  const [rows, setRows] = useState<{ ts: Date }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const ranges: Record<Bucket, number> = {
      hour: 24 * 60 * 60 * 1000,
      day: 30 * 24 * 60 * 60 * 1000,
      week: 12 * 7 * 24 * 60 * 60 * 1000,
      month: 12 * 31 * 24 * 60 * 60 * 1000,
      year: 5 * 366 * 24 * 60 * 60 * 1000,
    };
    const since = new Date(Date.now() - ranges[bucket]).toISOString();
    supabase
      .from("page_visits")
      .select("created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: true })
      .limit(10000)
      .then(({ data }) => {
        setRows((data ?? []).map((r: any) => ({ ts: new Date(r.created_at) })));
        setLoading(false);
      });
  }, [bucket]);

  const buckets = aggregate(rows.map((r) => r.ts), bucket);
  const max = Math.max(1, ...buckets.map((b) => b.count));
  const total = buckets.reduce((s, b) => s + b.count, 0);

  const labels: Record<Bucket, string> = {
    hour: "Por horas (últimas 24h)",
    day: "Por días (últimos 30 días)",
    week: "Por semanas (últimas 12)",
    month: "Por meses (últimos 12)",
    year: "Por años (últimos 5)",
  };

  return (
    <section className="premium-card rounded-2xl p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Estadísticas de visitas</h2>
          <p className="text-xs text-muted-foreground">{labels[bucket]} · Total: <span className="text-white">{total}</span></p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["hour", "day", "week", "month", "year"] as Bucket[]).map((b) => (
            <button
              key={b}
              onClick={() => setBucket(b)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                bucket === b ? "border-[#00d2ff] bg-[#00d2ff]/10 text-[#00d2ff]" : "border-border text-muted-foreground hover:text-white"
              }`}
            >
              {b === "hour" ? "Horas" : b === "day" ? "Días" : b === "week" ? "Semanas" : b === "month" ? "Meses" : "Años"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-white" /></div>
      ) : (
        <div className="flex h-48 items-end gap-1 overflow-x-auto rounded-xl border border-border bg-background/40 p-3">
          {buckets.map((b) => (
            <div key={b.label} className="group flex flex-1 min-w-[18px] flex-col items-center justify-end gap-1">
              <span className="text-[10px] text-white opacity-0 group-hover:opacity-100">{b.count}</span>
              <div
                className="w-full rounded-t bg-gradient-to-t from-[#0046ff] to-[#00d2ff]"
                style={{ height: `${(b.count / max) * 100}%`, minHeight: b.count > 0 ? 2 : 0 }}
                title={`${b.label}: ${b.count}`}
              />
              <span className="truncate text-[9px] text-muted-foreground">{b.label}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function aggregate(dates: Date[], bucket: Bucket): { label: string; count: number }[] {
  const now = new Date();
  const map = new Map<string, number>();
  const keyOf = (d: Date) => {
    if (bucket === "hour") return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}h`;
    if (bucket === "day") return `${d.getDate()}/${d.getMonth() + 1}`;
    if (bucket === "week") {
      const oneJan = new Date(d.getFullYear(), 0, 1);
      const wk = Math.ceil(((d.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7);
      return `S${wk}`;
    }
    if (bucket === "month") return d.toLocaleDateString("es-ES", { month: "short", year: "2-digit" });
    return String(d.getFullYear());
  };

  // pre-fill buckets so chart isn't empty
  const slots: string[] = [];
  if (bucket === "hour") {
    for (let i = 23; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 3600 * 1000);
      slots.push(keyOf(d));
    }
  } else if (bucket === "day") {
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400 * 1000);
      slots.push(keyOf(d));
    }
  } else if (bucket === "week") {
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 7 * 86400 * 1000);
      slots.push(keyOf(d));
    }
  } else if (bucket === "month") {
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      slots.push(keyOf(d));
    }
  } else {
    for (let i = 4; i >= 0; i--) {
      slots.push(String(now.getFullYear() - i));
    }
  }
  slots.forEach((s) => map.set(s, 0));
  dates.forEach((d) => {
    const k = keyOf(d);
    if (map.has(k)) map.set(k, (map.get(k) ?? 0) + 1);
  });
  return slots.map((label) => ({ label, count: map.get(label) ?? 0 }));
}

/* ----------------- Budget requests ----------------- */
type BudgetRequest = {
  id: string;
  nombre: string;
  empresa: string | null;
  email: string;
  telefono: string | null;
  mensaje: string;
  status: string;
  created_at: string;
};

function BudgetRequestsAdmin() {
  const [list, setList] = useState<BudgetRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    supabase
      .from("budget_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => {
        setList((data ?? []) as BudgetRequest[]);
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

  const toggle = async (r: BudgetRequest) => {
    const next = r.status === "done" ? "new" : "done";
    await supabase.from("budget_requests").update({ status: next }).eq("id", r.id);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar esta solicitud?")) return;
    await supabase.from("budget_requests").delete().eq("id", id);
    load();
  };

  const pending = list.filter((r) => r.status !== "done").length;

  return (
    <section className="premium-card rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Solicitudes de presupuesto</h2>
        <span className="rounded-full border border-[#00d2ff]/40 bg-[#00d2ff]/10 px-3 py-1 text-xs text-[#00d2ff]">
          {pending} pendientes · {list.length} totales
        </span>
      </div>

      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-white" />
      ) : list.length === 0 ? (
        <p className="text-sm text-muted-foreground">Todavía no se ha enviado ninguna solicitud.</p>
      ) : (
        <div className="space-y-3">
          {list.map((r) => (
            <div key={r.id} className={`rounded-xl border p-4 ${r.status === "done" ? "border-border bg-background/30 opacity-60" : "border-border bg-background/60"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-white">
                    {r.nombre}{r.empresa ? <span className="text-muted-foreground"> · {r.empresa}</span> : null}
                  </p>
                  <p className="text-xs text-[#00d2ff]">
                    <a href={`mailto:${r.email}`}>{r.email}</a>
                    {r.telefono ? <> · <a href={`tel:${r.telefono}`}>{r.telefono}</a></> : null}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {new Date(r.created_at).toLocaleString("es-ES")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggle(r)} className="rounded-lg border border-border px-2.5 py-1 text-xs text-white hover:bg-card">
                    {r.status === "done" ? "Reabrir" : "Marcar atendida"}
                  </button>
                  <button onClick={() => remove(r.id)} className="flex items-center gap-1 rounded-lg border border-red-500/30 px-2.5 py-1 text-xs text-red-400 hover:bg-red-500/10">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap rounded-lg bg-card/40 p-3 text-xs text-white/90">{r.mensaje}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ----------------- Projects admin ----------------- */
function ProjectsAdmin() {
  const [list, setList] = useState<Project[]>([]);
  const [form, setForm] = useState({ title: "", description: "", location: "" });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () =>
    supabase.from("projects").select("*").order("sort_order").then(({ data }) => setList(data ?? []));

  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setBusy(true);
    try {
      let image_url: string | null = null;
      if (file) {
        const path = `projects/${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;
        const { error } = await supabase.storage.from("site-media").upload(path, file);
        if (error) throw error;
        image_url = supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl;
      }
      const { error } = await supabase.from("projects").insert({
        title: form.title,
        description: form.description || null,
        location: form.location || null,
        image_url,
        sort_order: list.length,
      });
      if (error) throw error;
      setForm({ title: "", description: "", location: "" });
      setFile(null);
      toast.success("Proyecto añadido");
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este proyecto?")) return;
    await supabase.from("projects").delete().eq("id", id);
    load();
  };

  return (
    <section className="premium-card rounded-2xl p-6">
      <h2 className="mb-4 text-xl font-bold text-white">Proyectos realizados</h2>

      <form onSubmit={add} className="mb-6 grid gap-3 md:grid-cols-2">
        <input
          required
          placeholder="Título"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <input
          placeholder="Ubicación"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm md:col-span-2"
          rows={2}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm md:col-span-2"
        />
        <button
          disabled={busy}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#0046ff] py-2 text-sm font-bold text-white md:col-span-2"
        >
          <Plus className="h-4 w-4" /> {busy ? "Guardando..." : "Añadir proyecto"}
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-background/50 p-4">
            {p.image_url && <img src={p.image_url} alt={p.title} className="mb-3 aspect-video w-full rounded-lg object-cover" />}
            <h3 className="text-sm font-bold text-white">{p.title}</h3>
            {p.location && <p className="text-xs text-[#00d2ff]">{p.location}</p>}
            {p.description && <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>}
            <button onClick={() => remove(p.id)} className="mt-3 flex items-center gap-1 text-xs text-red-400 hover:text-red-300">
              <Trash2 className="h-3 w-3" /> Eliminar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ----------------- Sponsors admin ----------------- */
function SponsorsAdmin() {
  const [list, setList] = useState<Sponsor[]>([]);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => supabase.from("sponsors").select("*").order("sort_order").then(({ data }) => setList(data ?? []));
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name.trim()) return toast.error("Logo y nombre obligatorios");
    setBusy(true);
    try {
      const path = `sponsors/${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;
      const { error: upErr } = await supabase.storage.from("site-media").upload(path, file);
      if (upErr) throw upErr;
      const logo_url = supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl;
      const { error } = await supabase.from("sponsors").insert({ name, website: website || null, logo_url, sort_order: list.length });
      if (error) throw error;
      setName(""); setWebsite(""); setFile(null);
      toast.success("Sponsor añadido");
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally { setBusy(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este sponsor?")) return;
    await supabase.from("sponsors").delete().eq("id", id);
    load();
  };

  return (
    <section className="premium-card rounded-2xl p-6">
      <h2 className="mb-4 text-xl font-bold text-white">Marcas / Sponsors</h2>

      <form onSubmit={add} className="mb-6 grid gap-3 md:grid-cols-2">
        <input required placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        <input placeholder="Website (opcional)" value={website} onChange={(e) => setWebsite(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        <input type="file" accept="image/*" required onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm md:col-span-2" />
        <button disabled={busy} className="flex items-center justify-center gap-2 rounded-lg bg-[#0046ff] py-2 text-sm font-bold text-white md:col-span-2">
          <Plus className="h-4 w-4" /> {busy ? "Subiendo..." : "Añadir sponsor"}
        </button>
      </form>

      <div className="flex flex-wrap gap-3">
        {list.map((s) => (
          <div key={s.id} className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-3">
            <img src={s.logo_url} alt={s.name} className="h-10 w-auto max-w-[80px] object-contain" />
            <div>
              <p className="text-sm text-white">{s.name}</p>
              <button onClick={() => remove(s.id)} className="text-xs text-red-400">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ----------------- Chat inbox ----------------- */
function ChatInbox() {
  const [convs, setConvs] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("chat_conversations")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(20)
      .then(({ data }) => setConvs(data ?? []));
  }, []);

  return (
    <section className="premium-card rounded-2xl p-6">
      <h2 className="mb-4 text-xl font-bold text-white">Conversaciones recientes del chat</h2>
      {convs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay conversaciones todavía.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {convs.map((c) => (
            <li key={c.id} className="rounded-lg border border-border bg-background/40 p-3">
              <p className="text-white">{c.visitor_name ?? "Visitante anónimo"} <span className="text-muted-foreground">· {new Date(c.created_at).toLocaleString("es-ES")}</span></p>
              <p className="text-xs text-muted-foreground">Estado: {c.status}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
