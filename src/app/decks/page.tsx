"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { characters } from "@/data/cards";
import { getDeckCards, loadSavedDecks, deleteDeck, type SavedDeck } from "@/lib/deckStorage";
import {
  getPublicDecks,
  getLikedDeckIds,
  toggleLike,
  deleteCloudDeck,
  type CloudDeck,
} from "@/lib/supabaseDecks";
import { getCommentCounts } from "@/lib/supabaseComments";
import { getCurrentUser, type AuthUser } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";
import { Layers, Heart, Swords, User, Monitor, Cloud, Search, ArrowUpDown, MessageSquare, Trash2 } from "lucide-react";

export default function DecksPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"cloud" | "local">("cloud");
  const [cloudDecks, setCloudDecks] = useState<CloudDeck[]>([]);
  const [localDecks, setLocalDecks] = useState<SavedDeck[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [filterChar, setFilterChar] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "likes" | "oldest">("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    getCurrentUser().then(setCurrentUser);
  }, []);

  const loadCloudDecks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [publicDecks, liked] = await Promise.all([
        getPublicDecks(filterChar === "all" ? undefined : filterChar),
        getLikedDeckIds(),
      ]);
      setCloudDecks(publicDecks);
      setLikedIds(new Set(liked));

      if (publicDecks.length > 0) {
        const counts = await getCommentCounts(publicDecks.map((d) => d.id));
        setCommentCounts(counts);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.plaza_error;
      setError(msg);
      console.error("加载云端卡组失败:", err);
    } finally {
      setLoading(false);
    }
  }, [filterChar, t]);

  const loadLocalDecks = useCallback(() => {
    setLocalDecks(loadSavedDecks());
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (tab === "cloud") {
        loadCloudDecks();
      } else {
        loadLocalDecks();
      }
    }, 0);
    return () => clearTimeout(timeout);
  }, [tab, loadCloudDecks, loadLocalDecks]);

  const handleLike = async (deckId: string) => {
    try {
      const isLiked = await toggleLike(deckId);
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (isLiked) next.add(deckId);
        else next.delete(deckId);
        return next;
      });
      setCloudDecks((prev) =>
        prev.map((d) =>
          d.id === deckId
            ? { ...d, likes_count: d.likes_count + (isLiked ? 1 : -1) }
            : d
        )
      );
    } catch {
      alert(t.plaza_like_login);
    }
  };

  const handleDeleteLocal = (deckId: string) => {
    if (!confirm(t.plaza_delete_confirm)) return;
    deleteDeck(deckId);
    setLocalDecks((prev) => prev.filter((d) => d.id !== deckId));
  };

  const handleDeleteCloud = async (deckId: string) => {
    if (!confirm(t.plaza_delete_confirm)) return;
    try {
      await deleteCloudDeck(deckId);
      setCloudDecks((prev) => prev.filter((d) => d.id !== deckId));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.plaza_error;
      alert(msg);
    }
  };

  const filteredAndSortedDecks = useMemo(() => {
    const source = tab === "cloud" ? cloudDecks : localDecks;

    let result = [...source] as (CloudDeck | SavedDeck)[];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((deck) => {
        const name = ("name" in deck ? deck.name : "").toLowerCase();
        return name.includes(q);
      });
    }

    result = [...result].sort((a, b) => {
      if (sortBy === "newest") {
        const aTime = new Date(("created_at" in a ? a.created_at : a.createdAt) || 0).getTime();
        const bTime = new Date(("created_at" in b ? b.created_at : b.createdAt) || 0).getTime();
        return bTime - aTime;
      }
      if (sortBy === "oldest") {
        const aTime = new Date(("created_at" in a ? a.created_at : a.createdAt) || 0).getTime();
        const bTime = new Date(("created_at" in b ? b.created_at : b.createdAt) || 0).getTime();
        return aTime - bTime;
      }
      if (sortBy === "likes") {
        const aLikes = "likes_count" in a ? (a.likes_count || 0) : 0;
        const bLikes = "likes_count" in b ? (b.likes_count || 0) : 0;
        return bLikes - aLikes;
      }
      return 0;
    });

    return result;
  }, [tab, cloudDecks, localDecks, searchQuery, sortBy]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-100">{t.plaza_title}</h1>
        <span className="rounded-full bg-slate-800 px-3 py-0.5 text-xs text-slate-400">
          {filteredAndSortedDecks.length}{t.plaza_count_suffix}
        </span>
      </div>

      {/* Tab Switch */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTab("cloud")}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "cloud"
              ? "bg-amber-500 text-slate-950"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
          }`}
        >
          <Cloud className="h-4 w-4" />
          {t.plaza_cloud}
        </button>
        <button
          onClick={() => setTab("local")}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "local"
              ? "bg-amber-500 text-slate-950"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
          }`}
        >
          <Monitor className="h-4 w-4" />
          {t.plaza_local}
        </button>
      </div>

      {/* Search & Sort */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.plaza_search_placeholder}
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
            <option value="newest">{t.plaza_sort_newest}</option>
            <option value="likes">{t.plaza_sort_likes}</option>
            <option value="oldest">{t.plaza_sort_oldest}</option>
          </select>
        </div>
      </div>

      {/* Character Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterChar("all")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            filterChar === "all"
              ? "bg-slate-700 text-slate-100"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          {t.plaza_all}
        </button>
        {characters
          .filter((c) => c.id !== "Colorless" && c.id !== "Curse")
          .map((c) => (
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
          <p className="text-slate-500">{t.plaza_loading}</p>
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-red-500/10" />
            <div className="absolute inset-2 rounded-full bg-red-500/5" />
            <Layers className="relative h-10 w-10 text-red-400" />
          </div>
          <p className="mb-2 text-red-400">{t.plaza_error}</p>
          <p className="text-xs text-slate-600">{error}</p>
          <button
            onClick={loadCloudDecks}
            className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700"
          >
            {t.plaza_retry}
          </button>
        </div>
      ) : filteredAndSortedDecks.length === 0 ? (
        <div className="py-20 text-center">
          <div className="relative mx-auto mb-6 flex h-28 w-28 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-amber-500/5" />
            <div className="absolute inset-3 rounded-full bg-amber-500/5" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80">
              {tab === "cloud" ? (
                <Cloud className="h-7 w-7 text-amber-400" />
              ) : (
                <Monitor className="h-7 w-7 text-sky-400" />
              )}
            </div>
          </div>
          <p className="mb-1 text-sm font-medium text-slate-300">
            {tab === "cloud" ? t.plaza_empty_cloud : t.plaza_empty_local}
          </p>
          <p className="mb-4 text-xs text-slate-600">
            {tab === "cloud"
              ? "Be the first to share your deck"
              : "Create your first deck to see it here"}
          </p>
          {tab === "local" && (
            <Link
              href="/deckbuilder"
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
            >
              <Swords className="h-4 w-4" />
              {t.plaza_go_build}
            </Link>
          )}
        </div>
      ) : tab === "cloud" ? (
        <CloudDeckList
          decks={filteredAndSortedDecks as CloudDeck[]}
          likedIds={likedIds}
          onLike={handleLike}
          onDelete={handleDeleteCloud}
          currentUserId={currentUser?.id}
          commentCounts={commentCounts}
        />
      ) : (
        <LocalDeckList decks={filteredAndSortedDecks as SavedDeck[]} onDelete={handleDeleteLocal} />
      )}
    </div>
  );
}

function CloudDeckList({
  decks,
  likedIds,
  onLike,
  onDelete,
  currentUserId,
  commentCounts,
}: {
  decks: CloudDeck[];
  likedIds: Set<string>;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  currentUserId?: string;
  commentCounts: Record<string, number>;
}) {
  const { t } = useTranslation();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {decks.map((deck) => {
        const charInfo = characters.find((c) => c.id === deck.character);
        const deckCards = getDeckCards(deck.card_ids);
        const attack = deckCards.filter((c) => c.type === "Attack").length;
        const skill = deckCards.filter((c) => c.type === "Skill").length;
        const power = deckCards.filter((c) => c.type === "Power").length;
        const avgCost =
          deckCards.length > 0
            ? (
                deckCards.reduce(
                  (sum, c) => sum + (typeof c.cost === "number" ? c.cost : 0),
                  0
                ) / deckCards.length
              ).toFixed(1)
            : "0";

        const isLiked = likedIds.has(deck.id);
        const isOwner = currentUserId === deck.user_id;
        const authorName = deck.display_name ?? t.plaza_anonymous;
        const commentCount = commentCounts[deck.id] || 0;

        return (
          <div
            key={deck.id}
            className="group rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-slate-700"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: charInfo?.color }}
                />
                <h3 className="truncate font-bold text-slate-100">{deck.name}</h3>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href={`/deckbuilder?cloud=${deck.id}`}
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition ${
                    commentCount > 0
                      ? "bg-sky-500/10 text-sky-400 hover:bg-sky-500/20"
                      : "bg-slate-800 text-slate-500 hover:text-sky-400"
                  }`}
                  title={t.comments_title}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  {commentCount}
                </Link>
                <button
                  onClick={() => onLike(deck.id)}
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
                  {deck.likes_count}
                </button>
                {isOwner && (
                  <button
                    onClick={() => onDelete(deck.id)}
                    className="rounded p-1 text-slate-600 transition hover:text-red-400"
                    title={t.plaza_delete}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="mb-2 flex items-center gap-1.5 text-xs text-slate-500">
              <User className="h-3 w-3" />
              <span>{authorName}</span>
              <span>·</span>
              <span>{new Date(deck.created_at).toLocaleDateString("zh-CN")}</span>
            </div>

            <div className="mb-3 flex flex-wrap gap-2 text-xs text-slate-400">
              <span style={{ color: charInfo?.color }}>{charInfo?.name}</span>
              <span>·</span>
              <span>{deckCards.length}{t.unit_card}</span>
              <span>·</span>
              <span className="text-rose-400">{t.builder_stat_attack} {attack}</span>
              <span className="text-sky-400">{t.builder_stat_skill} {skill}</span>
              <span className="text-emerald-400">{t.builder_stat_power} {power}</span>
              <span>·</span>
              <span>{t.builder_stat_avg_cost} {avgCost}</span>
            </div>

            <div className="mb-4 space-y-1">
              {deckCards.slice(0, 5).map((card, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-slate-300"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-[10px]">
                    {card.cost === -1 ? "∞" : card.cost}
                  </span>
                  <span className="truncate">{card.name}</span>
                </div>
              ))}
              {deckCards.length > 5 && (
                <p className="text-xs text-slate-600">
                  {t.unit_more.replace("{count}", String(deckCards.length - 5))}
                </p>
              )}
            </div>

            <Link
              href={`/deckbuilder?cloud=${deck.id}`}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
            >
              <Swords className="h-4 w-4" />
              {t.plaza_load_deck}
            </Link>
          </div>
        );
      })}
    </div>
  );
}

function LocalDeckList({ decks, onDelete }: { decks: SavedDeck[]; onDelete: (id: string) => void }) {
  const { t } = useTranslation();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {decks.map((deck) => {
        const charInfo = characters.find((c) => c.id === deck.character);
        const deckCards = getDeckCards(deck.cardIds);
        const attack = deckCards.filter((c) => c.type === "Attack").length;
        const skill = deckCards.filter((c) => c.type === "Skill").length;
        const power = deckCards.filter((c) => c.type === "Power").length;
        const avgCost =
          deckCards.length > 0
            ? (
                deckCards.reduce(
                  (sum, c) => sum + (typeof c.cost === "number" ? c.cost : 0),
                  0
                ) / deckCards.length
              ).toFixed(1)
            : "0";

        return (
          <div
            key={deck.id}
            className="group rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-slate-700"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: charInfo?.color }}
                />
                <h3 className="truncate font-bold text-slate-100">{deck.name}</h3>
              </div>
              <div className="flex items-center gap-1">
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-500">
                  {t.plaza_local_tag}
                </span>
                <button
                  onClick={() => onDelete(deck.id)}
                  className="rounded p-1 text-slate-600 transition hover:text-red-400"
                  title={t.plaza_delete}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mb-3 flex flex-wrap gap-2 text-xs text-slate-400">
              <span style={{ color: charInfo?.color }}>{charInfo?.name}</span>
              <span>·</span>
              <span>{deckCards.length}{t.unit_card}</span>
              <span>·</span>
              <span className="text-rose-400">{t.builder_stat_attack} {attack}</span>
              <span className="text-sky-400">{t.builder_stat_skill} {skill}</span>
              <span className="text-emerald-400">{t.builder_stat_power} {power}</span>
              <span>·</span>
              <span>{t.builder_stat_avg_cost} {avgCost}</span>
            </div>

            <div className="mb-4 space-y-1">
              {deckCards.slice(0, 5).map((card, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-slate-300"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-[10px]">
                    {card.cost === -1 ? "∞" : card.cost}
                  </span>
                  <span className="truncate">{card.name}</span>
                </div>
              ))}
              {deckCards.length > 5 && (
                <p className="text-xs text-slate-600">
                  {t.unit_more.replace("{count}", String(deckCards.length - 5))}
                </p>
              )}
            </div>

            <Link
              href={`/deckbuilder?deck=${btoa(
                unescape(
                  encodeURIComponent(
                    JSON.stringify({
                      n: deck.name,
                      c: deck.character,
                      cards: deck.cardIds,
                    })
                  )
                )
              )}`}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
            >
              <Swords className="h-4 w-4" />
              {t.plaza_load_deck}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
