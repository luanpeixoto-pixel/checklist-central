import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type AppRole = "admin" | "user";

export const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = useCallback(async () => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user role:", error);
        setRole(null);
      } else {
        setRole((data?.role as AppRole) || null);
      }
    } catch (err) {
      console.error("Error fetching user role:", err);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Only fetch role after auth loading is complete
    if (!authLoading) {
      fetchRole();
    }
  }, [authLoading, fetchRole]);

  const isAdmin = role === "admin";

  return {
    role,
    isAdmin,
    loading: authLoading || loading,
  };
};
