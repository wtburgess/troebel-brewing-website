-- Earlier policies used `auth.jwt() ->> 'email'` which works against
-- public.* tables but is not reliable inside storage-api's RLS context,
-- causing "new row violates row-level security policy" on upload.
-- auth.uid() always resolves from request.jwt.claim.sub, so we switch to a
-- uid allowlist. Also adds the SELECT policy that upsert: true needs.

DROP POLICY IF EXISTS "Admin insert beer-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update beer-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete beer-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin select beer-images" ON storage.objects;

CREATE POLICY "Admin insert beer-images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'beer-images'
    AND auth.uid() IN ('da1a7358-01e5-43e3-8ae9-f485f7135d07'::uuid)
  );

CREATE POLICY "Admin select beer-images"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'beer-images'
    AND auth.uid() IN ('da1a7358-01e5-43e3-8ae9-f485f7135d07'::uuid)
  );

CREATE POLICY "Admin update beer-images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'beer-images'
    AND auth.uid() IN ('da1a7358-01e5-43e3-8ae9-f485f7135d07'::uuid)
  )
  WITH CHECK (
    bucket_id = 'beer-images'
    AND auth.uid() IN ('da1a7358-01e5-43e3-8ae9-f485f7135d07'::uuid)
  );

CREATE POLICY "Admin delete beer-images"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'beer-images'
    AND auth.uid() IN ('da1a7358-01e5-43e3-8ae9-f485f7135d07'::uuid)
  );
