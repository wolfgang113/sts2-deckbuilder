"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/supabaseAnalytics";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const path = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    trackPageView(path);
  }, [pathname, searchParams]);

  return null;
}
