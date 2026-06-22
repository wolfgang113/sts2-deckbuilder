"use client";

import { useState, useMemo } from "react";
import {
  cards,
  characters,
  type CardType,
  type CardRarity,
  type Character,
} from "@/data/cards";
import { Search, Filter } from "lucide-react";
import CardVisual from "@/components/CardVisual";
import { useTranslation } from "@/lib/i18n";

const cardTypes: CardType[] = ["Attack", "Skill", "Power", "Curse"];
const cardRarities: CardRarity[] = ["Basic", "Common", "Uncommon", "Rare", "Special"];

export default function CardsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState<Character | "all">("all");
  const [selectedType, setSelectedType] = useState<CardType | "all">("all");
  const [selectedRarity, setSelectedRarity] = useState<CardRarity | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  const typeLabels = useMemo(
    () => ({
      Attack: t.type_attack,
      Skill: t.type_skill,
      Power: t.type_power,
      Curse: t.type_curse,
      Status: t.type_status,
    }),
    [t]
  );

  const rarityLabels = useMemo(
    () => ({
      Basic: t.rarity_basic,
      Common: t.rarity_common,
      Uncommon: t.rarity_uncommon,
      Rare: t.rarity_rare,
      Special: t.rarity_special,
      Curse: t.rarity_curse,
    }),
    [t]
  );

  const filtered = useMemo(() => {
    return cards.filter((card) => {
      if (selectedCharacter !== "all" && card.character !== selectedCharacter) return false;
      if (selectedType !== "all" && card.type !== selectedType) return false;
      if (selectedRarity !== "all" && card.rarity !== selectedRarity) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          card.name.toLowerCase().includes(q) ||
          card.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, selectedCharacter, selectedType, selectedRarity]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-100">{t.cards_title}</h1>
        <span className="rounded-full bg-slate-800 px-3 py-0.5 text-xs text-slate-400">
          {filtered.length}{t.unit_card}
        </span>
      </div>

      {/* Search & Filter Toggle */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder={t.cards_search_placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
            showFilters
              ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
              : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          <Filter className="h-4 w-4" />
          {t.cards_filter}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 rounded-lg border border-slate-800 bg-slate-900/50 p-4 space-y-4">
          {/* Character filter */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-500 uppercase">{t.cards_filter_character}</label>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={selectedCharacter === "all"}
                onClick={() => setSelectedCharacter("all")}
                label={t.filter_all}
              />
              {characters.map((c) => (
                <FilterChip
                  key={c.id}
                  active={selectedCharacter === c.id}
                  onClick={() => setSelectedCharacter(c.id)}
                  label={c.name}
                  color={c.color}
                />
              ))}
            </div>
          </div>
          {/* Type filter */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-500 uppercase">{t.cards_filter_type}</label>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={selectedType === "all"}
                onClick={() => setSelectedType("all")}
                label={t.filter_all}
              />
              {cardTypes.map((tType) => (
                <FilterChip
                  key={tType}
                  active={selectedType === tType}
                  onClick={() => setSelectedType(tType)}
                  label={typeLabels[tType]}
                />
              ))}
            </div>
          </div>
          {/* Rarity filter */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-500 uppercase">{t.cards_filter_rarity}</label>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={selectedRarity === "all"}
                onClick={() => setSelectedRarity("all")}
                label={t.filter_all}
              />
              {cardRarities.map((r) => (
                <FilterChip
                  key={r}
                  active={selectedRarity === r}
                  onClick={() => setSelectedRarity(r)}
                  label={rarityLabels[r]}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Card Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-500">{t.cards_empty}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((card) => (
            <CardVisual key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1 text-sm transition ${
        active
          ? "bg-slate-700 text-slate-100 font-medium"
          : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
      }`}
      style={active && color ? { backgroundColor: color + "30", color } : {}}
    >
      {label}
    </button>
  );
}
