CREATE POLICY "Public can upload budget attachments"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'site-media' AND (storage.foldername(name))[1] = 'budget-attachments');