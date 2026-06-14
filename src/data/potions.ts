export type PotionRarity = "Common" | "Uncommon" | "Rare";

export interface Potion {
  id: string;
  name: string;
  rarity: PotionRarity;
  description: string;
  image?: string;
}

export const potions: Potion[] = [
  // Common
  { id: "attack_potion", name: "攻击药水", rarity: "Common", description: "将 3 张随机攻击牌加入手牌。" },
  { id: "block_potion", name: "格挡药水", rarity: "Common", description: "获得 12 点格挡。" },
  { id: "dexterity_potion", name: "敏捷药水", rarity: "Common", description: "获得 2 点敏捷。" },
  { id: "energy_potion", name: "能量药水", rarity: "Common", description: "获得 2 点能量。" },
  { id: "explosive_potion", name: "爆炸药水", rarity: "Common", description: "对所有敌人造成 10 点伤害。" },
  { id: "fire_potion", name: "火焰药水", rarity: "Common", description: "造成 20 点伤害。" },
  { id: "health_potion", name: "生命药水", rarity: "Common", description: "回复 10 点生命。" },
  { id: "power_potion", name: "能力药水", rarity: "Common", description: "将 3 张随机能力牌加入手牌。" },
  { id: "skill_potion", name: "技能药水", rarity: "Common", description: "将 3 张随机技能牌加入手牌。" },
  { id: "speed_potion", name: "速度药水", rarity: "Common", description: "获得 5 点敏捷。在你的回合结束时失去 5 点敏捷。" },
  { id: "strength_potion", name: "力量药水", rarity: "Common", description: "获得 2 点力量。" },
  { id: "swift_potion", name: "迅捷药水", rarity: "Common", description: "抽 3 张牌。" },
  { id: "weak_potion", name: "虚弱药水", rarity: "Common", description: "给予目标 3 层虚弱。" },

  // Uncommon
  { id: "ancient_potion", name: "远古药水", rarity: "Uncommon", description: "获得 1 层人工制品。" },
  { id: "blessing_of_the_forge", name: "锻造祝福", rarity: "Uncommon", description: "升级手牌中所有牌。" },
  { id: "cultist_potion", name: "邪教徒药水", rarity: "Uncommon", description: "获得 1 点仪式。" },
  { id: "distilled_chaos", name: "蒸馏混沌", rarity: "Uncommon", description: "在你的回合开始时，打出抽牌堆顶部的 3 张牌。" },
  { id: "elixir", name: "灵药", rarity: "Uncommon", description: "丢弃所有手牌，然后抽等量的牌。" },
  { id: "entropic_brew", name: "熵之酿造", rarity: "Uncommon", description: "填满所有空药水栏位，药水效果随机。" },
  { id: "fairy_in_a_bottle", name: "瓶中精灵", rarity: "Uncommon", description: "当你要被击败时，回复到最大生命值的 30%。" },
  { id: "fear_potion", name: "恐惧药水", rarity: "Uncommon", description: "给予目标 3 层易伤。" },
  { id: "flex_potion", name: "肌肉药水", rarity: "Uncommon", description: "获得 5 点力量。在你的回合结束时失去 5 点力量。" },
  { id: "focus_potion", name: "集中药水", rarity: "Uncommon", description: "获得 2 点集中。" },
  { id: "gamblers_brew", name: "赌徒酿造", rarity: "Uncommon", description: "丢弃任意数量的手牌，然后抽等量的牌。" },
  { id: "ghost_in_a_jar", name: "罐中幽灵", rarity: "Uncommon", description: "获得 1 层无敌。" },
  { id: "liquid_bronze", name: "液态青铜", rarity: "Uncommon", description: "获得 3 层荆棘。" },
  { id: "liquid_memories", name: "液态记忆", rarity: "Uncommon", description: "选择弃牌堆中的一张牌放到手牌，它本回合耗能变为 0。" },
  { id: "regen_potion", name: "再生药水", rarity: "Uncommon", description: "获得 5 层再生。" },
  { id: "smoke_bomb", name: "烟雾弹", rarity: "Uncommon", description: "从一场非Boss战斗中逃离，不获得奖励。" },
  { id: "snecko_oil", name: "蛇油", rarity: "Uncommon", description: "将手牌中所有牌的耗能随机化，然后抽 5 张牌。" },

  // Rare
  { id: "fruit_juice", name: "果汁", rarity: "Rare", description: "获得 5 点最大生命。" },
  { id: "ambrosia", name: "仙馐", rarity: "Rare", description: "进入神格姿态。" },
  { id: "duplication_potion", name: "复制药水", rarity: "Rare", description: "你下一张打出的牌会放入手牌两次。" },
  { id: "essence_of_darkness", name: "黑暗精华", rarity: "Rare", description: "每有一个充能球栏位，生成 1 个黑暗充能球。" },
  { id: "essence_of_steel", name: "钢铁精华", rarity: "Rare", description: "获得 4 层多层护甲。" },
  { id: "heart_of_iron", name: "铁之心", rarity: "Rare", description: "获得 6 点最大生命。在每场战斗开始时，获得 6 点格挡。" },
  { id: "liquid_gold", name: "液态金", rarity: "Rare", description: "获得 40 金币。" },
  { id: "potion_of_capacity", name: "容量药水", rarity: "Rare", description: "获得 2 个充能球栏位。" },
  { id: "stonetonic", name: "石化药水", rarity: "Rare", description: "获得 1 层金属化。" },
];

export const rarityLabels: Record<PotionRarity, string> = {
  Common: "普通",
  Uncommon: "罕见",
  Rare: "稀有",
};

export function searchPotions(query: string): Potion[] {
  const q = query.toLowerCase();
  return potions.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}
