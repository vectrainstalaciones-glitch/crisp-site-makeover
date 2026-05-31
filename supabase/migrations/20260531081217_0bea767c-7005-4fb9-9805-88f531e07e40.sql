
DROP POLICY IF EXISTS "Public read budget by token" ON public.budget_requests;

CREATE OR REPLACE FUNCTION public.get_budget_by_token(_token text)
RETURNS public.budget_requests
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.budget_requests WHERE public_token = _token LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_budget_by_token(text) TO anon, authenticated;
