"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { characters } from "@/data/cards";
import { supabase } from "@/lib/supabase";
import { getCurrentUser, type AuthUser } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";
import {
  incrementViewCount,
  toggleLike,
  deleteGuide,
  type Guide,
} from "@/lib/supabaseGuides";
import {
  ArrowLeft,
  User,
  Heart,
  Eye,
  Edit2,
  Trash2,
  X,
} from "lucide-react";

const adminUserId = process.env.NEXT_PUBLIC_ADMIN_USER_ID;

interface GuideDetailProps {
  guide: Guide;
  onBack?: () => void;
}

export default function GuideDetail({ guide, onBack }: GuideDetailProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [currentGuide, setCurrentGuide] = useState<Guide>(guide);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [liking, setLiking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  useEffect(() => {
    const trackView = async () => {
      try {
        await incrementViewCount(currentGuide.id);
        setCurrentGuide((prev) => ({ ...prev, view_count: prev.view_count + 1 }));
      } catch (e) {
        console.error("增加浏览量失败:", e);
      }
    };
    trackView();
  }, [currentGuide.id]);

  useEffect(() => {
    if (!user) return;

    const checkLike = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      const { data } = await supabase
        .from("guide_likes")
        .select("guide_id")
        .eq("guide_id", currentGuide.id)
        .eq("user_id", userData.user.id)
        .maybeSingle();
      setIsLiked(!!data);
    };

    checkLike();
  }, [user, currentGuide.id]);

  const handleLike = async () => {
    if (!user) {
      alert(t.guides_login_to_like);
      return;
    }
    setLiking(true);
    try {
      const liked = await toggleLike(currentGuide.id);
      setIsLiked(liked);
      setCurrentGuide((prev) => ({
        ...prev,
        likes_count: prev.likes_count + (liked ? 1 : -1),
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.guides_error;
      alert(msg);
    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteGuide(currentGuide.id);
      router.push("/guides");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.guides_error;
      alert(msg);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const isOwner = user?.id === currentGuide.user_id;
  const isAdmin = user ? (adminUserId ? user.id === adminUserId : false) : false;

  const charInfo = characters.find((c) => c.id === currentGuide.character);
  const charName = charInfo?.name ?? t.guides_general;
  const charColor = charInfo?.color ?? "#94a3b8";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <button
        onClick={onBack ?? (() => router.push("/guides"))}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-slate-200"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.guides_back}
      </button>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 md:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: charColor }}
            />
            {charName}
          </span>
          {currentGuide.tags.map((tag, i) => (
            <span
              key={i}
              className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="mb-4 text-2xl font-bold text-slate-100 md:text-3xl">
          {currentGuide.title}
        </h1>

        <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-slate-800 pb-6 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {currentGuide.display_name ?? t.plaza_anonymous}
          </span>
          <span>{new Date(currentGuide.created_at).toLocaleDateString("zh-CN")}</span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {currentGuide.view_count}
          </span>
          <button
            onClick={handleLike}
            disabled={liking}
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition ${
              isLiked
                ? "bg-rose-500/10 text-rose-400"
                : "bg-slate-800 text-slate-500 hover:text-rose-400"
            } disabled:opacity-50`}
          >
            <Heart
              className="h-3.5 w-3.5"
              fill={isLiked ? "currentColor" : "none"}
            />
            {currentGuide.likes_count}
          </button>

          {(isOwner || isAdmin) && (
            <div className="ml-auto flex items-center gap-1">
              <Link
                href={`/guides?id=${currentGuide.id}&edit=1`}
                className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-700"
              >
                <Edit2 className="h-3.5 w-3.5" />
                {t.guides_edit}
              </Link>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-red-500/20 hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t.plaza_delete}
              </button>
            </div>
          )}
        </div>

        <div className="prose prose-invert max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-300">
            {currentGuide.content}
          </pre>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100">{t.guides_delete_title}</h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-6 text-sm text-slate-400">{t.guides_delete_confirm}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
              >
                {t.builder_cancel}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-400 disabled:opacity-50"
              >
                {deleting && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                )}
                {t.builder_confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
