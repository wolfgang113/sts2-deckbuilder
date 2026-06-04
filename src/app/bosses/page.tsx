"use client";

import { useState, useMemo } from "react";
import { bosses, type Boss, type Act } from "@/data/bosses";
import { Search, Shield, Zap, Heart, Swords } from "lucide-react";

const acts: { value: Act | "all"; label: string }[] = [
  { value: "all", label: "全部" },
  { value: 1, label: "Act 1" },
  { value: 2, label: "Act 2" },
  { value: 3, label: "Act 3" },
  { value: 4, label: "Act 4" },
];

const actColors: Record<Act, string> = {
  1: "text-emerald-400",
  2: "text-sky-400",
  3: "text-amber-400",
  4: "text-red-400",
};

const actBgs: Record<Act, string> = {
  1: "bg-emerald-500/10 border-emerald-500/20",
  2: "bg-sky-500/10 border-sky-500/20",
  3: "bg-amber-500/10 border-amber-500/20",
  4: "bg-red-500/10 border-red-500/20",
};

export default function BossesPage() {
  const [search, setSearch] = useState("");
  const [selectedAct, setSelectedAct] = useState<Act | "all">("all");

  const filtered = useMemo(() => {
    let result = bosses;
    if (selectedAct !== "all") {
      result = result.filter((b) => b.act === selectedAct);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.abilities.some(
            (a) =>
              a.name.toLowerCase().includes(q) ||
              a.description.toLowerCase().includes(q)
          ) ||
          b.strategy.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, selectedAct]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Shield className="h-6 w-6 text-red-400" />
        <h1 className="text-2xl font-bold text-slate-100">Boss 攻略</h1>
        <span className="rounded-full bg-slate-800 px-3 py-0.5 text-xs text-slate-400">
          {filtered.length} 个
        </span>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="搜索Boss名称、技能或策略..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-1">
          {acts.map((a) => (
            <button
              key={a.value}
              onClick={() => setSelectedAct(a.value)}
              className={`rounded-md px-3 py-1 text-sm transition ${
                selectedAct === a.value
                  ? "bg-slate-700 text-slate-100 font-medium"
                  : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Boss List */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          没有找到匹配的Boss
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((boss) => (
            <BossCard key={boss.id} boss={boss} />
          ))}
        </div>
      )}
    </div>
  );
}

function BossCard({ boss }: { boss: Boss }) {
  return (
    <div
      className={`rounded-xl border p-5 transition hover:border-slate-700 ${actBgs[boss.act]}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100">{boss.name}</h2>
          <div className="mt-1 flex items-center gap-3 text-xs">
            <span className={actColors[boss.act]}>Act {boss.act}</span>
            <span className="text-slate-500">·</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Heart className="h-3 w-3 text-rose-400" />
              {boss.hp}
            </span>
          </div>
        </div>
      </div>

      {/* Traits */}
      {boss.traits.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {boss.traits.map((trait, i) => (
            <span
              key={i}
              className="rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-300"
            >
              {trait}
            </span>
          ))}
        </div>
      )}

      {/* Abilities */}
      <div className="mb-4">
        <h3 className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase text-slate-500">
          <Zap className="h-3.5 w-3.5" />
          技能
        </h3>
        <div className="space-y-2">
          {boss.abilities.map((ability, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-3"
            >
              <div className="mb-1 flex items-center gap-2">
                <Swords className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-sm font-medium text-slate-200">
                  {ability.name}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                {ability.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Phases */}
      {boss.phases && (
        <div className="mb-4">
          <h3 className="mb-2 text-xs font-medium uppercase text-slate-500">
            阶段变化
          </h3>
          <p className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-3 text-sm leading-relaxed text-slate-300">
            {boss.phases}
          </p>
        </div>
      )}

      {/* Strategy */}
      <div>
        <h3 className="mb-2 text-xs font-medium uppercase text-slate-500">
          应对策略
        </h3>
        <p className="rounded-lg border border-slate-800/60 bg-slate-900/60 p-3 text-sm leading-relaxed text-slate-300">
          {boss.strategy}
        </p>
      </div>
    </div>
  );
}
