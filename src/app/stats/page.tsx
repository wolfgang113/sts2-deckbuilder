"use client";

import { useState, useEffect } from "react";
import { getCurrentUser, type AuthUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getPageViewStats, type PageViewStats } from "@/lib/supabaseAnalytics";
import { BarChart3, Eye, TrendingUp, Calendar, Globe, Lock } from "lucide-react";

export default function StatsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<PageViewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getCurrentUser().then((u) => {
      if (cancelled) return;
      setUser(u);
      if (!u) {
        setLoading(false);
        return;
      }
      supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", u.id)
        .single()
        .then(({ data }) => {
          if (cancelled) return;
          const admin = data?.is_admin === true;
          setIsAdmin(admin);
          if (!admin) {
            setLoading(false);
            return;
          }
          getPageViewStats().then((statsData) => {
            if (cancelled) return;
            setStats(statsData);
            setLoading(false);
          });
        });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-slate-400">
        <BarChart3 className="mx-auto mb-4 h-12 w-12 text-slate-600" />
        <p className="mb-4">请登录后查看统计数据</p>
        <a
          href="/login"
          className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
        >
          去登录
        </a>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-slate-400">
        <Lock className="mx-auto mb-4 h-12 w-12 text-slate-600" />
        <p>你没有权限查看此页面</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-slate-700 border-t-amber-500" />
        <p className="text-slate-500">加载中...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-slate-400">
        <p>暂无数据</p>
      </div>
    );
  }

  const cards = [
    { label: "总浏览量", value: stats.total, icon: Eye },
    { label: "今日", value: stats.today, icon: Calendar },
    { label: "昨日", value: stats.yesterday, icon: TrendingUp },
    { label: "近7天", value: stats.thisWeek, icon: Calendar },
    { label: "本月", value: stats.thisMonth, icon: Globe },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <BarChart3 className="h-7 w-7 text-amber-400" />
        <h1 className="text-2xl font-bold text-slate-100">网站访问统计</h1>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
          >
            <card.icon className="mb-2 h-5 w-5 text-slate-500" />
            <p className="text-xs text-slate-500">{card.label}</p>
            <p className="text-xl font-bold text-slate-100">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-100">热门页面</h2>
        {stats.topPaths.length === 0 ? (
          <p className="text-sm text-slate-500">暂无页面数据</p>
        ) : (
          <div className="space-y-2">
            {stats.topPaths.map((item, index) => (
              <div
                key={item.path}
                className="flex items-center justify-between rounded-lg bg-slate-800/50 px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs text-slate-300">
                    {index + 1}
                  </span>
                  <span className="truncate text-sm text-slate-300">{item.path}</span>
                </div>
                <span className="shrink-0 text-sm font-medium text-slate-100">{item.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
