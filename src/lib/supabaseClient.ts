console.log("🔥 supabaseClient.ts foi carregado");
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// NOTE:
// In some preview/build scenarios, Vite env vars can fail to inject, causing
// `supabaseUrl is required`. To keep the app working, we provide safe fallbacks.
// The URL and anon key are public (publishable) values.

const env = import.meta.env as unknown as Record<string, string | undefined>;

const SUPABASE_URL =
  env.VITE_SUPABASE_URL ||
  // Some setups might expose non-VITE keys (not typical on Vite, but harmless to try)
  env.SUPABASE_URL ||
  // Final fallback (publishable URL)
  "https://iocfocbvdkggiigfknbc.supabase.co";

const SUPABASE_ANON_KEY =
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  env.SUPABASE_PUBLISHABLE_KEY ||
  // Final fallback (publishable anon key)
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvY2ZvY2J2ZGtnZ2lpZ2ZrbmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNTI5MTIsImV4cCI6MjA4NTYyODkxMn0.WaB8Jwr-9KllanoAE7cqECzMjVndAelzQge_idcDFIM";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
