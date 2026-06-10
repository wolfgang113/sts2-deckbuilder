"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { characters } from "@/data/cards";
import { getDeckCards, loadSavedDecks, type SavedDeck } from "@/lib/deckStorage";
import {
  getPublicDecks,
  getLikedDeckIds,
  toggleLike,
  type CloudDeck,
} from "@/lib/supabaseDecks";
import { getCurrentUser } from "@/lib/auth";
import { Layers, Heart, Swords, User, Monitor, Cloud } from "lucide-react";

export default function DecksPage() {
  const [tab, setTab] = useState<"cloud" | "local">("cloud");
  const [cloudDecks, setCloudDecks] = useState<CloudDeck[]>([]);
  const [localDecks, setLocalDecks] = useState<SavedDeck[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [filterChar, setFilterChar] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tab === "cloud") {
      loadCloudDecks();
    } else {
      setLocalDecks(loadSavedDecks());
      setLoading(false);
      setError(null);
    }
  }, [filterChar, tab]);

  const loadCloudDecks = async () => {
    setLoading(true);
    setError(null);
    try {
      const [publicDecks, liked] = await Promise.all([
        getPublicDecks(filterChar === "all" ? undefined : filterChar),
        getLikedDeckIds(),
      ]);
      setCloudDecks(publicDecks);
      setLikedIds(new Set(liked));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "加载失败";
      setError(msg);
      console.error("加载云端卡组失败:", err);
    } finally {
      setLoading(false);
    }
  };

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
      alert("请先登录后再点赞");
    }
  };

  const displayedDecks = tab === "cloud" ? cloudDecks : localDecks;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-100">卡组广场</h1>
        <span className="rounded-full bg-slate-800 px-3 py-0.5 text-xs text-slate-400">
          {displayedDecks.length} 套
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
          云端广场
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
          本地卡组
        </button>
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
          全部
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
        <div className="py-20 text-center text-slate-500">加载中...</div>
      ) : error ? (
        <div className="py-20 text-center">
          <Layers className="mx-auto mb-4 h-12 w-12 text-slate-700" />
          <p className="mb-2 text-red-400">加载失败</p>
          <p className="text-xs text-slate-600">{error}</p>
          <button
            onClick={loadCloudDecks}
            className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
          >
            重试
          </button>
        </div>
      ) : displayedDecks.length === 0 ? (
        <div className="py-20 text-center">
          <Layers className="mx-auto mb-4 h-12 w-12 text-slate-700" />
          <p className="text-slate-500">
            {tab === "cloud" ? "暂无公开卡组" : "暂无本地卡组"}
          </p>
          {tab === "local" && (
            <Link
              href="/deckbuilder"
              className="mt-2 inline-block text-sm text-amber-400 hover:text-amber-300"
            >
              去组卡器创建
            </Link>
          )}
        </div>
      ) : tab === "cloud" ? (
        <CloudDeckList
          decks={cloudDecks}
          likedIds={likedIds}
          onLike={handleLike}
        />
      ) : (
        <LocalDeckList decks={localDecks} />
      )}
    </div>
  );
}

function CloudDeckList({
  decks,
  likedIds,
  onLike,
}: {
  decks: CloudDeck[];
  likedIds: Set<string>;
  onLike: (id: string) => void;
}) {
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
        const authorName = deck.profiles?.display_name ?? "匿名用户";

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
              <span>{deckCards.length} 张</span>
              <span>·</span>
              <span className="text-rose-400">攻击 {attack}</span>
              <span className="text-sky-400">技能 {skill}</span>
              <span className="text-emerald-400">能力 {power}</span>
              <span>·</span>
              <span>均费 {avgCost}</span>
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
                  还有 {deckCards.length - 5} 张...
                </p>
              )}
            </div>

            <Link
              href={`/deckbuilder?cloud=${deck.id}`}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
            >
              <Swords className="h-4 w-4" />
              加载卡组
            </Link>
          </div>
        );
      })}
    </div>
  );
}

function LocalDeckList({ decks }: { decks: SavedDeck[] }) {
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
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-500">
                本地
              </span>
            </div>

            <div className="mb-3 flex flex-wrap gap-2 text-xs text-slate-400">
              <span style={{ color: charInfo?.color }}>{charInfo?.name}</span>
              <span>·</span>
              <span>{deckCards.length} 张</span>
              <span>·</span>
              <span className="text-rose-400">攻击 {attack}</span>
              <span className="text-sky-400">技能 {skill}</span>
              <span className="text-emerald-400">能力 {power}</span>
              <span>·</span>
              <span>均费 {avgCost}</span>
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
                  还有 {deckCards.length - 5} 张...
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
              加载卡组
            </Link>
          </div>
        );
      })}
    </div>
  );
}
