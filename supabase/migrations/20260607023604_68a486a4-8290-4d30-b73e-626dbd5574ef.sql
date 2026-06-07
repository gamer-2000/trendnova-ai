
DROP POLICY IF EXISTS "Authenticated users can insert feedback" ON public.feedback;
CREATE POLICY "Authenticated users can insert feedback" ON public.feedback
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND length(trim(name)) BETWEEN 1 AND 100
    AND length(trim(comment)) BETWEEN 1 AND 2000
    AND rating BETWEEN 1 AND 5
  );
