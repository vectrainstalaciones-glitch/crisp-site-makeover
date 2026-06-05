import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
import { BudgetAttachments, type Attachment } from "@/components/BudgetAttachments";

type CatalogItem = { id: string; concepto: string; descripcion: string | null; categoria: string; sort_order: number };
type RoomItem = { catalog_id: string; concepto: string; cantidad: number };
type Room = { id: string; nombre: string; tipo: string; items: RoomItem[] };

const ROOM_PRESETS = ["Salón", "Cocina", "Habitación", "Baño", "Pasillo", "Zona exterior", "Trastero", "Garaje", "Otro"];

const clientSchema = z.object({
  nombre: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  telefono: z.string().trim().min(6).max(30),
  direccion: z.string().trim().min(5).max(255),
});

export const Route = createFileRoute("/presupuestos/vivienda")({
  head: () => ({
    meta: [
      { title: "Presupuesto online vivienda | Vectra" },
      { name: "description", content: "Crea tu presupuesto online estancia por estancia para la instalación eléctrica de tu vivienda." },
    ],
  }),
  component: Page,
});

function Page() {
  const nav = useNavigate();
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  useEffect(() => {
    supabase
      .from("catalog_items")
      .select("id, concepto, descripcion, categoria, sort_order")
      .eq("activo", true)
      .order("sort_order")
      .then(({ data }) => setCatalog((data ?? []) as CatalogItem[]));
  }, []);

  const addRoom = (tipo: string) => {
    const count = rooms.filter((r) => r.tipo === tipo).length + 1;
    setRooms([
      ...rooms,
      { id: crypto.randomUUID(), tipo, nombre: tipo === "Otro" ? "Estancia" : `${tipo}${count > 1 ? ` ${count}` : ""}`, items: [] },
    ]);
  };

  const removeRoom = (id: string) => setRooms(rooms.filter((r) => r.id !== id));
  const renameRoom = (id: string, nombre: string) => setRooms(rooms.map((r) => (r.id === id ? { ...r, nombre } : r)));

  const setItemQty = (roomId: string, catalog_id: string, concepto: string, cantidad: number) => {
    setRooms(
      rooms.map((r) => {
        if (r.id !== roomId) return r;
        const exists = r.items.find((i) => i.catalog_id === catalog_id);
        let items: RoomItem[];
        if (cantidad <= 0) items = r.items.filter((i) => i.catalog_id !== catalog_id);
        else if (exists) items = r.items.map((i) => (i.catalog_id === catalog_id ? { ...i, cantidad } : i));
        else items = [...r.items, { catalog_id, concepto, cantidad }];
        return { ...r, items };
      }),
    );
  };

  const totalItems = rooms.reduce((s, r) => s + r.items.reduce((a, b) => a + b.cantidad, 0), 0);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = clientSchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) return toast.error("Revisa los datos personales");
    if (rooms.length === 0) return toast.error("Añade al menos una estancia");
    if (totalItems === 0) return toast.error("Selecciona al menos un elemento");
    setSubmitting(true);
    const { nombre, email, telefono, direccion } = parsed.data;
    const { error } = await supabase.from("budget_requests").insert({
      nombre, email, telefono, direccion,
      empresa: null,
      mensaje: `Solicitud presupuesto online (${rooms.length} estancias, ${totalItems} elementos)`,
      tipo: "vivienda",
      status: "pendiente_revision",
      payload: { rooms, attachments } as any,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Solicitud enviada. Te enviaremos el presupuesto por email.");
    nav({ to: "/presupuestos" });
  };

  return (
    <SiteLayout>
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Link to="/presupuestos" className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-white">
            <ArrowLeft className="h-3 w-3" /> Volver
          </Link>
          <h1 className="mb-3 text-3xl font-black text-white sm:text-4xl">Presupuesto online vivienda</h1>
          <div className="mb-10 space-y-3 rounded-2xl border border-border bg-card/30 p-5 text-sm leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-white">Cómo funciona:</strong> primero haz un recuento de las
              estancias de tu vivienda (salón, cocina, habitaciones, baños, zonas exteriores…).
            </p>
            <p>
              A continuación, en cada estancia indica qué elementos necesitas (puntos de luz,
              enchufes, tomas de datos, TV, etc.) y las unidades.
            </p>
            <p>
              Nuestro equipo técnico revisará tu solicitud, aplicará nuestros precios y te enviará
              el presupuesto final por email.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-8">
            {/* Datos del cliente */}
            <div className="premium-card rounded-2xl p-6">
              <h2 className="mb-4 text-lg font-bold text-white">1. Tus datos</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre completo" name="nombre" required />
                <Field label="Email" name="email" type="email" required />
                <Field label="Teléfono" name="telefono" type="tel" required />
                <Field label="Dirección de la vivienda" name="direccion" required />
              </div>
              <div className="mt-6">
                <BudgetAttachments value={attachments} onChange={setAttachments} folder="vivienda" />
              </div>
            </div>

            {/* Estancias */}
            <div className="premium-card rounded-2xl p-6">
              <h2 className="mb-2 text-lg font-bold text-white">2. Estancias</h2>
              <p className="mb-4 text-xs text-muted-foreground">Añade cada estancia que quieras incluir en el presupuesto.</p>
              <div className="flex flex-wrap gap-2">
                {ROOM_PRESETS.map((t) => (
                  <button
                    key={t} type="button" onClick={() => addRoom(t)}
                    className="flex items-center gap-1 rounded-lg border border-border bg-background/60 px-3 py-1.5 text-xs text-white transition hover:border-[#00d2ff] hover:text-[#00d2ff]"
                  >
                    <Plus className="h-3 w-3" /> {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Items per room */}
            {rooms.map((room) => (
              <div key={room.id} className="premium-card rounded-2xl p-6">
                <div className="mb-4 flex items-center gap-3">
                  <input
                    value={room.nombre}
                    onChange={(e) => renameRoom(room.id, e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-base font-bold text-white"
                  />
                  <button type="button" onClick={() => removeRoom(room.id)} className="rounded-lg border border-red-500/30 p-2 text-red-400 hover:bg-red-500/10">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-2">
                  {catalog.map((c) => {
                    const item = room.items.find((i) => i.catalog_id === c.id);
                    const qty = item?.cantidad ?? 0;
                    return (
                      <div key={c.id} className="flex max-w-full flex-col gap-3 overflow-hidden rounded-lg border border-border/60 bg-background/40 p-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="break-words text-sm leading-snug text-white">{c.concepto}</p>
                          {c.descripcion && <p className="break-words text-[11px] leading-relaxed text-muted-foreground">{c.descripcion}</p>}
                        </div>
                        <div className="flex w-full max-w-full items-center justify-end gap-2 self-stretch lg:w-auto lg:self-auto lg:pl-4">
                          <button type="button" onClick={() => setItemQty(room.id, c.id, c.concepto, Math.max(0, qty - 1))}
                            className="h-8 w-8 shrink-0 rounded-md border border-border text-white hover:bg-card">−</button>
                          <input
                            type="number" min={0} value={qty}
                            onChange={(e) => setItemQty(room.id, c.id, c.concepto, Math.max(0, parseInt(e.target.value || "0", 10)))}
                            className="h-8 w-16 min-w-0 rounded-md border border-border bg-background px-2 py-1 text-center text-sm text-white"
                          />
                          <button type="button" onClick={() => setItemQty(room.id, c.id, c.concepto, qty + 1)}
                            className="h-8 w-8 shrink-0 rounded-md border border-border text-white hover:bg-card">+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between rounded-2xl border border-border bg-card/40 p-5">
              <div>
                <p className="text-sm text-white">{rooms.length} estancia(s) · {totalItems} elemento(s)</p>
                <p className="text-xs text-muted-foreground">Los precios los aplicará nuestro equipo y te llegarán por email.</p>
              </div>
              <button type="submit" disabled={submitting}
                className="glow-button rounded-xl bg-[#0046ff] px-8 py-3 text-sm font-bold uppercase tracking-wide text-white">
                Enviar solicitud
              </button>
            </div>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field(props: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{props.label}</label>
      <input
        type={props.type ?? "text"} name={props.name} required={props.required} maxLength={255}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-white outline-none focus:border-[#00d2ff]"
      />
    </div>
  );
}
