"use client";

import { useState } from "react";
import Link from "next/link";
import { characters } from "@/data/cards";
import { loadSavedDecks, deleteDeck, getDeckCards, type SavedDeck } from "@/lib/deckStorage";
import { Layers, Trash2, ArrowRight, Swords } from "lucide-react";

export default function DecksPage() {
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>(() => loadSavedDecks());
  const [filterChar, setFilterChar] = useState<string>("all");

  const filtered = filterChar === "all"
    ? savedDecks
    : savedDecks.filter((d) => d.character === filterChar);

  const handleDelete = (id: string) => {
    deleteDeck(id);
    setSavedDecks(loadSavedDecks());
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-100">卡组广场</h1>
        <span className="rounded-full bg-slate-800 px-3 py-0.5 text-xs text-slate-400">
          {filtered.length} 套
        </span>
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

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <Layers className="mx-auto mb-4 h-12 w-12 text-slate-700" />
          <p className="mb-2 text-slate-500">还没有保存的卡组</p>
          <Link
            href="/deckbuilder"
            className="inline-flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300"
          >
            去组卡器创建
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((deck) => {
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
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: charInfo?.color }}
                    />
                    <h3 className="font-bold text-slate-100">{deck.name}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(deck.id)}
                    className="rounded p-1 text-slate-600 opacity-0 transition hover:text-red-400 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
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

                {/* Top cards preview */}
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
      )}
    </div>
  );
}
