"use client";

import { useState, useMemo } from "react";
import { relics, type RelicRarity, rarityLabels } from "@/data/relics";
import { Search, Diamond } from "lucide-react";

const rarities: RelicRarity[] = ["Starter", "Common", "Uncommon", "Rare"];

const rarityColors: Record<RelicRarity, string> = {
  Starter: "text-slate-400",
  Common: "text-slate-300",
  Uncommon: "text-sky-400",
  Rare: "text-amber-400",
  Boss: "text-purple-400",
  Shop: "text-emerald-400",
  Event: "text-rose-400",
};

export default function RelicsPage() {
  const [search, setSearch] = useState("");
  const [selectedRarity, setSelectedRarity] = useState<RelicRarity | "all">("all");

  const filtered = useMemo(() => {
    return relics.filter((relic) => {
      if (selectedRarity !== "all" && relic.rarity !== selectedRarity) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          relic.name.toLowerCase().includes(q) ||
          relic.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, selectedRarity]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Diamond className="h-6 w-6 text-amber-400" />
        <h1 className="text-2xl font-bold text-slate-100">遗物数据库</h1>
        <span className="rounded-full bg-slate-800 px-3 py-0.5 text-xs text-slate-400">
          {filtered.length} 个
        </span>
      </div>

      {/* Search & Filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="搜索遗物名称或效果..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-1">
          <FilterChip
            active={selectedRarity === "all"}
            onClick={() => setSelectedRarity("all")}
            label="全部"
          />
          {rarities.map((r) => (
            <FilterChip
              key={r}
              active={selectedRarity === r}
              onClick={() => setSelectedRarity(r)}
              label={rarityLabels[r]}
            />
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-500">没有找到匹配的遗物</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((relic) => (
            <div
              key={relic.id}
              className="rounded-lg border border-slate-800 bg-slate-900 p-4 transition hover:border-slate-700"
            >
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-bold text-slate-100">{relic.name}</h3>
                <span className={`text-xs font-medium ${rarityColors[relic.rarity]}`}>
                  {rarityLabels[relic.rarity]}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">{relic.description}</p>
            </div>
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
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1 text-sm transition ${
        active
          ? "bg-slate-700 text-slate-100 font-medium"
          : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
      }`}
    >
      {label}
    </button>
  );
}
