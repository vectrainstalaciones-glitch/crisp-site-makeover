import { useState } from "react";
import { Paperclip, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type Attachment = { name: string; url: string; size: number; type: string };

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 8;

export function BudgetAttachments({
  value,
  onChange,
  folder,
}: {
  value: Attachment[];
  onChange: (files: Attachment[]) => void;
  folder: string;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (value.length + files.length > MAX_FILES) {
      return toast.error(`Máximo ${MAX_FILES} archivos`);
    }
    setUploading(true);
    const next: Attachment[] = [...value];
    for (const file of Array.from(files)) {
      if (file.size > MAX_SIZE) {
        toast.error(`${file.name} supera 10MB`);
        continue;
      }
      const ext = file.name.split(".").pop() || "bin";
      const path = `budget-attachments/${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("site-media").upload(path, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
      if (error) {
        toast.error(`Error al subir ${file.name}: ${error.message}`);
        continue;
      }
      const { data } = supabase.storage.from("site-media").getPublicUrl(path);
      next.push({ name: file.name, url: data.publicUrl, size: file.size, type: file.type });
    }
    onChange(next);
    setUploading(false);
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div>
      <label className="mb-2.5 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Adjuntar planos / documentos (opcional, máx. 10MB por archivo)
      </label>
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background/40 px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-[#00d2ff] hover:text-white">
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
        <span>{uploading ? "Subiendo…" : "Haz clic o suelta archivos aquí (PDF, imágenes, planos)"}</span>
        <input
          type="file"
          multiple
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.webp,.dwg,.dxf,.doc,.docx,.xls,.xlsx,.zip"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
          disabled={uploading}
        />
      </label>
      {value.length > 0 && (
        <ul className="mt-3 space-y-2">
          {value.map((f, i) => (
            <li key={i} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 px-3 py-2 text-xs">
              <a href={f.url} target="_blank" rel="noreferrer" className="truncate text-white hover:text-[#00d2ff]">
                {f.name} <span className="text-muted-foreground">({(f.size / 1024 / 1024).toFixed(2)} MB)</span>
              </a>
              <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-300">
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
