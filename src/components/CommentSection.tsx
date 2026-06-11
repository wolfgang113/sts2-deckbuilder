"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getComments,
  addComment,
  deleteCloudComment,
  type CloudComment,
} from "@/lib/supabaseComments";
import { getCurrentUser, type AuthUser } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";
import { MessageSquare, Send, Trash2, User } from "lucide-react";

interface CommentSectionProps {
  deckId: string;
}

export default function CommentSection({ deckId }: CommentSectionProps) {
  const { t } = useTranslation();
  const [comments, setComments] = useState<CloudComment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    loadComments();
    getCurrentUser().then(setUser);
  }, [deckId]);

  const loadComments = async () => {
    try {
      const data = await getComments(deckId);
      setComments(data);
    } catch {
      // ignore
    }
  };

  const handleSubmit = useCallback(async () => {
    const trimmed = content.trim();
    if (!trimmed || !user) return;

    setLoading(true);
    try {
      await addComment(deckId, trimmed);
      await loadComments();
      setContent("");
    } catch {
      alert(t.comments_error);
    } finally {
      setLoading(false);
    }
  }, [content, deckId, user]);

  const handleDelete = useCallback(
    async (commentId: string) => {
      await deleteCloudComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    },
    []
  );

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-amber-400" />
        <h2 className="text-lg font-bold text-slate-100">{t.comments_title}</h2>
        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
          {comments.length}
        </span>
      </div>

      {/* Input */}
      {user ? (
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20">
              <User className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <span>{user.displayName || user.email.split("@")[0]}</span>
          </div>
          <div className="flex gap-2">
            <textarea
              placeholder={t.comments_placeholder}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleSubmit();
                }
              }}
              rows={3}
              className="flex-1 resize-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
            />
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || loading}
              className="flex shrink-0 items-center gap-1 self-end rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              {t.comments_send}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-lg border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-500">
          {t.comments_login_hint}
        </div>
      )}

      {/* List */}
      {comments.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-600">
          {t.comments_empty}
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="group rounded-lg border border-slate-800 bg-slate-900/80 p-4 transition hover:border-slate-700"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800">
                    <User className="h-3 w-3 text-slate-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-200">
                    {comment.display_name || "匿名用户"}
                  </span>
                  <span className="text-xs text-slate-600">
                    {formatTime(comment.created_at)}
                  </span>
                </div>
                {user?.id === comment.user_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="opacity-0 transition hover:text-red-400 group-hover:opacity-100 text-slate-600"
                    title="删除"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
