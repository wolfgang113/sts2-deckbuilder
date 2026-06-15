export type CardType = "Attack" | "Skill" | "Power" | "Curse" | "Status";
export type CardRarity = "Basic" | "Common" | "Uncommon" | "Rare" | "Special" | "Curse";
export type Character = "Ironclad" | "Silent" | "Defect" | "Watcher" | "Colorless" | "Curse";

export interface Card {
  id: string;
  name: string;
  character: Character;
  type: CardType;
  rarity: CardRarity;
  cost: number | "X";
  description: string;
  upgradedDescription?: string;
  image?: string;
  tips?: string; // 原创攻略提示
}

// 示例数据框架 — 后续替换为 STS 真实数据
export const cards: Card[] = [
  // Ironclad 示例
  { id: "strike_r", name: "打击", character: "Ironclad", type: "Attack", rarity: "Basic", cost: 1, description: "造成 6 点伤害。", upgradedDescription: "造成 9 点伤害。" },
  { id: "defend_r", name: "防御", character: "Ironclad", type: "Skill", rarity: "Basic", cost: 1, description: "获得 5 点格挡。", upgradedDescription: "获得 8 点格挡。" },
  { id: "bash", name: "痛击", character: "Ironclad", type: "Attack", rarity: "Basic", cost: 2, description: "造成 8 点伤害。给予 2 层易伤。", upgradedDescription: "造成 10 点伤害。给予 3 层易伤。" },
  { id: "anger", name: "愤怒", character: "Ironclad", type: "Attack", rarity: "Common", cost: 0, description: "造成 6 点伤害。在弃牌堆放入一张此牌的复制品。", upgradedDescription: "造成 8 点伤害。在弃牌堆放入一张此牌的复制品。" },
  { id: "armaments", name: "武装", character: "Ironclad", type: "Skill", rarity: "Common", cost: 1, description: "获得 5 点格挡。升级手牌中所有牌。", upgradedDescription: "获得 5 点格挡。升级手牌中所有牌。" },
  { id: "body_slam", name: "全身撞击", character: "Ironclad", type: "Attack", rarity: "Common", cost: 1, description: "造成等同于你当前格挡值的伤害。", upgradedDescription: "造成等同于你当前格挡值的伤害。" },
  { id: "clash", name: "冲突", character: "Ironclad", type: "Attack", rarity: "Common", cost: 0, description: "只有在手牌全是攻击牌时才能打出。造成 14 点伤害。", upgradedDescription: "造成 18 点伤害。" },
  { id: "cleave", name: "斩劈", character: "Ironclad", type: "Attack", rarity: "Common", cost: 1, description: "对所有敌人造成 8 点伤害。", upgradedDescription: "对所有敌人造成 11 点伤害。" },
  { id: "clothesline", name: "上勾拳", character: "Ironclad", type: "Attack", rarity: "Common", cost: 2, description: "造成 12 点伤害。给予 2 层虚弱。", upgradedDescription: "造成 14 点伤害。给予 3 层虚弱。" },
  { id: "flex", name: "活动肌肉", character: "Ironclad", type: "Skill", rarity: "Common", cost: 0, description: "获得 2 点力量。在你的回合结束时，失去 2 点力量。", upgradedDescription: "获得 4 点力量。在你的回合结束时，失去 4 点力量。" },
  { id: "havoc", name: "浩劫", character: "Ironclad", type: "Skill", rarity: "Common", cost: 1, description: "打出抽牌堆顶部的牌，将其丢弃。", upgradedDescription: "打出抽牌堆顶部的牌，将其丢弃。" },
  { id: "headbutt", name: "头槌", character: "Ironclad", type: "Attack", rarity: "Common", cost: 1, description: "造成 9 点伤害。将弃牌堆中的一张牌放到抽牌堆顶部。", upgradedDescription: "造成 12 点伤害。" },
  { id: "heavy_blade", name: "重刃", character: "Ironclad", type: "Attack", rarity: "Common", cost: 2, description: "造成 14 点伤害。力量额外作用 3 次。", upgradedDescription: "力量额外作用 5 次。" },
  { id: "iron_wave", name: "铁斩波", character: "Ironclad", type: "Attack", rarity: "Common", cost: 1, description: "造成 5 点伤害。获得 5 点格挡。", upgradedDescription: "造成 7 点伤害。获得 7 点格挡。" },
  { id: "perfected_strike", name: "完美打击", character: "Ironclad", type: "Attack", rarity: "Common", cost: 2, description: "造成 6 点伤害。你每有一张名字中带「打击」的牌，伤害+2。", upgradedDescription: "你每有一张名字中带「打击」的牌，伤害+3。" },
  { id: "pommel_strike", name: "剑柄打击", character: "Ironclad", type: "Attack", rarity: "Common", cost: 1, description: "造成 9 点伤害。抽 1 张牌。", upgradedDescription: "造成 10 点伤害。抽 2 张牌。" },
  { id: "shrug_it_off", name: "耸肩无视", character: "Ironclad", type: "Skill", rarity: "Common", cost: 1, description: "获得 8 点格挡。抽 1 张牌。", upgradedDescription: "获得 11 点格挡。抽 1 张牌。" },
  { id: "sword_boomerang", name: "飞剑回旋", character: "Ironclad", type: "Attack", rarity: "Common", cost: 1, description: "随机对敌人造成 3 点伤害 3 次。", upgradedDescription: "随机对敌人造成 3 点伤害 4 次。" },
  { id: "thunderclap", name: "雷霆打击", character: "Ironclad", type: "Attack", rarity: "Common", cost: 1, description: "对所有敌人造成 7 点伤害，给予 1 层易伤。", upgradedDescription: "对所有敌人造成 9 点伤害，给予 1 层易伤。" },
  { id: "true_grit", name: "坚毅", character: "Ironclad", type: "Skill", rarity: "Common", cost: 1, description: "获得 7 点格挡。消耗 1 张随机手牌。", upgradedDescription: "获得 9 点格挡。选择 1 张手牌消耗。" },
  { id: "twin_strike", name: "双重打击", character: "Ironclad", type: "Attack", rarity: "Common", cost: 1, description: "造成 5 点伤害 2 次。", upgradedDescription: "造成 7 点伤害 2 次。" },
  { id: "warcry", name: "战吼", character: "Ironclad", type: "Skill", rarity: "Common", cost: 0, description: "抽 1 张牌，将手牌中的一张牌放到抽牌堆顶部。消耗。", upgradedDescription: "抽 2 张牌，将手牌中的一张牌放到抽牌堆顶部。消耗。" },
  { id: "wild_strike", name: "狂野打击", character: "Ironclad", type: "Attack", rarity: "Common", cost: 1, description: "造成 17 点伤害。在抽牌堆中放入一张伤口。", upgradedDescription: "造成 21 点伤害。" },

  // 稀有牌
  { id: "barricade", name: "壁垒", character: "Ironclad", type: "Power", rarity: "Rare", cost: 3, description: "格挡不再在你的回合开始时消失。", upgradedDescription: "格挡不再在你的回合开始时消失。", tips: "格挡流核心卡。配合全身撞击、耸肩无视等叠格挡卡可以打出极高爆发。注意先叠够格挡再输出，不要急着打。" },
  { id: "berserk", name: "狂暴", character: "Ironclad", type: "Power", rarity: "Rare", cost: 0, description: "在你的回合开始时，获得 2 层易伤。在你的回合开始时，获得 1 点能量。", upgradedDescription: "在你的回合开始时，获得 1 层易伤。在你的回合开始时，获得 1 点能量。" },
  { id: "bludgeon", name: "重锤", character: "Ironclad", type: "Attack", rarity: "Rare", cost: 3, description: "造成 32 点伤害。", upgradedDescription: "造成 42 点伤害。" },
  { id: "brutality", name: "残暴", character: "Ironclad", type: "Power", rarity: "Rare", cost: 0, description: "在你的回合开始时，失去 1 点生命，抽 1 张牌。", upgradedDescription: "在你的回合开始时，失去 1 点生命，抽 1 张牌。" },
  { id: "corruption", name: "腐化", character: "Ironclad", type: "Power", rarity: "Rare", cost: 3, description: "技能牌耗能变为 0。打出技能牌时，将其消耗。", upgradedDescription: "技能牌耗能变为 0。打出技能牌时，将其消耗。", tips: "腐化流核心。所有技能变0费但消耗，意味着你只能用攻击牌和遗物输出。配合黑暗之拥或发牌类遗物非常强力。注意保留过牌手段。" },
  { id: "demon_form", name: "恶魔形态", character: "Ironclad", type: "Power", rarity: "Rare", cost: 3, description: "在你的回合开始时，获得 2 点力量。", upgradedDescription: "在你的回合开始时，获得 3 点力量。", tips: "力量流续航核心。3费开局较卡手，推荐配合能量类遗物或祭品快速启动。长盘战斗中价值极高。" },
  { id: "double_tap", name: "双重释放", character: "Ironclad", type: "Skill", rarity: "Rare", cost: 1, description: "你下一张攻击牌打出两次。", upgradedDescription: "你下两张攻击牌打出两次。" },
  { id: "exhume", name: "发掘", character: "Ironclad", type: "Skill", rarity: "Rare", cost: 1, description: "将一张已消耗的牌放入手牌。消耗。", upgradedDescription: "将一张已消耗的牌放入手牌。消耗。" },
  { id: "feed", name: "吞食", character: "Ironclad", type: "Attack", rarity: "Rare", cost: 1, description: "造成 10 点伤害。如果这张牌击杀非爪牙敌人，永久获得 3 点最大生命。消耗。", upgradedDescription: "造成 12 点伤害。永久获得 4 点最大生命。" },
  { id: "fiend_fire", name: "恶魔之焰", character: "Ironclad", type: "Attack", rarity: "Rare", cost: 2, description: "消耗手牌中所有牌。每消耗一张牌，造成 7 点伤害。消耗。", upgradedDescription: "每消耗一张牌，造成 10 点伤害。" },
  { id: "immolate", name: "焚烧", character: "Ironclad", type: "Attack", rarity: "Rare", cost: 2, description: "对所有敌人造成 21 点伤害。在抽牌堆中放入一张灼烧。", upgradedDescription: "对所有敌人造成 28 点伤害。" },
  { id: "impervious", name: "无敌", character: "Ironclad", type: "Skill", rarity: "Rare", cost: 2, description: "获得 30 点格挡。消耗。", upgradedDescription: "获得 40 点格挡。消耗。" },
  { id: "juggernaut", name: "全力冲击", character: "Ironclad", type: "Power", rarity: "Rare", cost: 2, description: "你每获得一次格挡，对随机敌人造成 5 点伤害。", upgradedDescription: "你每获得一次格挡，对随机敌人造成 7 点伤害。" },
  { id: "limit_break", name: "突破极限", character: "Ironclad", type: "Skill", rarity: "Rare", cost: 1, description: "将你的力量翻倍。消耗。", upgradedDescription: "将你的力量翻倍。", tips: "力量流爆发核心。升级后不再消耗，可以反复叠力量。配合恶魔形态+突破极限可以让力量指数级增长。" },
  { id: "offering", name: "祭品", character: "Ironclad", type: "Skill", rarity: "Rare", cost: 0, description: "失去 6 点生命。获得 2 点能量。抽 3 张牌。消耗。", upgradedDescription: "失去 6 点生命。获得 2 点能量。抽 5 张牌。消耗。", tips: "0费过牌+能量，几乎所有流派都能用。生命损失可以通过击杀回血或高格挡抵消。升级后抽5张质变。" },
  { id: "reaper", name: "收割", character: "Ironclad", type: "Attack", rarity: "Rare", cost: 2, description: "对所有敌人造成 4 点伤害。未被格挡的伤害会回复生命。消耗。", upgradedDescription: "对所有敌人造成 5 点伤害。" },

  // Silent 示例
  { id: "strike_g", name: "打击", character: "Silent", type: "Attack", rarity: "Basic", cost: 1, description: "造成 6 点伤害。", upgradedDescription: "造成 9 点伤害。" },
  { id: "defend_g", name: "防御", character: "Silent", type: "Skill", rarity: "Basic", cost: 1, description: "获得 5 点格挡。", upgradedDescription: "获得 8 点格挡。" },
  { id: "survivor", name: "生存者", character: "Silent", type: "Skill", rarity: "Basic", cost: 1, description: "获得 8 点格挡。丢弃一张手牌。", upgradedDescription: "获得 11 点格挡。丢弃一张手牌。" },
  { id: "neutralize", name: "中和", character: "Silent", type: "Attack", rarity: "Basic", cost: 0, description: "造成 3 点伤害。给予 1 层虚弱。", upgradedDescription: "造成 4 点伤害。给予 2 层虚弱。" },

  // Colorless
  { id: "bite", name: "撕咬", character: "Colorless", type: "Attack", rarity: "Special", cost: 1, description: "造成 7 点伤害。回复 2 点生命。", upgradedDescription: "造成 8 点伤害。回复 3 点生命。" },
  { id: "bandage_up", name: "绷带", character: "Colorless", type: "Skill", rarity: "Uncommon", cost: 0, description: "回复 4 点生命。消耗。", upgradedDescription: "回复 6 点生命。消耗。" },
  { id: "blind", name: "致盲", character: "Colorless", type: "Skill", rarity: "Uncommon", cost: 0, description: "给予 2 层虚弱。", upgradedDescription: "给予 2 层虚弱。" },
  { id: "dark_shackles", name: "黑暗镣铐", character: "Colorless", type: "Skill", rarity: "Uncommon", cost: 0, description: "敌人失去 9 点力量。在你的回合结束时，敌人重新获得 9 点力量。", upgradedDescription: "敌人失去 15 点力量。" },
  { id: "deep_breath", name: "深呼吸", character: "Colorless", type: "Skill", rarity: "Uncommon", cost: 0, description: "将弃牌堆中的牌洗入抽牌堆。抽 1 张牌。", upgradedDescription: "抽 2 张牌。" },
  { id: "discovery", name: "发现", character: "Colorless", type: "Skill", rarity: "Uncommon", cost: 1, description: "从 3 张随机牌中选择 1 张，将其放入手牌。消耗。", upgradedDescription: "将选中的牌放入手牌。" },
  { id: "dramatic_entrance", name: "华丽登场", character: "Colorless", type: "Attack", rarity: "Uncommon", cost: 0, description: "对所有敌人造成 8 点伤害。消耗。", upgradedDescription: "对所有敌人造成 12 点伤害。消耗。" },
  { id: "enlightenment", name: "觉悟", character: "Colorless", type: "Skill", rarity: "Uncommon", cost: 0, description: "在本回合，你手牌中所有牌的耗能降为 1。", upgradedDescription: "在本回合，你手牌中所有牌的耗能降为 1。" },
  { id: "flash_of_steel", name: "钢铁闪光", character: "Colorless", type: "Attack", rarity: "Uncommon", cost: 0, description: "造成 3 点伤害。抽 1 张牌。", upgradedDescription: "造成 6 点伤害。抽 1 张牌。" },
  { id: "forethought", name: "先见之明", character: "Colorless", type: "Skill", rarity: "Uncommon", cost: 0, description: "将手牌中任意数量的牌放到抽牌堆底部。它们在下回合耗能变为 0。", upgradedDescription: "将手牌中任意数量的牌放到抽牌堆底部。它们在下两回合耗能变为 0。" },
  { id: "good_instincts", name: "良好本能", character: "Colorless", type: "Skill", rarity: "Uncommon", cost: 0, description: "获得 6 点格挡。", upgradedDescription: "获得 9 点格挡。" },
  { id: "impatience", name: "急躁", character: "Colorless", type: "Skill", rarity: "Uncommon", cost: 0, description: "如果你手牌中没有攻击牌，抽 2 张牌。", upgradedDescription: "如果你手牌中没有攻击牌，抽 3 张牌。" },
  { id: "jack_of_all_trades", name: "万事通", character: "Colorless", type: "Skill", rarity: "Uncommon", cost: 0, description: "将 1 张随机无色牌加入手牌。消耗。", upgradedDescription: "将 2 张随机无色牌加入手牌。消耗。" },
  { id: "madness", name: "疯狂", character: "Colorless", type: "Skill", rarity: "Uncommon", cost: 1, description: "将你手牌中的一张牌的耗能降为 0 直到本场战斗结束。消耗。", upgradedDescription: "将你手牌中的一张牌的耗能降为 0 直到本场战斗结束。" },
  { id: "mind_blast", name: "心灵震撼", character: "Colorless", type: "Attack", rarity: "Uncommon", cost: 1, description: "造成你当前手牌数 3 倍的伤害。", upgradedDescription: "造成你当前手牌数 4 倍的伤害。" },
  { id: "panacea", name: "万能药", character: "Colorless", type: "Skill", rarity: "Uncommon", cost: 0, description: "获得 1 层人工制品。", upgradedDescription: "获得 2 层人工制品。" },
  { id: "panic_button", name: "恐慌按钮", character: "Colorless", type: "Skill", rarity: "Uncommon", cost: 0, description: "获得 30 点格挡。在本场战斗中，你无法再从卡牌中获得格挡。", upgradedDescription: "获得 40 点格挡。" },
  { id: "purity", name: "净化", character: "Colorless", type: "Skill", rarity: "Uncommon", cost: 0, description: "消耗手牌中最多 3 张牌。消耗。", upgradedDescription: "消耗手牌中最多 5 张牌。消耗。" },
  { id: "swift_strike", name: "迅捷打击", character: "Colorless", type: "Attack", rarity: "Uncommon", cost: 0, description: "造成 7 点伤害。", upgradedDescription: "造成 10 点伤害。" },
  { id: "trip", name: "绊倒", character: "Colorless", type: "Skill", rarity: "Uncommon", cost: 0, description: "给予 2 层易伤。", upgradedDescription: "给予 2 层易伤。" },

  // Ironclad Uncommon
  { id: "bloodletting", name: "放血", character: "Ironclad", type: "Skill", rarity: "Uncommon", cost: 0, description: "失去 3 点生命。获得 2 点能量。", upgradedDescription: "失去 3 点生命。获得 3 点能量。" },
  { id: "burning_pact", name: "燃烧契约", character: "Ironclad", type: "Skill", rarity: "Uncommon", cost: 1, description: "消耗 1 张牌。抽 2 张牌。", upgradedDescription: "消耗 1 张牌。抽 3 张牌。" },
  { id: "disarm", name: "缴械", character: "Ironclad", type: "Skill", rarity: "Uncommon", cost: 1, description: "敌人失去 2 点力量。消耗。", upgradedDescription: "敌人失去 3 点力量。消耗。" },
  { id: "dual_wield", name: "双持", character: "Ironclad", type: "Skill", rarity: "Uncommon", cost: 1, description: "将你手牌中的一张攻击牌或技能牌复制一张。", upgradedDescription: "将你手牌中的一张牌复制 2 张。" },
  { id: "evolve", name: "进化", character: "Ironclad", type: "Power", rarity: "Uncommon", cost: 1, description: "每当你抽到一张状态牌时，抽 1 张牌。", upgradedDescription: "每当你抽到一张状态牌时，抽 1 张牌。" },
  { id: "feel_no_pain", name: "无惧疼痛", character: "Ironclad", type: "Power", rarity: "Uncommon", cost: 1, description: "每当你消耗一张牌时，获得 3 点格挡。", upgradedDescription: "每当你消耗一张牌时，获得 4 点格挡。" },
  { id: "flame_barrier", name: "火焰障壁", character: "Ironclad", type: "Skill", rarity: "Uncommon", cost: 2, description: "获得 12 点格挡。你每受到一次攻击，对攻击者造成 4 点伤害。", upgradedDescription: "获得 16 点格挡。你每受到一次攻击，对攻击者造成 6 点伤害。" },
  { id: "ghostly_armor", name: "幽灵铠甲", character: "Ironclad", type: "Skill", rarity: "Uncommon", cost: 1, description: "虚无。获得 10 点格挡。", upgradedDescription: "虚无。获得 13 点格挡。" },
  { id: "hemokinesis", name: "血液沸腾", character: "Ironclad", type: "Attack", rarity: "Uncommon", cost: 1, description: "失去 2 点生命。造成 15 点伤害。", upgradedDescription: "失去 2 点生命。造成 20 点伤害。" },
  { id: "infernal_blade", name: "地狱之刃", character: "Ironclad", type: "Skill", rarity: "Uncommon", cost: 1, description: "随机将一张攻击牌加入手牌。它在本回合耗能变为 0。消耗。", upgradedDescription: "随机将一张攻击牌加入手牌。它在本回合耗能变为 0。" },
  { id: "inflame", name: "炎症", character: "Ironclad", type: "Power", rarity: "Uncommon", cost: 1, description: "获得 2 点力量。", upgradedDescription: "获得 3 点力量。" },
  { id: "intimidate", name: "威吓", character: "Ironclad", type: "Skill", rarity: "Uncommon", cost: 0, description: "给予所有敌人 1 层虚弱。消耗。", upgradedDescription: "给予所有敌人 2 层虚弱。消耗。" },
  { id: "metallicize", name: "金属化", character: "Ironclad", type: "Power", rarity: "Uncommon", cost: 1, description: "在你的回合结束时，获得 3 点格挡。", upgradedDescription: "在你的回合结束时，获得 4 点格挡。" },
  { id: "power_through", name: "全力以赴", character: "Ironclad", type: "Skill", rarity: "Uncommon", cost: 1, description: "获得 15 点格挡。在手牌中加入 2 张伤口。", upgradedDescription: "获得 20 点格挡。在手牌中加入 2 张伤口。" },
  { id: "pummel", name: "连续拳", character: "Ironclad", type: "Attack", rarity: "Uncommon", cost: 1, description: "造成 2 点伤害 4 次。", upgradedDescription: "造成 2 点伤害 5 次。" },
  { id: "rage", name: "狂怒", character: "Ironclad", type: "Attack", rarity: "Uncommon", cost: 0, description: "造成 14 点伤害。在本回合，你每打出一张攻击牌，获得 3 点格挡。", upgradedDescription: "造成 17 点伤害。在本回合，你每打出一张攻击牌，获得 4 点格挡。" },
  { id: "rupture", name: "破裂", character: "Ironclad", type: "Power", rarity: "Uncommon", cost: 1, description: "每当你从卡牌中失去生命时，获得 1 点力量。", upgradedDescription: "每当你从卡牌中失去生命时，获得 1 点力量。" },
  { id: "second_wind", name: "重振精神", character: "Ironclad", type: "Skill", rarity: "Uncommon", cost: 1, description: "消耗所有非攻击牌。每消耗一张，获得 5 点格挡。", upgradedDescription: "消耗所有非攻击牌。每消耗一张，获得 7 点格挡。" },
  { id: "seeing_red", name: "看见红", character: "Ironclad", type: "Skill", rarity: "Uncommon", cost: 1, description: "获得 2 点能量。消耗。", upgradedDescription: "获得 2 点能量。" },
  { id: "sentinel", name: "哨卫", character: "Ironclad", type: "Skill", rarity: "Uncommon", cost: 1, description: "获得 5 点格挡。如果这张牌被消耗，获得 3 点能量。", upgradedDescription: "获得 8 点格挡。如果这张牌被消耗，获得 4 点能量。" },
  { id: "sever_soul", name: "断魂", character: "Ironclad", type: "Attack", rarity: "Uncommon", cost: 2, description: "造成 16 点伤害。消耗所有非攻击牌。", upgradedDescription: "造成 22 点伤害。消耗所有非攻击牌。" },
  { id: "shockwave", name: "震荡波", character: "Ironclad", type: "Skill", rarity: "Uncommon", cost: 2, description: "给予所有敌人 3 层虚弱和 3 层易伤。消耗。", upgradedDescription: "给予所有敌人 5 层虚弱和 5 层易伤。消耗。" },
  { id: "spot_weakness", name: "发现弱点", character: "Ironclad", type: "Skill", rarity: "Uncommon", cost: 1, description: "如果敌人意图攻击，获得 3 点力量。", upgradedDescription: "如果敌人意图攻击，获得 4 点力量。" },
  { id: "uppercut", name: "上钩拳", character: "Ironclad", type: "Attack", rarity: "Uncommon", cost: 2, description: "造成 13 点伤害。给予 1 层虚弱。给予 1 层易伤。", upgradedDescription: "造成 13 点伤害。给予 2 层虚弱。给予 2 层易伤。" },
  { id: "whirlwind", name: "旋风斩", character: "Ironclad", type: "Attack", rarity: "Uncommon", cost: "X", description: "对所有敌人造成 5 点伤害 X 次。", upgradedDescription: "对所有敌人造成 8 点伤害 X 次。" },

  // Silent Common
  { id: "all_out_attack", name: "全力出击", character: "Silent", type: "Attack", rarity: "Common", cost: 1, description: "造成 10 点伤害。丢弃所有手牌。", upgradedDescription: "造成 14 点伤害。丢弃所有手牌。" },
  { id: "backflip", name: "后空翻", character: "Silent", type: "Skill", rarity: "Common", cost: 1, description: "获得 5 点格挡。抽 2 张牌。", upgradedDescription: "获得 8 点格挡。抽 2 张牌。" },
  { id: "blade_dance", name: "刀舞", character: "Silent", type: "Skill", rarity: "Common", cost: 1, description: "在手牌中加入 3 张小刀。", upgradedDescription: "在手牌中加入 4 张小刀。" },
  { id: "bouncing_flask", name: "弹跳烧瓶", character: "Silent", type: "Skill", rarity: "Common", cost: 2, description: "给予 3 层中毒 3 次。", upgradedDescription: "给予 3 层中毒 4 次。" },
  { id: "calculated_gamble", name: "精密盘算", character: "Silent", type: "Skill", rarity: "Common", cost: 0, description: "丢弃所有手牌。每丢弃一张，抽 1 张牌。消耗。", upgradedDescription: "丢弃所有手牌。每丢弃一张，抽 1 张牌。" },
  { id: "choke", name: "窒息", character: "Silent", type: "Attack", rarity: "Common", cost: 2, description: "造成 12 点伤害。在本回合，你每打出一张牌，目标失去 3 点生命。", upgradedDescription: "造成 12 点伤害。在本回合，你每打出一张牌，目标失去 5 点生命。" },
  { id: "cloak_and_dagger", name: "匕首之舞", character: "Silent", type: "Skill", rarity: "Common", cost: 1, description: "获得 6 点格挡。在手牌中加入 1 张小刀。", upgradedDescription: "获得 6 点格挡。在手牌中加入 2 张小刀。" },
  { id: "dash", name: "冲刺", character: "Silent", type: "Attack", rarity: "Common", cost: 2, description: "造成 10 点伤害。获得 5 点格挡。", upgradedDescription: "造成 13 点伤害。获得 8 点格挡。" },
  { id: "deadly_poison", name: "致命毒药", character: "Silent", type: "Skill", rarity: "Common", cost: 1, description: "给予 5 层中毒。", upgradedDescription: "给予 7 层中毒。" },
  { id: "deflect", name: "偏转", character: "Silent", type: "Skill", rarity: "Common", cost: 0, description: "获得 4 点格挡。", upgradedDescription: "获得 7 点格挡。" },
  { id: "dodge_and_roll", name: "闪避翻滚", character: "Silent", type: "Skill", rarity: "Common", cost: 1, description: "获得 4 点格挡。下回合获得 4 点格挡。", upgradedDescription: "获得 6 点格挡。下回合获得 6 点格挡。" },
  { id: "dagger_spray", name: "匕首喷射", character: "Silent", type: "Attack", rarity: "Common", cost: 1, description: "对所有敌人造成 4 点伤害 2 次。", upgradedDescription: "对所有敌人造成 6 点伤害 2 次。" },
  { id: "dagger_throw", name: "匕首投掷", character: "Silent", type: "Attack", rarity: "Common", cost: 1, description: "造成 9 点伤害。抽 1 张牌。丢弃 1 张牌。", upgradedDescription: "造成 12 点伤害。抽 1 张牌。丢弃 1 张牌。" },
  { id: "flying_knee", name: "飞膝", character: "Silent", type: "Attack", rarity: "Common", cost: 1, description: "造成 8 点伤害。下回合获得 1 点能量。", upgradedDescription: "造成 11 点伤害。下回合获得 2 点能量。" },
  { id: "footwork", name: "足技", character: "Silent", type: "Power", rarity: "Common", cost: 1, description: "获得 2 点敏捷。", upgradedDescription: "获得 3 点敏捷。", tips: "敏捷流核心。每点敏捷让每次获得格挡+1，配合生存本能、后空翻等叠格挡卡效率翻倍。升级后+3敏捷质变。" },
  { id: "glass_knife", name: "玻璃刀", character: "Silent", type: "Attack", rarity: "Common", cost: 1, description: "造成 8 点伤害 2 次。这张牌每被打出一次，本战斗中伤害减少 2。", upgradedDescription: "造成 12 点伤害 2 次。这张牌每被打出一次，本战斗中伤害减少 2。" },
  { id: "heel_hook", name: "脚跟勾", character: "Silent", type: "Attack", rarity: "Common", cost: 1, description: "造成 5 点伤害。如果敌人有虚弱，获得 1 点能量，抽 1 张牌。", upgradedDescription: "造成 8 点伤害。如果敌人有虚弱，获得 1 点能量，抽 1 张牌。" },
  { id: "masterful_stab", name: "精湛刺杀", character: "Silent", type: "Attack", rarity: "Common", cost: 0, description: "造成 12 点伤害。你每丢弃过一张牌，本战斗中耗能 +1。", upgradedDescription: "造成 16 点伤害。你每丢弃过一张牌，本战斗中耗能 +1。" },
  { id: "noxious_fumes", name: "恶臭烟雾", character: "Silent", type: "Power", rarity: "Common", cost: 1, description: "在你的回合开始时，给予所有敌人 2 层中毒。", upgradedDescription: "在你的回合开始时，给予所有敌人 3 层中毒。", tips: "毒流启动核心。只需要1费，之后每回合自动叠毒。配合催化剂可以指数级放大毒伤。对群怪尤其有效。" },
  { id: "piercing_wail", name: "尖啸", character: "Silent", type: "Skill", rarity: "Common", cost: 1, description: "给予所有敌人 3 层虚弱。消耗。", upgradedDescription: "给予所有敌人 3 层虚弱。消耗。" },
  { id: "poisoned_stab", name: "毒刺", character: "Silent", type: "Attack", rarity: "Common", cost: 1, description: "造成 6 点伤害。给予 3 层中毒。", upgradedDescription: "造成 8 点伤害。给予 4 层中毒。" },
  { id: "predator", name: "掠食者", character: "Silent", type: "Attack", rarity: "Common", cost: 2, description: "造成 15 点伤害。下回合抽 2 张牌。", upgradedDescription: "造成 20 点伤害。下回合抽 2 张牌。" },
  { id: "prepared", name: "准备", character: "Silent", type: "Skill", rarity: "Common", cost: 0, description: "抽 1 张牌。丢弃 1 张牌。", upgradedDescription: "抽 1 张牌。丢弃 1 张牌。" },
  { id: "quick_slash", name: "快斩", character: "Silent", type: "Attack", rarity: "Common", cost: 1, description: "造成 8 点伤害。抽 1 张牌。", upgradedDescription: "造成 12 点伤害。抽 1 张牌。" },
  { id: "slice", name: "斩击", character: "Silent", type: "Attack", rarity: "Common", cost: 0, description: "造成 5 点伤害。", upgradedDescription: "造成 8 点伤害。" },
  { id: "sucker_punch", name: " sucker_punch", character: "Silent", type: "Attack", rarity: "Common", cost: 1, description: "造成 7 点伤害。给予 1 层虚弱。", upgradedDescription: "造成 9 点伤害。给予 2 层虚弱。" },
  { id: "terror", name: "恐惧", character: "Silent", type: "Skill", rarity: "Common", cost: 1, description: "给予 99 层脆弱。消耗。", upgradedDescription: "给予 99 层脆弱。消耗。" },

  // Silent Uncommon
  { id: "catalyst", name: "催化剂", character: "Silent", type: "Skill", rarity: "Uncommon", cost: 1, description: "将目标的中毒层数翻倍。消耗。", upgradedDescription: "将目标的中毒层数变为 3 倍。消耗。", tips: "毒流爆发核心。先用恶臭烟雾/致命毒药叠几十层毒，然后催化剂直接翻倍或三倍，一回合带走Boss。升级后3倍效果更恐怖。" },
  { id: "corpse_explosion", name: "尸爆", character: "Silent", type: "Skill", rarity: "Uncommon", cost: 2, description: "给予 6 层中毒。当目标死亡时，对所有敌人造成等于其最大生命值的伤害。", upgradedDescription: "给予 9 层中毒。当目标死亡时，对所有敌人造成等于其最大生命值的伤害。" },
  { id: "crippling_cloud", name: "致残云雾", character: "Silent", type: "Skill", rarity: "Uncommon", cost: 2, description: "给予所有敌人 4 层中毒，给予 2 层虚弱。消耗。", upgradedDescription: "给予所有敌人 7 层中毒，给予 2 层虚弱。消耗。" },
  { id: "escape_plan", name: "逃脱计划", character: "Silent", type: "Skill", rarity: "Uncommon", cost: 0, description: "抽 1 张牌。如果你抽到的是技能牌，获得 3 点格挡。", upgradedDescription: "抽 1 张牌。如果你抽到的是技能牌，获得 5 点格挡。" },
  { id: "eviscerate", name: "开膛", character: "Silent", type: "Attack", rarity: "Uncommon", cost: 3, description: "造成 7 点伤害 3 次。你每在本回合丢弃过一张牌，耗能减少 1。", upgradedDescription: "造成 9 点伤害 3 次。你每在本回合丢弃过一张牌，耗能减少 1。" },
  { id: "finisher", name: "终结技", character: "Silent", type: "Attack", rarity: "Uncommon", cost: 1, description: "造成 6 点伤害。你本回合每打出过一张攻击牌，重复一次。", upgradedDescription: "造成 8 点伤害。你本回合每打出过一张攻击牌，重复一次。" },
  { id: "flechettes", name: "飞镖", character: "Silent", type: "Attack", rarity: "Uncommon", cost: 1, description: "造成 4 点伤害。你手牌中每有一张技能牌，重复一次。", upgradedDescription: "造成 6 点伤害。你手牌中每有一张技能牌，重复一次。" },
  { id: "leg_sweep", name: "横扫", character: "Silent", type: "Skill", rarity: "Uncommon", cost: 2, description: "给予 2 层虚弱。获得 12 点格挡。", upgradedDescription: "给予 3 层虚弱。获得 15 点格挡。" },
  { id: "malaise", name: "萎靡", character: "Silent", type: "Skill", rarity: "Uncommon", cost: "X", description: "X 耗能。给予 X 层虚弱。丢弃目标 X 张牌。消耗。", upgradedDescription: "X 耗能。给予 X+1 层虚弱。丢弃目标 X+1 张牌。消耗。" },
  { id: "nightmare", name: "梦魇", character: "Silent", type: "Skill", rarity: "Uncommon", cost: 3, description: "选择一张手牌。下回合开始时，将 3 张该牌的复制品放入手牌。消耗。", upgradedDescription: "选择一张手牌。下回合开始时，将 3 张该牌的复制品放入手牌。消耗。" },
  { id: "reflex", name: "反击", character: "Silent", type: "Skill", rarity: "Uncommon", cost: -1, description: "当你丢弃这张牌时，抽 2 张牌。不能被打出。", upgradedDescription: "当你丢弃这张牌时，抽 2 张牌。不能被打出。" },
  { id: "setup", name: "布置", character: "Silent", type: "Skill", rarity: "Uncommon", cost: 1, description: "将手牌中的一张牌放到抽牌堆顶部。它下回合耗能变为 0。", upgradedDescription: "将手牌中的一张牌放到抽牌堆顶部。它下两回合耗能变为 0。" },
  { id: "storm_of_steel", name: "钢铁风暴", character: "Silent", type: "Skill", rarity: "Uncommon", cost: 1, description: "在手牌中加入 1 张小刀。你手牌中每有一张牌，重复一次。", upgradedDescription: "在手牌中加入 1 张小刀。你手牌中每有一张牌，重复一次。" },
  { id: "thousand_cuts", name: "千刀万剐", character: "Silent", type: "Power", rarity: "Uncommon", cost: 2, description: "你每打出一张牌，对所有敌人造成 1 点伤害。", upgradedDescription: "你每打出一张牌，对所有敌人造成 1 点伤害。" },
  { id: "unload", name: "卸货", character: "Silent", type: "Attack", rarity: "Uncommon", cost: 1, description: "造成 14 点伤害。丢弃所有手牌。", upgradedDescription: "造成 18 点伤害。丢弃所有手牌。" },

  // Silent Rare
  { id: "adrenaline", name: "肾上腺素", character: "Silent", type: "Skill", rarity: "Rare", cost: 0, description: "获得 2 点能量。抽 2 张牌。消耗。", upgradedDescription: "获得 2 点能量。抽 2 张牌。" },
  { id: "accuracy", name: "精准", character: "Silent", type: "Power", rarity: "Rare", cost: 1, description: "小刀伤害 +4。", upgradedDescription: "小刀伤害 +6。" },
  { id: "after_image", name: "余像", character: "Silent", type: "Power", rarity: "Rare", cost: 1, description: "你每打出一张牌，获得 1 点格挡。", upgradedDescription: "你每打出一张牌，获得 1 点格挡。" },
  { id: "bullet_time", name: "子弹时间", character: "Silent", type: "Skill", rarity: "Rare", cost: 3, description: "在本回合，你不能再抽牌。你手牌中所有牌的耗能变为 0。", upgradedDescription: "在本回合，你不能再抽牌。你手牌中所有牌的耗能变为 0。" },
  { id: "burst", name: "爆发", character: "Silent", type: "Skill", rarity: "Rare", cost: 1, description: "你下一张技能牌打出两次。", upgradedDescription: "你下两张技能牌打出两次。" },
  { id: "die_die_die", name: "死吧死吧", character: "Silent", type: "Attack", rarity: "Rare", cost: 1, description: "对所有敌人造成 13 点伤害。丢弃所有手牌。消耗。", upgradedDescription: "对所有敌人造成 17 点伤害。丢弃所有手牌。消耗。" },
  { id: "envenom", name: "涂毒", character: "Silent", type: "Power", rarity: "Rare", cost: 2, description: "你每造成一次未被格挡的攻击伤害，给予 1 层中毒。", upgradedDescription: "你每造成一次未被格挡的攻击伤害，给予 1 层中毒。" },
  { id: "grand_finale", name: "盛大终曲", character: "Silent", type: "Attack", rarity: "Rare", cost: 0, description: "造成 50 点伤害。只有在抽牌堆为空时才能打出。", upgradedDescription: "造成 60 点伤害。只有在抽牌堆为空时才能打出。" },
  { id: "phantasmal_killer", name: "幻影杀手", character: "Silent", type: "Skill", rarity: "Rare", cost: 1, description: "下回合，你的攻击伤害翻倍。", upgradedDescription: "下回合，你的攻击伤害翻倍。" },
  { id: "tools_of_the_trade", name: "运筹帷幄", character: "Silent", type: "Power", rarity: "Rare", cost: 1, description: "在你的回合开始时，抽 1 张牌，丢弃 1 张牌。", upgradedDescription: "在你的回合开始时，抽 1 张牌，丢弃 1 张牌。" },
  { id: "well_laid_plans", name: "周密计划", character: "Silent", type: "Power", rarity: "Rare", cost: 1, description: "在你的回合结束时，保留至多 1 张手牌。", upgradedDescription: "在你的回合结束时，保留至多 2 张手牌。" },

  // Defect Basic
  { id: "strike_b", name: "打击", character: "Defect", type: "Attack", rarity: "Basic", cost: 1, description: "造成 6 点伤害。", upgradedDescription: "造成 9 点伤害。" },
  { id: "defend_b", name: "防御", character: "Defect", type: "Skill", rarity: "Basic", cost: 1, description: "获得 5 点格挡。", upgradedDescription: "获得 8 点格挡。" },
  { id: "dualcast", name: "双重施放", character: "Defect", type: "Skill", rarity: "Basic", cost: 1, description: "触发你的最右侧充能球的被动效果 2 次。", upgradedDescription: "触发你的最右侧充能球的被动效果 2 次。" },
  { id: "zap", name: "电击", character: "Defect", type: "Skill", rarity: "Basic", cost: 1, description: "生成 1 个闪电充能球。", upgradedDescription: "生成 1 个闪电充能球。" },

  // Defect Common
  { id: "ball_lightning", name: "球状闪电", character: "Defect", type: "Attack", rarity: "Common", cost: 1, description: "造成 7 点伤害。生成 1 个闪电充能球。", upgradedDescription: "造成 10 点伤害。生成 1 个闪电充能球。" },
  { id: "barrier", name: "屏障", character: "Defect", type: "Skill", rarity: "Common", cost: 0, description: "获得 12 点格挡。消耗。", upgradedDescription: "获得 16 点格挡。消耗。" },
  { id: "charge_battery", name: "充能电池", character: "Defect", type: "Skill", rarity: "Common", cost: 1, description: "获得 7 点格挡。下回合获得 1 点能量。", upgradedDescription: "获得 10 点格挡。下回合获得 1 点能量。" },
  { id: "cold_snap", name: "冷冷", character: "Defect", type: "Attack", rarity: "Common", cost: 1, description: "造成 6 点伤害。生成 1 个冰霜充能球。", upgradedDescription: "造成 9 点伤害。生成 1 个冰霜充能球。" },
  { id: "compile_driver", name: "编译冲击", character: "Defect", type: "Attack", rarity: "Common", cost: 1, description: "造成 7 点伤害。你每有一种充能球，抽 1 张牌。", upgradedDescription: "造成 10 点伤害。你每有一种充能球，抽 1 张牌。" },
  { id: "coolheaded", name: "冷却", character: "Defect", type: "Skill", rarity: "Common", cost: 1, description: "生成 1 个冰霜充能球。抽 1 张牌。", upgradedDescription: "生成 1 个冰霜充能球。抽 2 张牌。" },
  { id: "hologram", name: "通晓卡片", character: "Defect", type: "Skill", rarity: "Common", cost: 1, description: "获得 3 点格挡。将弃牌堆中的一张牌放入手牌。消耗。", upgradedDescription: "获得 5 点格挡。将弃牌堆中的一张牌放入手牌。" },
  { id: "melter", name: "熔毁", character: "Defect", type: "Attack", rarity: "Common", cost: 1, description: "造成 10 点伤害。移除所有敌人的格挡。", upgradedDescription: "造成 10 点伤害。移除所有敌人的格挡。" },
  { id: "reprogram", name: "重编程", character: "Defect", type: "Skill", rarity: "Common", cost: 1, description: "失去 1 点集中。获得 1 点力量。获得 1 点敏捷。", upgradedDescription: "失去 1 点集中。获得 2 点力量。获得 2 点敏捷。" },
  { id: "rip_and_tear", name: "撕裂", character: "Defect", type: "Attack", rarity: "Common", cost: 1, description: "造成 7 点伤害 2 次。", upgradedDescription: "造成 9 点伤害 2 次。" },
  { id: "self_repair", name: "自修复", character: "Defect", type: "Power", rarity: "Common", cost: 1, description: "在你的回合结束时，获得 2 点生命。", upgradedDescription: "在你的回合结束时，获得 3 点生命。" },
  { id: "skim", name: "冷静沉着", character: "Defect", type: "Skill", rarity: "Common", cost: 1, description: "抽 3 张牌。丢弃 1 张牌。", upgradedDescription: "抽 4 张牌。丢弃 1 张牌。" },
  { id: "stack", name: "堆栈", character: "Defect", type: "Skill", rarity: "Common", cost: 1, description: "获得等同于弃牌堆中牌数量的格挡。", upgradedDescription: "获得等同于弃牌堆中牌数量的格挡。" },
  { id: "steam_barrier", name: "蒸汽壁垒", character: "Defect", type: "Skill", rarity: "Common", cost: 0, description: "获得 6 点格挡。在本战斗中，这张牌获得的格挡减少 1。", upgradedDescription: "获得 6 点格挡。在本战斗中，这张牌获得的格挡减少 1。" },
  { id: "streamline", name: "精简", character: "Defect", type: "Attack", rarity: "Common", cost: 2, description: "造成 15 点伤害。本战斗中耗能减少 1。", upgradedDescription: "造成 20 点伤害。本战斗中耗能减少 1。" },
  { id: "white_noise", name: "白色噪音", character: "Defect", type: "Skill", rarity: "Common", cost: 1, description: "随机将一张能力牌加入手牌。消耗。", upgradedDescription: "随机将一张能力牌加入手牌。它本回合耗能变为 0。消耗。" },

  // Defect Uncommon
  { id: "aggregate", name: "聚合", character: "Defect", type: "Skill", rarity: "Uncommon", cost: 1, description: "抽 1 张牌。你抽牌堆中每有 4 张牌，获得 1 点能量。", upgradedDescription: "抽 1 张牌。你抽牌堆中每有 3 张牌，获得 1 点能量。" },
  { id: "auto_shields", name: "自动护盾", character: "Defect", type: "Skill", rarity: "Uncommon", cost: 1, description: "如果你没有格挡，获得 11 点格挡。", upgradedDescription: "如果你没有格挡，获得 15 点格挡。" },
  { id: "blizzard", name: "暴风雪", character: "Defect", type: "Attack", rarity: "Uncommon", cost: 1, description: "本战斗中每生成过一个冰霜充能球，对所有敌人造成 2 点伤害 1 次。", upgradedDescription: "本战斗中每生成过一个冰霜充能球，对所有敌人造成 2 点伤害 1 次。" },
  { id: "darkness", name: "黑暗之握", character: "Defect", type: "Skill", rarity: "Uncommon", cost: 1, description: "生成 1 个黑暗充能球。", upgradedDescription: "生成 1 个黑暗充能球。" },
  { id: "double_energy", name: "双重能量", character: "Defect", type: "Skill", rarity: "Uncommon", cost: 3, description: "将你的能量翻倍。消耗。", upgradedDescription: "将你的能量翻倍。" },
  { id: "equilibrium", name: "均衡", character: "Defect", type: "Skill", rarity: "Uncommon", cost: 2, description: "获得 6 点格挡。在本回合，保留你的手牌。", upgradedDescription: "获得 10 点格挡。在本回合，保留你的手牌。" },
  { id: "force_field", name: "力场", character: "Defect", type: "Skill", rarity: "Uncommon", cost: 4, description: "获得 12 点格挡。你手牌中每有一张能力牌，耗能减少 1。", upgradedDescription: "获得 12 点格挡。你手牌中每有一张能力牌，耗能减少 1。" },
  { id: "fission", name: "裂变", character: "Defect", type: "Skill", rarity: "Uncommon", cost: 0, description: "消耗所有充能球。每消耗一个充能球，获得相应能量并抽 1 张牌。", upgradedDescription: "消耗所有充能球。每消耗一个充能球，获得相应能量并抽 1 张牌。" },
  { id: "genetic_algorithm", name: "遗传算法", character: "Defect", type: "Skill", rarity: "Uncommon", cost: 1, description: "获得 1 点格挡。在每场战斗结束时，获得 2 点格挡。消耗。", upgradedDescription: "获得 1 点格挡。在每场战斗结束时，获得 3 点格挡。消耗。" },
  { id: "glacier", name: "冰川", character: "Defect", type: "Skill", rarity: "Uncommon", cost: 2, description: "获得 7 点格挡。生成 2 个冰霜充能球。", upgradedDescription: "获得 10 点格挡。生成 2 个冰霜充能球。", tips: "防御+冰霜球两不误。2费换7格挡+2冰霜球，性价比极高。升级后10格挡更稳。冰霜流和通用防御都非常实用。" },
  { id: "meteor_strike", name: "陨石撞击", character: "Defect", type: "Attack", rarity: "Uncommon", cost: 5, description: "造成 24 点伤害。生成 3 个等离子充能球。", upgradedDescription: "造成 30 点伤害。生成 3 个等离子充能球。" },
  { id: "rainbow", name: "彩虹", character: "Defect", type: "Skill", rarity: "Uncommon", cost: 2, description: "生成 1 个闪电、冰霜、黑暗充能球。消耗。", upgradedDescription: "生成 1 个闪电、冰霜、黑暗充能球。" },
  { id: "reboot", name: "重组", character: "Defect", type: "Skill", rarity: "Uncommon", cost: 0, description: "消耗所有手牌和抽牌堆。下回合抽 4 张牌。消耗。", upgradedDescription: "消耗所有手牌和抽牌堆。下回合抽 4 张牌。消耗。" },
  { id: "seek", name: "搜寻", character: "Defect", type: "Skill", rarity: "Uncommon", cost: 0, description: "从抽牌堆中选择一张牌放入手牌。消耗。", upgradedDescription: "从抽牌堆中选择 2 张牌放入手牌。消耗。" },
  { id: "sweeping_beam", name: "碎片清理", character: "Defect", type: "Attack", rarity: "Uncommon", cost: 1, description: "对所有敌人造成 6 点伤害。抽 1 张牌。", upgradedDescription: "对所有敌人造成 9 点伤害。抽 1 张牌。" },
  { id: "echo_form", name: "回响形态", character: "Defect", type: "Power", rarity: "Uncommon", cost: 3, description: "每回合你打出的第一张牌打出两次。", upgradedDescription: "每回合你打出的第一张牌打出两次。" },
  { id: "electrodynamics", name: "电动力学", character: "Defect", type: "Power", rarity: "Uncommon", cost: 2, description: "充能球的被动效果作用于所有敌人。生成 1 个闪电和 1 个冰霜充能球。", upgradedDescription: "充能球的被动效果作用于所有敌人。生成 1 个闪电和 1 个冰霜充能球。" },

  // Defect Rare
  { id: "biased_cognition", name: "偏差认知", character: "Defect", type: "Power", rarity: "Rare", cost: 1, description: "获得 4 点集中。在你的回合开始时，失去 1 点集中。", upgradedDescription: "获得 5 点集中。在你的回合开始时，失去 1 点集中。", tips: "集中流核心，但每回合会衰减。配合橙色药丸或人工制品可以阻止集中流失。开局4-5集中让充能球伤害质变。" },
  { id: "core_surge", name: "核心电涌", character: "Defect", type: "Attack", rarity: "Rare", cost: 1, description: "造成 11 点伤害。获得 1 层人工制品。", upgradedDescription: "造成 11 点伤害。获得 2 层人工制品。" },
  { id: "creative_ai", name: "AI创造", character: "Defect", type: "Power", rarity: "Rare", cost: 3, description: "在你的回合开始时，将一张随机能力牌加入手牌。", upgradedDescription: "在你的回合开始时，将一张随机能力牌加入手牌。" },
  { id: "hello_world", name: "你好世界", character: "Defect", type: "Power", rarity: "Rare", cost: 1, description: "在你的回合开始时，将一张随机普通牌加入手牌。", upgradedDescription: "在你的回合开始时，将一张随机普通牌加入手牌。" },
  { id: "hyperbeam", name: "超光速", character: "Defect", type: "Attack", rarity: "Rare", cost: 2, description: "造成 26 点伤害。失去 3 点集中。", upgradedDescription: "造成 34 点伤害。失去 3 点集中。" },
  { id: "machine_learning", name: "机器学习", character: "Defect", type: "Power", rarity: "Rare", cost: 1, description: "在你的回合开始时，额外抽 1 张牌。", upgradedDescription: "在你的回合开始时，额外抽 1 张牌。" },
  { id: "thunder_strike", name: "雷霆打击", character: "Defect", type: "Attack", rarity: "Rare", cost: 3, description: "本战斗中每生成过一个闪电充能球，造成 7 点伤害 1 次。", upgradedDescription: "本战斗中每生成过一个闪电充能球，造成 9 点伤害 1 次。" },

  // Watcher Basic
  { id: "strike_p", name: "打击", character: "Watcher", type: "Attack", rarity: "Basic", cost: 1, description: "造成 6 点伤害。", upgradedDescription: "造成 9 点伤害。" },
  { id: "defend_p", name: "防御", character: "Watcher", type: "Skill", rarity: "Basic", cost: 1, description: "获得 5 点格挡。", upgradedDescription: "获得 8 点格挡。" },
  { id: "eruption", name: "爆发", character: "Watcher", type: "Attack", rarity: "Basic", cost: 2, description: "造成 9 点伤害。进入愤怒姿态。", upgradedDescription: "造成 9 点伤害。进入愤怒姿态。" },
  { id: "vigilance", name: "警惕", character: "Watcher", type: "Skill", rarity: "Basic", cost: 2, description: "获得 8 点格挡。进入冷静姿态。", upgradedDescription: "获得 12 点格挡。进入冷静姿态。" },

  // Watcher Common
  { id: "bow", name: "弓步", character: "Watcher", type: "Attack", rarity: "Common", cost: 1, description: "造成 8 点伤害。进入愤怒姿态。", upgradedDescription: "造成 10 点伤害。进入愤怒姿态。" },
  { id: "consecrate", name: "净化", character: "Watcher", type: "Attack", rarity: "Common", cost: 0, description: "造成 5 点伤害。对所有敌人。", upgradedDescription: "造成 8 点伤害。对所有敌人。" },
  { id: "crush_joints", name: "粉碎关节", character: "Watcher", type: "Attack", rarity: "Common", cost: 1, description: "造成 8 点伤害。如果上一张打出的牌是技能牌，给予 1 层脆弱。", upgradedDescription: "造成 10 点伤害。如果上一张打出的牌是技能牌，给予 1 层脆弱。" },
  { id: "cut_through_fate", name: "斩破命运", character: "Watcher", type: "Attack", rarity: "Common", cost: 1, description: "造成 7 点伤害。占卜 2。抽 1 张牌。", upgradedDescription: "造成 9 点伤害。占卜 3。抽 1 张牌。" },
  { id: "evaluate", name: "评价", character: "Watcher", type: "Skill", rarity: "Common", cost: 1, description: "获得 6 点格挡。占卜 1。下回合抽 1 张牌。", upgradedDescription: "获得 10 点格挡。占卜 1。下回合抽 1 张牌。" },
  { id: "halt", name: "止步", character: "Watcher", type: "Skill", rarity: "Common", cost: 0, description: "获得 3 点格挡。如果你在冷静姿态，获得 9 点额外格挡。", upgradedDescription: "获得 4 点格挡。如果你在冷静姿态，获得 14 点额外格挡。" },
  { id: "just_lucky", name: "运气不错", character: "Watcher", type: "Attack", rarity: "Common", cost: 0, description: "造成 3 点伤害。获得 2 点格挡。占卜 1。", upgradedDescription: "造成 4 点伤害。获得 3 点格挡。占卜 1。" },
  { id: "meditate", name: "冥想", character: "Watcher", type: "Skill", rarity: "Common", cost: 1, description: "获得 6 点格挡。进入冷静姿态。将弃牌堆中的 2 张牌放入手牌。", upgradedDescription: "获得 8 点格挡。进入冷静姿态。将弃牌堆中的 2 张牌放入手牌。" },
  { id: "perseverance", name: "坚韧", character: "Watcher", type: "Skill", rarity: "Common", cost: 1, description: "获得 5 点格挡。如果你在平静姿态，获得 7 点额外格挡。", upgradedDescription: "获得 8 点格挡。如果你在平静姿态，获得 7 点额外格挡。" },
  { id: "prostrate", name: "跪拜", character: "Watcher", type: "Skill", rarity: "Common", cost: 0, description: "获得 2 点格挡。获得 3 层真言。", upgradedDescription: "获得 4 点格挡。获得 3 层真言。" },
  { id: "protect", name: "保护", character: "Watcher", type: "Skill", rarity: "Common", cost: 2, description: "获得 12 点格挡。消耗。", upgradedDescription: "获得 16 点格挡。消耗。" },
  { id: "sanctity", name: "圣洁", character: "Watcher", type: "Skill", rarity: "Common", cost: 1, description: "如果你上一张打出的牌是攻击牌，获得 6 点格挡，抽 1 张牌。", upgradedDescription: "如果你上一张打出的牌是攻击牌，获得 9 点格挡，抽 1 张牌。" },
  { id: "sands_of_time", name: "时间之沙", character: "Watcher", type: "Attack", rarity: "Common", cost: 4, description: "造成 20 点伤害。固有。在本回合结束时，将其放到抽牌堆底部。", upgradedDescription: "造成 26 点伤害。固有。在本回合结束时，将其放到抽牌堆底部。" },
  { id: "sash_whip", name: "腰带鞭", character: "Watcher", type: "Attack", rarity: "Common", cost: 1, description: "造成 8 点伤害。如果上一张打出的牌是攻击牌，给予 1 层虚弱。", upgradedDescription: "造成 10 点伤害。如果上一张打出的牌是攻击牌，给予 1 层虚弱。" },
  { id: "simmering_fury", name: "暗涌怒火", character: "Watcher", type: "Skill", rarity: "Common", cost: 1, description: "在你的回合结束时，进入愤怒姿态。", upgradedDescription: "在你的回合结束时，进入愤怒姿态。抽 1 张牌。" },
  { id: "spirit_shield", name: "灵体盾", character: "Watcher", type: "Skill", rarity: "Common", cost: 2, description: "获得 3 点格挡。你每有一张手牌，重复一次。", upgradedDescription: "获得 4 点格挡。你每有一张手牌，重复一次。" },
  { id: "swivel", name: "转体", character: "Watcher", type: "Skill", rarity: "Common", cost: 2, description: "获得 8 点格挡。下回合你打出的第一张攻击牌耗能变为 0。", upgradedDescription: "获得 11 点格挡。下回合你打出的第一张攻击牌耗能变为 0。" },
  { id: "talk_to_the_hand", name: "神格之证", character: "Watcher", type: "Attack", rarity: "Common", cost: 1, description: "造成 5 点伤害。每当目标受到攻击时，获得 2 点格挡。", upgradedDescription: "造成 7 点伤害。每当目标受到攻击时，获得 2 点格挡。", tips: "愤怒姿态下配合连击类卡牌收益极高。每次攻击都+2格挡，一回合打出5张攻击就白送10格挡。升级后7伤害更实用。" },
  { id: "wheel_kick", name: "回旋踢", character: "Watcher", type: "Attack", rarity: "Common", cost: 2, description: "造成 15 点伤害。抽 2 张牌。", upgradedDescription: "造成 15 点伤害。抽 2 张牌。" },

  // Watcher Uncommon
  { id: "collect", name: "收集", character: "Watcher", type: "Skill", rarity: "Uncommon", cost: 2, description: "在你的回合结束时，将弃牌堆中的一张牌放到抽牌堆顶部。", upgradedDescription: "在你的回合结束时，将弃牌堆中的 2 张牌放到抽牌堆顶部。" },
  { id: "deva_form", name: "天形态", character: "Watcher", type: "Power", rarity: "Uncommon", cost: 3, description: "在你的回合开始时，获得 1 点能量，你的手牌上限 +1。", upgradedDescription: "在你的回合开始时，获得 1 点能量，你的手牌上限 +1。" },
  { id: "devotion", name: "虔诚", character: "Watcher", type: "Power", rarity: "Uncommon", cost: 1, description: "在你的回合开始时，获得 2 层真言。", upgradedDescription: "在你的回合开始时，获得 3 层真言。" },
  { id: "foreign_influence", name: "异域影响", character: "Watcher", type: "Skill", rarity: "Uncommon", cost: 0, description: "从 3 张随机无色攻击牌中选择 1 张加入手牌。它本回合耗能变为 0。消耗。", upgradedDescription: "从 3 张随机无色攻击牌中选择 1 张加入手牌。它本回合耗能变为 0。消耗。" },
  { id: "foresight", name: "预见", character: "Watcher", type: "Power", rarity: "Uncommon", cost: 1, description: "在你的回合开始时，占卜 3。", upgradedDescription: "在你的回合开始时，占卜 3。" },
  { id: "indignation", name: "义愤", character: "Watcher", type: "Skill", rarity: "Uncommon", cost: 1, description: "给予所有敌人 3 层虚弱。如果你在愤怒姿态，给予 3 层易伤。", upgradedDescription: "给予所有敌人 3 层虚弱。如果你在愤怒姿态，给予 5 层易伤。" },
  { id: "inner_peace", name: "内心宁静", character: "Watcher", type: "Skill", rarity: "Uncommon", cost: 1, description: "如果你在平静姿态，抽 3 张牌。否则，进入平静姿态。", upgradedDescription: "如果你在平静姿态，抽 4 张牌。否则，进入平静姿态。" },
  { id: "like_water", name: "心如止水", character: "Watcher", type: "Power", rarity: "Uncommon", cost: 1, description: "如果你在平静姿态，在你的回合结束时获得 5 点格挡。", upgradedDescription: "如果你在平静姿态，在你的回合结束时获得 7 点格挡。" },
  { id: "master_reality", name: "大师风范", character: "Watcher", type: "Power", rarity: "Uncommon", cost: 1, description: "每当一张牌被生成时，将其升级。", upgradedDescription: "每当一张牌被生成时，将其升级。" },
  { id: "omniscience", name: "全知", character: "Watcher", type: "Skill", rarity: "Uncommon", cost: 4, description: "从抽牌堆中选择 2 张牌，免费打出并消耗。", upgradedDescription: "从抽牌堆中选择 2 张牌，免费打出并消耗。" },
  { id: "rushdown", name: "空明拳", character: "Watcher", type: "Power", rarity: "Uncommon", cost: 1, description: "每当你进入愤怒姿态时，抽 2 张牌。", upgradedDescription: "每当你进入愤怒姿态时，抽 2 张牌。" },
  { id: "scrawl", name: "涂鸦", character: "Watcher", type: "Skill", rarity: "Uncommon", cost: 1, description: "抽 10 张牌。丢弃你的手牌。消耗。", upgradedDescription: "抽 10 张牌。丢弃你的手牌。消耗。" },
  { id: "worship", name: "崇拜", character: "Watcher", type: "Skill", rarity: "Uncommon", cost: 2, description: "获得 5 层真言。", upgradedDescription: "获得 5 层真言。" },
  { id: "tantrum", name: "狂怒", character: "Watcher", type: "Attack", rarity: "Uncommon", cost: 1, description: "造成 3 点伤害 3 次。进入愤怒姿态。", upgradedDescription: "造成 3 点伤害 4 次。进入愤怒姿态。", tips: "姿态流启动卡。1费打3次+进愤怒，既能触发愤怒姿态的双倍伤害，又能配合神格之证叠格挡。升级后4次伤害更高。" },
  { id: "flurry_of_blows", name: "连击", character: "Watcher", type: "Attack", rarity: "Uncommon", cost: 0, description: "造成 4 点伤害 3 次。如果你在姿态间切换过，将这张牌返回手牌。", upgradedDescription: "造成 6 点伤害 3 次。如果你在姿态间切换过，将这张牌返回手牌。" },

  // Watcher Rare
  { id: "alpha", name: "阿尔法", character: "Watcher", type: "Skill", rarity: "Rare", cost: 1, description: "在你的回合开始时，将 1 张贝塔放入抽牌堆。消耗。", upgradedDescription: "在你的回合开始时，将 1 张贝塔放入抽牌堆。消耗。" },
  { id: "blasphemy", name: "亵渎", character: "Watcher", type: "Skill", rarity: "Rare", cost: 1, description: "进入神格姿态。在下一回合，你死亡。消耗。", upgradedDescription: "进入神格姿态。在下一回合，你死亡。消耗。", tips: "高风险高回报的爆发卡。神格姿态下所有攻击伤害x3，但下一回合必死。只适合有把握一回合击杀时使用。配合瓶装旋风可以稳定启动。" },
  { id: "brilliance", name: "辉煌", character: "Watcher", type: "Attack", rarity: "Rare", cost: 1, description: "造成 12 点伤害。你每有一层真言，伤害 +1。", upgradedDescription: "造成 16 点伤害。你每有一层真言，伤害 +1。" },
  { id: "establishment", name: "建立", character: "Watcher", type: "Power", rarity: "Rare", cost: 1, description: "在你的回合结束时，保留的手牌耗能减少 1。", upgradedDescription: "在你的回合结束时，保留的手牌耗能减少 1。" },
  { id: "judgment", name: "审判", character: "Watcher", type: "Skill", rarity: "Rare", cost: 1, description: "如果敌人的生命值低于等于 30，将其即死。", upgradedDescription: "如果敌人的生命值低于等于 30，将其即死。" },
  { id: "lesson_learned", name: "吸取教训", character: "Watcher", type: "Attack", rarity: "Rare", cost: 2, description: "造成 2 点伤害。如果这张牌击杀敌人，永久升级手牌中一张随机牌。消耗。", upgradedDescription: "造成 3 点伤害。如果这张牌击杀敌人，永久升级手牌中一张随机牌。消耗。" },

  // Curses
  { id: "ascenders_bane", name: "进阶之灾", character: "Curse", type: "Curse", rarity: "Curse", cost: -1, description: "不能被打出。" },
  { id: "clumsy", name: "笨拙", character: "Curse", type: "Curse", rarity: "Curse", cost: -1, description: "不能被打出。" },
  { id: "curse_of_the_bell", name: "铃铛的诅咒", character: "Curse", type: "Curse", rarity: "Curse", cost: -1, description: "不能被打出。无法从牌组中移除。" },
  { id: "decay", name: "腐朽", character: "Curse", type: "Curse", rarity: "Curse", cost: -1, description: "不能被打出。在你的回合结束时，受到 2 点伤害。" },
  { id: "doubt", name: "疑虑", character: "Curse", type: "Curse", rarity: "Curse", cost: -1, description: "不能被打出。在你的回合结束时，获得 1 层虚弱。" },
  { id: "injury", name: "受伤", character: "Curse", type: "Curse", rarity: "Curse", cost: -1, description: "不能被打出。" },
  { id: "normality", name: "常态", character: "Curse", type: "Curse", rarity: "Curse", cost: -1, description: "不能被打出。在你的手牌中时，你每回合不能打出超过 3 张牌。" },
  { id: "pain", name: "疼痛", character: "Curse", type: "Curse", rarity: "Curse", cost: -1, description: "不能被打出。当你打出一张牌时，受到 1 点伤害。" },
  { id: "parasite", name: "寄生", character: "Curse", type: "Curse", rarity: "Curse", cost: -1, description: "不能被打出。如果被移除，失去 3 点最大生命。" },
  { id: "regret", name: "悔恨", character: "Curse", type: "Curse", rarity: "Curse", cost: -1, description: "不能被打出。在你的回合结束时，受到等于你手牌数量的伤害。" },
  { id: "shame", name: "羞耻", character: "Curse", type: "Curse", rarity: "Curse", cost: -1, description: "不能被打出。在你的回合结束时，获得 1 层脆弱。" },
  { id: "writhe", name: "挣扎", character: "Curse", type: "Curse", rarity: "Curse", cost: -1, description: "不能被打出。固有。" },
];

export const characters: { id: Character; name: string; color: string }[] = [
  { id: "Ironclad", name: "铁甲战士", color: "#c0392b" },
  { id: "Silent", name: "静默猎手", color: "#27ae60" },
  { id: "Defect", name: "故障机器人", color: "#2980b9" },
  { id: "Watcher", name: "观察者", color: "#8e44ad" },
  { id: "Colorless", name: "无色", color: "#7f8c8d" },
  { id: "Curse", name: "诅咒", color: "#2c3e50" },
];

export function getCardsByCharacter(character: Character): Card[] {
  return cards.filter((c) => c.character === character);
}

export function getCardsByType(type: CardType): Card[] {
  return cards.filter((c) => c.type === type);
}

export function getCardsByRarity(rarity: CardRarity): Card[] {
  return cards.filter((c) => c.rarity === rarity);
}

export function searchCards(query: string): Card[] {
  const q = query.toLowerCase();
  return cards.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
  );
}
