"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, type AuthUser } from "@/lib/auth";
import { getMyDecks, deleteCloudDeck, updateDeck, type CloudDeck } from "@/lib/supabaseDecks";
import { characters } from "@/data/cards";
import { getDeckCards } from "@/lib/deckStorage";
import { useTranslation } from "@/lib/i18n";
import { FolderHeart, Trash2, Globe, Lock, Edit2, Check, X, Swords } from "lucide-react";

export default function ProfilePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [decks, setDecks] = useState<CloudDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [hoveredDeckId, setHoveredDeckId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadDecks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyDecks();
      setDecks(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm(t.profile_delete_confirm)) return;
    await deleteCloudDeck(id);
    setDecks((prev) => prev.filter((d) => d.id !== id));
  }, [t.profile_delete_confirm]);

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (!u) {
        router.push("/");
        return;
      }
      setUser(u);
      loadDecks();
    });
  }, [router, loadDecks]);

  // Delete key to delete hovered deck
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Delete" && hoveredDeckId) {
        handleDelete(hoveredDeckId);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hoveredDeckId]);

  const togglePublic = async (deck: CloudDeck) => {
    await updateDeck(deck.id, { is_public: !deck.is_public });
    setDecks((prev) =>
      prev.map((d) => (d.id === deck.id ? { ...d, is_public: !d.is_public } : d))
    );
  };

  const startEdit = (deck: CloudDeck) => {
    setEditingId(deck.id);
    setEditName(deck.name);
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return;
    await updateDeck(id, { name: editName.trim() });
    setDecks((prev) =>
      prev.map((d) => (d.id === id ? { ...d, name: editName.trim() } : d))
    );
    setEditingId(null);
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-slate-500">
        {t.nav_login}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <FolderHeart className="h-6 w-6 text-amber-400" />
        <h1 className="text-2xl font-bold text-slate-100">{t.profile_title}</h1>
        <span className="rounded-full bg-slate-800 px-3 py-0.5 text-xs text-slate-400">
          {decks.length}{t.plaza_count_suffix}
        </span>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-slate-700 border-t-amber-500" />
          <p className="text-slate-500">{t.profile_loading}</p>
        </div>
      ) : decks.length === 0 ? (
        <div className="py-20 text-center">
          <div className="relative mx-auto mb-6 flex h-28 w-28 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-amber-500/5" />
            <div className="absolute inset-3 rounded-full bg-amber-500/5" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80">
              <FolderHeart className="h-7 w-7 text-amber-400" />
            </div>
          </div>
          <p className="mb-1 text-sm font-medium text-slate-300">{t.profile_empty}</p>
          <p className="mb-4 text-xs text-slate-600">Save a deck to the cloud to manage it here</p>
          <Link
            href="/deckbuilder"
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            <Swords className="h-4 w-4" />
            {t.profile_go_build}
          </Link>
        </div>
      ) : (
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
                    {editingId === deck.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-sm text-slate-200 focus:border-amber-500 focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit(deck.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                        />
                        <button
                          onClick={() => saveEdit(deck.id)}
                          className="rounded p-0.5 text-emerald-400 hover:bg-slate-800"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="rounded p-0.5 text-slate-500 hover:bg-slate-800"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <h3 className="truncate font-bold text-slate-100">{deck.name}</h3>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => startEdit(deck)}
                      className="rounded p-1 text-slate-600 opacity-0 transition hover:text-amber-400 group-hover:opacity-100"
                      title={t.profile_rename}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => togglePublic(deck)}
                      className={`rounded p-1 transition ${
                        deck.is_public ? "text-emerald-400" : "text-slate-600"
                      }`}
                      title={deck.is_public ? t.profile_public : t.profile_private}
                    >
                      {deck.is_public ? (
                        <Globe className="h-3.5 w-3.5" />
                      ) : (
                        <Lock className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(deck.id)}
                      className="rounded p-1 text-slate-600 opacity-0 transition hover:text-red-400 group-hover:opacity-100"
                      title={t.profile_delete}
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
                  href={`/deckbuilder?cloud=${deck.id}`}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
                >
                  <Swords className="h-4 w-4" />
                  {t.profile_load_deck}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
