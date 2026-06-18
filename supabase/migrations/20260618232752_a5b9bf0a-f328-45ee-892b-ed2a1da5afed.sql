
-- Aprovar manualmente o pedido pendente de tecnicomisael1@gmail.com
WITH req AS (
  SELECT id, user_id, full_name
  FROM public.admin_signup_requests
  WHERE email = 'tecnicomisael1@gmail.com' AND status = 'pending'
  LIMIT 1
)
INSERT INTO public.user_roles (user_id, role, full_name)
SELECT user_id, 'pastor'::app_role, full_name FROM req
ON CONFLICT (user_id, role) DO NOTHING;

UPDATE public.admin_signup_requests
SET status = 'approved', processed_at = now()
WHERE email = 'tecnicomisael1@gmail.com' AND status = 'pending';
