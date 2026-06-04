"use client";

import { useState, useCallback } from "react";
import { Bug, Lightbulb, HelpCircle, Send, Trash2, Tag } from "lucide-react";

type FeedbackType = "bug" | "feature" | "other";

interface FeedbackItem {
  id: string;
  type: FeedbackType;
  title: string;
  content: string;
  email: string;
  createdAt: string;
}

const STORAGE_KEY = "sts2-feedback";

const typeConfig: Record<FeedbackType, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
  bug: {
    label: "Bug 报告",
    icon: <Bug className="h-4 w-4" />,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
  feature: {
    label: "功能建议",
    icon: <Lightbulb className="h-4 w-4" />,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
  other: {
    label: "其他",
    icon: <HelpCircle className="h-4 w-4" />,
    color: "text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/30",
  },
};

function loadFeedback(): FeedbackItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FeedbackItem[]) : [];
  } catch {
    return [];
  }
}

function saveFeedback(items: FeedbackItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export default function FeedbackPage() {
  const [items, setItems] = useState<FeedbackItem[]>(() => loadFeedback());
  const [type, setType] = useState<FeedbackType>("feature");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = useCallback(() => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle || !trimmedContent) return;

    const newItem: FeedbackItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      title: trimmedTitle,
      content: trimmedContent,
      email: email.trim(),
      createdAt: new Date().toISOString(),
    };

    const all = loadFeedback();
    all.push(newItem);
    saveFeedback(all);
    setItems(all);
    setTitle("");
    setContent("");
    setEmail("");
    setType("feature");
  }, [type, title, content, email]);

  const handleDelete = useCallback((id: string) => {
    const all = loadFeedback().filter((item) => item.id !== id);
    saveFeedback(all);
    setItems(all);
  }, []);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-100">反馈与建议</h1>
        <span className="rounded-full bg-slate-800 px-3 py-0.5 text-xs text-slate-400">
          {items.length} 条
        </span>
      </div>

      <p className="mb-6 text-sm text-slate-400">
        遇到 Bug 或有新功能想法？欢迎在这里提交反馈。数据仅保存在你的浏览器本地。
      </p>

      {/* Submit Form */}
      <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        {/* Type Select */}
        <div>
          <label className="mb-2 block text-xs font-medium text-slate-500 uppercase">反馈类型</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(typeConfig) as FeedbackType[]).map((t) => {
              const cfg = typeConfig[t];
              const active = type === t;
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    active
                      ? `${cfg.border} ${cfg.bg} ${cfg.color}`
                      : "border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
                  }`}
                >
                  {cfg.icon}
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 uppercase">标题</label>
          <input
            type="text"
            placeholder="简短描述问题或建议..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 uppercase">详细描述</label>
          <textarea
            placeholder="请详细描述你遇到的问题或想提出的建议..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSubmit();
              }
            }}
            rows={4}
            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Email (optional) */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 uppercase">
            联系邮箱 <span className="text-slate-600">(选填)</span>
          </label>
          <input
            type="email"
            placeholder="如有需要可以留下邮箱以便后续联系"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!title.trim() || !content.trim()}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
          提交反馈
        </button>
      </div>

      {/* Feedback List */}
      {items.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-600">
          暂无反馈记录
        </div>
      ) : (
        <div className="space-y-3">
          {[...items].reverse().map((item) => {
            const cfg = typeConfig[item.type];
            return (
              <div
                key={item.id}
                className="group rounded-lg border border-slate-800 bg-slate-900/80 p-4 transition hover:border-slate-700"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium ${cfg.bg} ${cfg.color} ${cfg.border} border`}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </span>
                    <span className="text-sm font-bold text-slate-100">
                      {item.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="opacity-0 transition hover:text-red-400 group-hover:opacity-100 text-slate-600"
                    title="删除"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="mb-2 text-sm leading-relaxed text-slate-300">
                  {item.content}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{formatTime(item.createdAt)}</span>
                  {item.email && (
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {item.email}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
