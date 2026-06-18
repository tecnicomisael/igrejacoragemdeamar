import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (error || !user) {
      throw redirect({ to: "/auth" });
    }
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!role) {
      throw redirect({ to: "/auth" });
    }
    return { user, role: role.role };
  },
  component: () => <Outlet />,
});
