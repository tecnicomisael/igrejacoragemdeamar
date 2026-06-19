import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

async function withTimeout<T>(promise: PromiseLike<T>, ms = 6000): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Tempo limite ao verificar sessão")), ms);
  });
  try {
    return await Promise.race([Promise.resolve(promise), timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    try {
      const { data, error } = await withTimeout(supabase.auth.getSession(), 4000);
      const user = data.session?.user;
      if (error || !user) {
        throw redirect({ to: "/auth" });
      }
      const { data: role, error: roleError } = await withTimeout(
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle(),
        6000,
      );
      if (roleError || !role) {
        throw redirect({ to: "/auth" });
      }
      return { user, role: role.role };
    } catch {
      throw redirect({ to: "/auth" });
    }
  },
  component: () => <Outlet />,
});
