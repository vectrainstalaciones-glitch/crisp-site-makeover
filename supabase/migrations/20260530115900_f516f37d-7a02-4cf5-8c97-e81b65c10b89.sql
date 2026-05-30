
-- Visitas
CREATE TABLE public.page_visits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  path text NOT NULL DEFAULT '/',
  referrer text,
  user_agent text,
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_page_visits_created_at ON public.page_visits(created_at DESC);

GRANT INSERT ON public.page_visits TO anon, authenticated;
GRANT SELECT ON public.page_visits TO authenticated;
GRANT ALL ON public.page_visits TO service_role;

ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert visits"
  ON public.page_visits FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read visits"
  ON public.page_visits FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Solicitudes de presupuesto
CREATE TABLE public.budget_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre text NOT NULL,
  empresa text,
  email text NOT NULL,
  telefono text,
  mensaje text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_budget_requests_created_at ON public.budget_requests(created_at DESC);

GRANT INSERT ON public.budget_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.budget_requests TO authenticated;
GRANT ALL ON public.budget_requests TO service_role;

ALTER TABLE public.budget_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit budget request"
  ON public.budget_requests FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins read budget requests"
  ON public.budget_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update budget requests"
  ON public.budget_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete budget requests"
  ON public.budget_requests FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
