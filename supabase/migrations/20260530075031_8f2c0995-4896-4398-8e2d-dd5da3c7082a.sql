
-- Restrict has_role execute
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;

-- Drop public listing of storage objects; direct URL access still works for public bucket
DROP POLICY IF EXISTS "Public read site-media" ON storage.objects;
