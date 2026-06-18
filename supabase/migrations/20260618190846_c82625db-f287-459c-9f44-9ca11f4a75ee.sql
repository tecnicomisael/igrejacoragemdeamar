CREATE TABLE public.site_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page text NOT NULL,
  key text NOT NULL,
  type text NOT NULL DEFAULT 'text',
  value text NOT NULL DEFAULT '',
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid,
  UNIQUE (page, key)
);

GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site content"
  ON public.site_content FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert site content"
  ON public.site_content FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update site content"
  ON public.site_content FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete site content"
  ON public.site_content FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.touch_site_content_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.touch_site_content_updated_at();

-- Storage policies for site-images
CREATE POLICY "Public can read site images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'site-images');

CREATE POLICY "Admins can upload site images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update site images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete site images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-images' AND public.is_admin(auth.uid()));