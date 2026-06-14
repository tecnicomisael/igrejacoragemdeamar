
CREATE TABLE public.prayers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Anônimo',
  text TEXT NOT NULL CHECK (char_length(text) BETWEEN 1 AND 1000),
  anonymous BOOLEAN NOT NULL DEFAULT false,
  count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX prayers_created_at_idx ON public.prayers (created_at DESC);

GRANT SELECT, INSERT ON public.prayers TO anon;
GRANT SELECT, INSERT ON public.prayers TO authenticated;
GRANT ALL ON public.prayers TO service_role;

ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read prayers" ON public.prayers FOR SELECT USING (true);
CREATE POLICY "Anyone can submit prayers" ON public.prayers FOR INSERT WITH CHECK (true);

CREATE TABLE public.prayer_intercessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prayer_id UUID NOT NULL REFERENCES public.prayers(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (prayer_id, device_id)
);

GRANT SELECT, INSERT ON public.prayer_intercessions TO anon;
GRANT SELECT, INSERT ON public.prayer_intercessions TO authenticated;
GRANT ALL ON public.prayer_intercessions TO service_role;

ALTER TABLE public.prayer_intercessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read intercessions" ON public.prayer_intercessions FOR SELECT USING (true);
CREATE POLICY "Anyone can intercede" ON public.prayer_intercessions FOR INSERT WITH CHECK (true);

-- Trigger increments prayers.count when a new intercession is inserted.
CREATE OR REPLACE FUNCTION public.increment_prayer_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.prayers SET count = count + 1 WHERE id = NEW.prayer_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER prayer_intercessions_increment
AFTER INSERT ON public.prayer_intercessions
FOR EACH ROW EXECUTE FUNCTION public.increment_prayer_count();
