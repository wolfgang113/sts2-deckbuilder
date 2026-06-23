import { supabase } from "./supabase";

function generateSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("sts2-session-id");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("sts2-session-id", id);
  }
  return id;
}

export async function trackPageView(path?: string): Promise<void> {
  if (typeof window === "undefined") return;

  // Avoid tracking the same path repeatedly within the same session immediately
  const currentPath = path ?? window.location.pathname + window.location.search;
  const lastPath = sessionStorage.getItem("sts2-last-tracked-path");
  if (lastPath === currentPath) return;
  sessionStorage.setItem("sts2-last-tracked-path", currentPath);

  try {
    await supabase.from("page_views").insert({
      path: currentPath,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      session_id: generateSessionId(),
    });
  } catch {
    // ignore tracking errors
  }
}

export interface PageViewStats {
  total: number;
  today: number;
  yesterday: number;
  thisWeek: number;
  thisMonth: number;
  topPaths: { path: string; count: number }[];
}

export async function getPageViewStats(): Promise<PageViewStats> {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    totalRes,
    todayRes,
    yesterdayRes,
    weekRes,
    monthRes,
    topPathsRes,
  ] = await Promise.all([
    supabase.from("page_views").select("*", { count: "exact", head: true }),
    supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", todayStart),
    supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", yesterdayStart).lt("created_at", todayStart),
    supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", weekStart),
    supabase.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", monthStart),
    supabase.rpc("get_top_paths", { limit_count: 10 }),
  ]);

  let topPaths: { path: string; count: number }[] = [];
  if (topPathsRes.error) {
    // Fallback if RPC doesn't exist
    const { data, error } = await supabase
      .from("page_views")
      .select("path")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (!error && data) {
      const counts: Record<string, number> = {};
      data.forEach((row) => {
        counts[row.path] = (counts[row.path] || 0) + 1;
      });
      topPaths = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([path, count]) => ({ path, count }));
    }
  } else if (topPathsRes.data) {
    topPaths = topPathsRes.data as { path: string; count: number }[];
  }

  return {
    total: totalRes.count ?? 0,
    today: todayRes.count ?? 0,
    yesterday: yesterdayRes.count ?? 0,
    thisWeek: weekRes.count ?? 0,
    thisMonth: monthRes.count ?? 0,
    topPaths,
  };
}
