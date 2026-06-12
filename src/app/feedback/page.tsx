"use client";

import { useState, useEffect, useCallback } from "react";
import { Bug, Lightbulb, HelpCircle, Send, Trash2, Tag, MessageCircle, User } from "lucide-react";
import { getCurrentUser, type AuthUser } from "@/lib/auth";
import {
  submitFeedback,
  submitReply,
  getFeedbackWithReplies,
  deleteFeedback,
  deleteFeedbackReply,
  type FeedbackType,
  type FeedbackWithReplies,
} from "@/lib/supabaseFeedback";

type FeedbackTypeConfig = {
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
};

const typeConfig: Record<FeedbackType, FeedbackTypeConfig> = {
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

const adminUserId = process.env.NEXT_PUBLIC_ADMIN_USER_ID;

export default function FeedbackPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [items, setItems] = useState<FeedbackWithReplies[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<FeedbackType>("feature");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");

  const isAdmin = user ? (adminUserId ? user.id === adminUserId : false) : false;

  const loadFeedback = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFeedbackWithReplies();
      setItems(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "加载反馈失败";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCurrentUser().then(setUser);
    const timeout = setTimeout(() => {
      loadFeedback();
    }, 0);
    return () => clearTimeout(timeout);
  }, [loadFeedback]);

  const handleSubmit = useCallback(async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle || !trimmedContent) return;

    setSubmitting(true);
    try {
      await submitFeedback({
        type,
        title: trimmedTitle,
        content: trimmedContent,
        email: email.trim(),
      });
      await loadFeedback();
      setTitle("");
      setContent("");
      setEmail("");
      setType("feature");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "提交失败";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  }, [type, title, content, email, loadFeedback]);

  const handleDelete = async (id: string) => {
    if (!confirm("确定删除这条反馈吗？")) return;
    await deleteFeedback(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeleteReply = async (feedbackId: string, replyId: string) => {
    if (!confirm("确定删除这条回复吗？")) return;
    await deleteFeedbackReply(replyId);
    setItems((prev) =>
      prev.map((item) =>
        item.id === feedbackId
          ? { ...item, replies: item.replies.filter((r) => r.id !== replyId) }
          : item
      )
    );
  };

  const handleReply = async (feedbackId: string, content: string) => {
    await submitReply({ feedbackId, content, isAdmin: isAdmin });
    await loadFeedback();
  };

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
        遇到 Bug 或有新功能想法？欢迎在这里提交反馈。所有反馈会公开显示，管理员会进行回复。
      </p>

      {/* Submit Form */}
      <div className="mb-8 space-y-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase text-slate-500">反馈类型</label>
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

        <div>
          <label className="mb-1 block text-xs font-medium uppercase text-slate-500">标题</label>
          <input
            type="text"
            placeholder="简短描述问题或建议..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium uppercase text-slate-500">详细描述</label>
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

        <div>
          <label className="mb-1 block text-xs font-medium uppercase text-slate-500">
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

        <button
          onClick={handleSubmit}
          disabled={!title.trim() || !content.trim() || submitting}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {submitting ? "提交中..." : "提交反馈"}
        </button>
      </div>

      {/* Feedback List */}
      {loading ? (
        <div className="py-12 text-center text-sm text-slate-600">加载中...</div>
      ) : error ? (
        <div className="py-12 text-center text-sm text-red-400">{error}</div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-600">暂无反馈，来提交第一条吧</div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const cfg = typeConfig[item.type];
            return (
              <FeedbackCard
                key={item.id}
                item={item}
                typeConfig={cfg}
                user={user}
                isAdmin={isAdmin}
                formatTime={formatTime}
                onDelete={handleDelete}
                onReply={handleReply}
                onDeleteReply={handleDeleteReply}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function FeedbackCard({
  item,
  typeConfig,
  user,
  isAdmin,
  formatTime,
  onDelete,
  onReply,
  onDeleteReply,
}: {
  item: FeedbackWithReplies;
  typeConfig: FeedbackTypeConfig;
  user: AuthUser | null;
  isAdmin: boolean;
  formatTime: (iso: string) => string;
  onDelete: (id: string) => void;
  onReply: (feedbackId: string, content: string) => Promise<void>;
  onDeleteReply: (feedbackId: string, replyId: string) => void;
}) {
  const [replyContent, setReplyContent] = useState("");
  const [replying, setReplying] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplySubmit = async () => {
    const trimmed = replyContent.trim();
    if (!trimmed) return;
    setReplying(true);
    try {
      await onReply(item.id, trimmed);
      setReplyContent("");
      setShowReplyForm(false);
    } finally {
      setReplying(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 transition hover:border-slate-700">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-medium ${typeConfig.bg} ${typeConfig.color} ${typeConfig.border}`}
          >
            {typeConfig.icon}
            {typeConfig.label}
          </span>
          <span className="text-sm font-bold text-slate-100">{item.title}</span>
        </div>
        {isAdmin && (
          <button
            onClick={() => onDelete(item.id)}
            className="text-slate-600 transition hover:text-red-400"
            title="删除"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <p className="mb-3 text-sm leading-relaxed text-slate-300">{item.content}</p>

      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {item.display_name || item.email || "匿名用户"}
        </span>
        <span>{formatTime(item.created_at)}</span>
        {item.email && (
          <span className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {item.email}
          </span>
        )}
      </div>

      {/* Replies */}
      {item.replies.length > 0 && (
        <div className="mb-4 space-y-3 border-t border-slate-800 pt-4">
          {item.replies.map((reply) => (
            <div key={reply.id} className="rounded-lg bg-slate-950/50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-300">
                    {reply.display_name || "用户"}
                  </span>
                  {reply.is_admin && (
                    <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
                      管理员
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">{formatTime(reply.created_at)}</span>
                  {isAdmin && (
                    <button
                      onClick={() => onDeleteReply(item.id, reply.id)}
                      className="text-slate-600 transition hover:text-red-400"
                      title="删除"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-400">{reply.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reply Form */}
      {user ? (
        showReplyForm ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={isAdmin ? "以管理员身份回复..." : "写下你的回复..."}
              rows={2}
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReplyForm(false)}
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-700"
              >
                取消
              </button>
              <button
                onClick={handleReplySubmit}
                disabled={!replyContent.trim() || replying}
                className="flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                {replying ? "回复中..." : "回复"}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowReplyForm(true)}
            className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-400 transition hover:text-amber-400"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {item.replies.length > 0 ? "继续回复" : "回复"}
          </button>
        )
      ) : (
        <p className="mt-2 text-xs text-slate-600">登录后可回复</p>
      )}
    </div>
  );
}
