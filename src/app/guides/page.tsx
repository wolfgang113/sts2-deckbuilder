"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { characters } from "@/data/cards";
import { getCurrentUser, type AuthUser } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";
import {
  getGuides,
  getGuideById,
  getLikedGuideIds,
  toggleLike,
  deleteGuide,
  type Guide,
} from "@/lib/supabaseGuides";
import AuthModal from "@/components/AuthModal";
import GuideDetail from "@/components/GuideDetail";
import GuideEdit from "@/components/GuideEdit";
import {
  BookOpen,
  Search,
  ArrowUpDown,
  User,
  Heart,
  Eye,
  Plus,
  BookX,
  Trash2,
  X,
} from "lucide-react";

const GENERAL_TAG = "General";

export default function GuidesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-slate-700 border-t-amber-500" />
          <p className="text-slate-500">Loading...</p>
        </div>
      }
    >
      <GuidesPageContent />
    </Suspense>
  );
}

function GuidesPageContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const detailId = searchParams.get("id");
  const isEditMode = searchParams.get("edit") === "1";

  const [user, setUser] = useState<AuthUser | null>(null);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "likes" | "oldest">("newest");
  const [filterChar, setFilterChar] = useState<string>("all");
  const [showAuth, setShowAuth] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<Guide | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [detailGuide, setDetailGuide] = useState<Guide | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const loadGuides = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, liked] = await Promise.all([
        getGuides({
          character: filterChar,
          search: searchQuery,
          sortBy,
        }),
        getLikedGuideIds(),
      ]);
      setGuides(data);
      setLikedIds(new Set(liked));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.guides_error;
      setError(msg);
      console.error("加载攻略失败:", err);
    } finally {
      setLoading(false);
    }
  }, [filterChar, searchQuery, sortBy, t.guides_error]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadGuides();
    }, 0);
    return () => clearTimeout(timeout);
  }, [loadGuides]);

  useEffect(() => {
    if (!detailId) return;

    const loadDetail = async () => {
      setDetailLoading(true);
      setDetailError(null);
      try {
        const data = await getGuideById(detailId);
        if (!data) {
          setDetailError(t.guides_not_found);
          setDetailGuide(null);
        } else {
          setDetailGuide(data);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : t.guides_error;
        setDetailError(msg);
        setDetailGuide(null);
      } finally {
        setDetailLoading(false);
      }
    };

    loadDetail();
  }, [detailId, t.guides_not_found, t.guides_error]);

  const handleLike = async (guideId: string) => {
    try {
      const isLiked = await toggleLike(guideId);
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (isLiked) next.add(guideId);
        else next.delete(guideId);
        return next;
      });
      setGuides((prev) =>
        prev.map((g) =>
          g.id === guideId
            ? { ...g, likes_count: g.likes_count + (isLiked ? 1 : -1) }
            : g
        )
      );
    } catch {
      alert(t.guides_login_to_like);
    }
  };

  const requestDelete = (guide: Guide) => {
    setConfirmDelete(guide);
  };

  const executeDelete = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete.id);
    try {
      await deleteGuide(confirmDelete.id);
      setGuides((prev) => prev.filter((g) => g.id !== confirmDelete.id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.guides_error;
      alert(msg);
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const charOptions = characters.filter((c) => c.id !== "Colorless" && c.id !== "Curse");

  const handleWriteClick = () => {
    if (user) {
      router.push("/guides/new");
    } else {
      setShowAuth(true);
    }
  };

  const clearDetail = () => {
    router.push("/guides");
  };

  if (detailId) {
    if (detailLoading) {
      return (
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-slate-700 border-t-amber-500" />
          <p className="text-slate-500">{t.guides_loading}</p>
        </div>
      );
    }

    if (detailError || !detailGuide) {
      return (
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <p className="mb-4 text-red-400">{detailError ?? t.guides_not_found}</p>
          <button
            onClick={clearDetail}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700"
          >
            {t.guides_back}
          </button>
        </div>
      );
    }

    if (isEditMode) {
      return <GuideEdit guide={detailGuide} />;
    }

    return <GuideDetail guide={detailGuide} onBack={clearDetail} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-amber-400" />
          <h1 className="text-2xl font-bold text-slate-100">{t.guides_title}</h1>
          <span className="rounded-full bg-slate-800 px-3 py-0.5 text-xs text-slate-400">
            {guides.length}{t.guides_count_suffix}
          </span>
        </div>
        <button
          onClick={handleWriteClick}
          className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
        >
          <Plus className="h-4 w-4" />
          {t.guides_new}
        </button>
      </div>

      <p className="mb-6 text-sm text-slate-400">{t.guides_subtitle}</p>

      {/* Controls */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.guides_search_placeholder}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "likes" | "oldest")}
            className="appearance-none rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-8 text-sm text-slate-200 focus:border-amber-500 focus:outline-none"
          >
            <option value="newest">{t.guides_sort_newest}</option>
            <option value="likes">{t.guides_sort_likes}</option>
            <option value="oldest">{t.guides_sort_oldest}</option>
          </select>
        </div>
      </div>

      {/* Character filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterChar("all")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            filterChar === "all"
              ? "bg-slate-700 text-slate-100"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          {t.guides_all}
        </button>
        <button
          onClick={() => setFilterChar(GENERAL_TAG)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            filterChar === GENERAL_TAG
              ? "bg-slate-700 text-slate-100"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          {t.guides_general}
        </button>
        {charOptions.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterChar(c.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filterChar === c.id
                ? "text-slate-950"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            }`}
            style={filterChar === c.id ? { backgroundColor: c.color } : {}}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-slate-700 border-t-amber-500" />
          <p className="text-slate-500">{t.guides_loading}</p>
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-red-500/10" />
            <div className="absolute inset-2 rounded-full bg-red-500/5" />
            <BookX className="relative h-10 w-10 text-red-400" />
          </div>
          <p className="mb-2 text-red-400">{t.guides_error}</p>
          <p className="text-xs text-slate-600">{error}</p>
          <button
            onClick={loadGuides}
            className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700"
          >
            {t.guides_retry}
          </button>
        </div>
      ) : guides.length === 0 ? (
        <div className="py-20 text-center">
          <div className="relative mx-auto mb-6 flex h-28 w-28 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-amber-500/5" />
            <div className="absolute inset-3 rounded-full bg-amber-500/5" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80">
              <BookOpen className="h-7 w-7 text-amber-400" />
            </div>
          </div>
          <p className="mb-1 text-sm font-medium text-slate-300">{t.guides_empty}</p>
          <p className="mb-4 text-xs text-slate-600">{t.guides_subtitle}</p>
          <button
            onClick={handleWriteClick}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            <Plus className="h-4 w-4" />
            {t.guides_go_write}
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <GuideCard
              key={guide.id}
              guide={guide}
              isLiked={likedIds.has(guide.id)}
              isOwner={user?.id === guide.user_id}
              onLike={() => handleLike(guide.id)}
              onDelete={() => requestDelete(guide)}
            />
          ))}
        </div>
      )}

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          getCurrentUser().then((u) => {
            setUser(u);
            if (u) router.push("/guides/new");
          });
        }}
      />

      {confirmDelete && (
        <ConfirmModal
          title={t.guides_delete_title}
          message={t.guides_delete_confirm}
          confirmText={t.builder_confirm}
          cancelText={t.builder_cancel}
          isLoading={deletingId === confirmDelete.id}
          onConfirm={executeDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

function GuideCard({
  guide,
  isLiked,
  isOwner,
  onLike,
  onDelete,
}: {
  guide: Guide;
  isLiked: boolean;
  isOwner: boolean;
  onLike: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  const charInfo = characters.find((c) => c.id === guide.character);
  const charName = charInfo?.name ?? t.guides_general;
  const charColor = charInfo?.color ?? "#94a3b8";
  const excerpt = guide.content.slice(0, 120).replace(/\s+/g, " ");

  return (
    <div className="group flex flex-col rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-slate-700">
      <div className="mb-3 flex items-start justify-between">
        <Link href={`/guides?id=${guide.id}`} className="min-w-0 flex-1">
          <h3 className="truncate font-bold text-slate-100 transition group-hover:text-amber-400">
            {guide.title}
          </h3>
        </Link>
        <div className="ml-2 flex items-center gap-1">
          <button
            onClick={onLike}
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition ${
              isLiked
                ? "bg-rose-500/10 text-rose-400"
                : "bg-slate-800 text-slate-500 hover:text-rose-400"
            }`}
          >
            <Heart
              className="h-3.5 w-3.5"
              fill={isLiked ? "currentColor" : "none"}
            />
            {guide.likes_count}
          </button>
          {isOwner && (
            <button
              onClick={onDelete}
              className="rounded p-1 text-slate-600 transition hover:text-red-400"
              title={t.plaza_delete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="flex items-center gap-1 text-slate-400">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: charColor }}
          />
          {charName}
        </span>
        {guide.tags.slice(0, 3).map((tag, i) => (
          <span
            key={i}
            className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400"
          >
            {tag}
          </span>
        ))}
        {guide.tags.length > 3 && (
          <span className="text-[10px] text-slate-600">+{guide.tags.length - 3}</span>
        )}
      </div>

      <Link href={`/guides?id=${guide.id}`} className="mb-4 block flex-1">
        <p className="line-clamp-3 text-sm leading-relaxed text-slate-400">
          {excerpt}
          {guide.content.length > 120 && "..."}
        </p>
      </Link>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <User className="h-3 w-3" />
          <span>{guide.display_name ?? t.plaza_anonymous}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {guide.view_count}
          </span>
          <span>{new Date(guide.created_at).toLocaleDateString("zh-CN")}</span>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({
  title,
  message,
  confirmText,
  cancelText,
  isLoading,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100">{title}</h3>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mb-6 text-sm text-slate-400">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-400 disabled:opacity-50"
          >
            {isLoading && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
