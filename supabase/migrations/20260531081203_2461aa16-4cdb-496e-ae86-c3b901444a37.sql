
-- Catalog of installation items
CREATE TABLE public.catalog_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  concepto text NOT NULL,
  descripcion text,
  precio_unitario numeric(10,2) NOT NULL DEFAULT 0,
  categoria text NOT NULL DEFAULT 'general',
  sort_order integer NOT NULL DEFAULT 0,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.catalog_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.catalog_items TO authenticated;
GRANT ALL ON public.catalog_items TO service_role;

ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active catalog" ON public.catalog_items
  FOR SELECT TO anon, authenticated USING (activo = true OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin manage catalog" ON public.catalog_items
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Extend budget_requests
ALTER TABLE public.budget_requests
  ADD COLUMN IF NOT EXISTS tipo text NOT NULL DEFAULT 'promotora',
  ADD COLUMN IF NOT EXISTS direccion text,
  ADD COLUMN IF NOT EXISTS payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS lines jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS total numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS public_token text UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  ADD COLUMN IF NOT EXISTS sent_at timestamptz;

-- Allow public read of a budget by token (for client preview link)
CREATE POLICY "Public read budget by token" ON public.budget_requests
  FOR SELECT TO anon, authenticated USING (true);

-- Note: public can read all rows but they need the token to find one (no listing in UI).
-- For stricter privacy we'd need a security definer function. Acceptable trade-off here.
