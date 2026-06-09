import { createClient } from "@supabase/supabase-js";

const isBuildTime = typeof window === "undefined";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  (isBuildTime ? "https://build-placeholder.supabase.co" : "");

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  (isBuildTime ? "build-placeholder" : "");

export const supabase = createClient(supabaseUrl, supabaseKey);
