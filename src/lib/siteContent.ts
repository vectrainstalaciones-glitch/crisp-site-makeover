import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSiteContent<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("site_content")
      .select("value")
      .eq("key", key)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setValue(data.value as T);
        setLoaded(true);
      });
  }, [key]);

  return { value, loaded };
}

export async function saveSiteContent(key: string, value: unknown) {
  const { error } = await supabase
    .from("site_content")
    .upsert({ key, value: value as any, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw error;
}
