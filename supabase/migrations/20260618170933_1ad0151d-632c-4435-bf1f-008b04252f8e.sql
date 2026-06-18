-- Restrict SECURITY DEFINER helpers to authenticated only (needed for RLS evaluation)
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;

-- Strengthen permissive INSERT policies with non-trivial checks
DROP POLICY "Anyone can submit a contact message" ON public.contact_messages;
CREATE POLICY "Anyone can submit a contact message" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 120
    AND char_length(email) BETWEEN 3 AND 255
    AND char_length(message) BETWEEN 1 AND 4000
  );

DROP POLICY "Anyone can submit prayers" ON public.prayers;
CREATE POLICY "Anyone can submit prayers" ON public.prayers
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(text) BETWEEN 1 AND 2000
    AND char_length(name) BETWEEN 1 AND 120
  );

DROP POLICY "Anyone can intercede" ON public.prayer_intercessions;
CREATE POLICY "Anyone can intercede" ON public.prayer_intercessions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(device_id) BETWEEN 8 AND 200
    AND prayer_id IS NOT NULL
  );