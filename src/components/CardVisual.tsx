"use client";

import { useState } from "react";
import type { Card, CardType, CardRarity } from "@/data/cards";
import { characters } from "@/data/cards";

const typeConfig: Record<
  CardType | "Status",
  { label: string; border: string; bg: string; headerBg: string; costBg: string }
> = {
  Attack: {
    label: "攻击",
    border: "border-rose-700",
    bg: "bg-rose-950/60",
    headerBg: "bg-rose-900/80",
    costBg: "bg-rose-700",
  },
  Skill: {
    label: "技能",
    border: "border-sky-700",
    bg: "bg-sky-950/60",
    headerBg: "bg-sky-900/80",
    costBg: "bg-sky-700",
  },
  Power: {
    label: "能力",
    border: "border-emerald-700",
    bg: "bg-emerald-950/60",
    headerBg: "bg-emerald-900/80",
    costBg: "bg-emerald-700",
  },
  Curse: {
    label: "诅咒",
    border: "border-purple-800",
    bg: "bg-purple-950/80",
    headerBg: "bg-purple-900/80",
    costBg: "bg-purple-800",
  },
  Status: {
    label: "状态",
    border: "border-slate-600",
    bg: "bg-slate-900/60",
    headerBg: "bg-slate-800/80",
    costBg: "bg-slate-600",
  },
};

const rarityBorder: Record<CardRarity, string> = {
  Basic: "border-slate-600",
  Common: "border-slate-500",
  Uncommon: "border-sky-500/60",
  Rare: "border-amber-500/60",
  Special: "border-purple-400/60",
  Curse: "border-purple-800",
};

interface CardVisualProps {
  card: Card;
  compact?: boolean;
  onClick?: () => void;
}

export default function CardVisual({
  card,
  compact = false,
  onClick,
}: CardVisualProps) {
  const [upgraded, setUpgraded] = useState(false);
  const config = typeConfig[card.type];
  const characterInfo = characters.find((c) => c.id === card.character);
  const displayDesc = upgraded && card.upgradedDescription
    ? card.upgradedDescription
    : card.description;

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`relative flex items-center gap-2 rounded-md border ${config.border} ${config.bg} p-2 transition hover:brightness-110 cursor-pointer select-none`}
      >
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${config.costBg} text-xs font-bold text-white shadow`}
        >
          {card.cost === -1 ? "∞" : card.cost === "X" ? "X" : card.cost}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium text-slate-100">
              {card.name}
            </span>
            <span
              className={`shrink-0 rounded px-1 py-0 text-[10px] font-medium ${config.headerBg} text-white/90`}
            >
              {config.label}
            </span>
          </div>
          <p className="truncate text-xs text-slate-400">{card.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      onContextMenu={(e) => {
        if (card.upgradedDescription) {
          e.preventDefault();
          setUpgraded((v) => !v);
        }
      }}
      className={`relative flex flex-col rounded-lg border-2 ${rarityBorder[card.rarity]} ${config.bg} overflow-hidden transition hover:scale-[1.02] hover:shadow-lg cursor-pointer select-none`}
      style={{ aspectRatio: "3/4" }}
    >
      {/* Cost */}
      <div
        className={`absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full ${config.costBg} border-2 border-slate-900/50 text-sm font-bold text-white shadow-md z-10`}
      >
        {card.cost === -1 ? "∞" : card.cost === "X" ? "X" : card.cost}
      </div>

      {/* Upgrade toggle indicator */}
      {card.upgradedDescription && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setUpgraded((v) => !v);
          }}
          className={`absolute right-2 top-2 z-10 rounded px-1.5 py-0.5 text-[10px] font-medium transition ${
            upgraded
              ? "bg-emerald-600 text-white"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
          }`}
        >
          {upgraded ? "已升级" : "升级"}
        </button>
      )}

      {/* Header */}
      <div
        className={`${config.headerBg} px-3 pb-2 pt-3 text-center`}
        style={{ paddingTop: "12px" }}
      >
        <h3 className="text-sm font-bold text-slate-50 leading-tight">
          {card.name}
        </h3>
      </div>

      {/* Art area */}
      <div
        className="flex-1 mx-2 mt-1 rounded-md border border-slate-800/50 bg-slate-950/40 flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${characterInfo?.color}15 0%, transparent 60%), radial-gradient(ellipse at center, ${characterInfo?.color}10 0%, transparent 70%)`,
        }}
      >
        <span
          className="text-3xl font-black opacity-10"
          style={{ color: characterInfo?.color }}
        >
          {config.label[0]}
        </span>
      </div>

      {/* Type badge */}
      <div className="flex justify-center -mt-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow ${config.costBg}`}
        >
          {config.label}
        </span>
      </div>

      {/* Description */}
      <div className="flex-1 px-3 py-2 flex items-center">
        <p className="text-center text-xs leading-relaxed text-slate-200 w-full">
          {displayDesc}
        </p>
      </div>

      {/* Tips */}
      {card.tips && (
        <div className="mx-2 mb-2 rounded-md border border-amber-500/20 bg-amber-500/10 p-2">
          <p className="text-[10px] leading-relaxed text-amber-200/80">
            <span className="font-bold text-amber-400">攻略：</span> {card.tips}
          </p>
        </div>
      )}

      {/* Footer info */}
      <div className="flex items-center justify-between border-t border-slate-800/50 px-3 py-1.5">
        <span className="text-[10px]" style={{ color: characterInfo?.color }}>
          {characterInfo?.name}
        </span>
        <span
          className={`text-[10px] font-medium ${
            card.rarity === "Rare"
              ? "text-amber-400"
              : card.rarity === "Uncommon"
              ? "text-sky-400"
              : "text-slate-500"
          }`}
        >
          {card.rarity === "Basic"
            ? "基础"
            : card.rarity === "Common"
            ? "普通"
            : card.rarity === "Uncommon"
            ? "罕见"
            : card.rarity === "Rare"
            ? "稀有"
            : card.rarity === "Special"
            ? "特殊"
            : "诅咒"}
        </span>
      </div>
    </div>
  );
}
