"use client";

import { useState, useCallback } from "react";
import { MessageSquare, Send, Trash2, User } from "lucide-react";

interface Comment {
  id: string;
  deckKey: string;
  author: string;
  content: string;
  createdAt: string;
}

const STORAGE_KEY = "sts2-comments";

function loadComments(): Comment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Comment[]) : [];
  } catch {
    return [];
  }
}

function saveComments(comments: Comment[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

interface CommentSectionProps {
  deckKey: string;
}

export default function CommentSection({ deckKey }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(() =>
    loadComments().filter((c) => c.deckKey === deckKey)
  );
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = useCallback(() => {
    const trimmedAuthor = author.trim();
    const trimmedContent = content.trim();
    if (!trimmedAuthor || !trimmedContent) return;

    const newComment: Comment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      deckKey,
      author: trimmedAuthor,
      content: trimmedContent,
      createdAt: new Date().toISOString(),
    };

    const all = loadComments();
    all.push(newComment);
    saveComments(all);
    setComments(all.filter((c) => c.deckKey === deckKey));
    setContent("");
  }, [author, content, deckKey]);

  const handleDelete = useCallback(
    (id: string) => {
      const all = loadComments().filter((c) => c.id !== id);
      saveComments(all);
      setComments(all.filter((c) => c.deckKey === deckKey));
    },
    [deckKey]
  );

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-amber-400" />
        <h2 className="text-lg font-bold text-slate-100">卡组评论</h2>
        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
          {comments.length}
        </span>
      </div>

      {/* Input */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="你的昵称"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <textarea
            placeholder="写下你对这个卡组的评价或建议..."
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
            disabled={!author.trim() || !content.trim()}
            className="flex shrink-0 items-center gap-1 self-end rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            发送
          </button>
        </div>
      </div>

      {/* List */}
      {comments.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-600">
          暂无评论，来发表第一条吧
        </div>
      ) : (
        <div className="space-y-3">
          {[...comments].reverse().map((comment) => (
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
                    {comment.author}
                  </span>
                  <span className="text-xs text-slate-600">
                    {formatTime(comment.createdAt)}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="opacity-0 transition hover:text-red-400 group-hover:opacity-100 text-slate-600"
                  title="删除"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
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
