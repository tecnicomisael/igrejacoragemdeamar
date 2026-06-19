-- Aprovar como Pastor o usuário misaeldigital1@gmail.com (é o e-mail que está sendo usado para login)
WITH u AS (
  SELECT id, COALESCE(raw_user_meta_data->>'full_name', email) AS full_name, email
  FROM auth.users
  WHERE email = 'misaeldigital1@gmail.com'
  LIMIT 1
)
INSERT INTO public.user_roles (user_id, role, full_name)
SELECT id, 'pastor'::app_role, full_name FROM u
ON CONFLICT (user_id, role) DO NOTHING;

UPDATE public.admin_signup_requests
SET status = 'approved', processed_at = now()
WHERE email = 'misaeldigital1@gmail.com' AND status = 'pending';