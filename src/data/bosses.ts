export type Act = 1 | 2 | 3 | 4;

export interface BossAbility {
  name: string;
  description: string;
}

export interface Boss {
  id: string;
  name: string;
  act: Act;
  hp: string;
  traits: string[];
  abilities: BossAbility[];
  phases?: string;
  strategy: string;
}

export const bosses: Boss[] = [
  // Act 1 Bosses
  {
    id: "slime_boss",
    name: "史莱姆老大",
    act: 1,
    hp: "140 / 150",
    traits: ["会在生命值降至 50% 时分裂为两个中型史莱姆", "每次攻击附加虚弱"],
    abilities: [
      { name: "准备", description: "获得格挡，下一回合攻击力大幅提升。" },
      { name: "撞击", description: "造成 35 点伤害，给予 2 层虚弱。" },
      { name: "分裂", description: "分裂为两个中型史莱姆，每个继承当前生命值的一半。" },
    ],
    strategy: "优先在分裂前尽量压低血量，让分裂后的两个史莱姆血量更低。AOE伤害或高爆发流派占优。注意虚弱层数会叠加，尽量快速击杀。",
  },
  {
    id: "hexaghost",
    name: "六火亡魂",
    act: 1,
    hp: "250 / 260",
    traits: ["第一回合必定使用充能", "充能后下一回合造成大量伤害"],
    abilities: [
      { name: "激活", description: "第一回合使用，给予 2 层易伤，下一回合造成 6x6 点伤害。" },
      { name: "地狱火", description: "造成 6 次伤害，每次伤害递增。" },
      { name: "烈焰吐息", description: "造成 2x6 点伤害，给予 1 层灼伤。" },
    ],
    strategy: "第一回合全力输出，因为它会给自己易伤。第二回合前需要足够的格挡来抵挡地狱火。循环节奏：输出→防御→输出。",
  },
  {
    id: "guardian",
    name: "守护者",
    act: 1,
    hp: "240 / 250",
    traits: ["会在攻击和防御姿态间切换", "防御姿态下受到攻击会反弹伤害"],
    abilities: [
      { name: "愤怒模式", description: "进入愤怒姿态，攻击力大幅提升，受到攻击时反弹 3 点伤害。" },
      { name: "连续攻击", description: "造成 3 次伤害，每次 8-12 点。" },
      { name: "防御姿态", description: "获得大量格挡，停止反弹。" },
    ],
    strategy: "愤怒模式下避免频繁使用小额攻击（会被反弹）。等它进入防御姿态时再用攻击牌输出。技能流和爆发流比较有优势。",
  },

  // Act 2 Bosses
  {
    id: "champ",
    name: "冠军",
    act: 2,
    hp: "420 / 440",
    traits: ["生命值降至 50% 以下时会恢复所有生命并进入狂暴", "会给予虚弱和易伤"],
    abilities: [
      { name: "重击", description: "造成 18 点伤害，给予 2 层易伤和 2 层虚弱。" },
      { name: "防御", description: "获得 15 点格挡。" },
      { name: "愤怒", description: "低于 50% 生命时使用，回复全部生命，获得 6 点力量。" },
      { name: "终结技", description: "狂暴后使用，造成 30 点伤害。" },
    ],
    strategy: "两种打法：1) 控血到 50% 以下一次性爆发跳过狂暴阶段；2) 平稳输出进入狂暴后慢慢磨。准备足够的防御来应对狂暴后的高伤害。",
  },
  {
    id: "bronze_automaton",
    name: "铜制机械人",
    act: 2,
    hp: "300 / 320",
    traits: ["会召唤铜球辅助战斗", "铜球会给机械人提供增益"],
    abilities: [
      { name: "召唤铜球", description: "召唤一个铜球（45 生命），铜球存活时机械人获得 3 点力量。" },
      { name: "光束", description: "造成 8x2 点伤害。" },
      { name: "超频", description: "获得 3 点力量，铜球攻击一次。" },
    ],
    strategy: "优先击杀铜球，否则机械人会持续获得力量加成。AOE 流派可以同时处理铜球和本体。注意控制铜球数量。",
  },
  {
    id: "collecter",
    name: "收藏家",
    act: 2,
    hp: "280 / 300",
    traits: ["会召唤火炬头", "火炬头会给予收藏家增益"],
    abilities: [
      { name: "召唤火炬头", description: "召唤一个火炬头，火炬头会给予收藏家 1 点力量。" },
      { name: "火焰喷射", description: "造成 18 点伤害，给予 2 层灼伤。" },
      { name: "吞噬", description: "如果火炬头在场，吃掉它并回复 20 点生命。" },
    ],
    strategy: "优先击杀火炬头防止收藏家吃回复生命。控制场上火炬头数量不超过 2 个。爆发流可以直接rush本体。",
  },

  // Act 3 Bosses
  {
    id: "time_eater",
    name: "时间吞噬者",
    act: 3,
    hp: "456 / 480",
    traits: ["你每打出 12 张牌，强制结束你的回合", "会清除自身负面效果"],
    abilities: [
      { name: "时间扭曲", description: "你打出 12 张牌后强制结束回合，Boss 获得 2 点力量。" },
      { name: "撕咬", description: "造成 20 点伤害，回复等同于未格挡伤害的生命。" },
      { name: "时空逆转", description: "清除所有负面效果，获得 2 层人工制品。" },
    ],
    strategy: "控制每回合出牌数量在 11 张以内。高费大伤害单卡优于低费快速出牌。注意它的回血能力，尽量用爆发伤害快速击杀。",
  },
  {
    id: "awakened_one",
    name: "觉醒者",
    act: 3,
    hp: "300 / 320",
    traits: ["会进入重生阶段", "你每打出一张能力牌，它获得 1 点力量"],
    abilities: [
      { name: "重生", description: "生命值归零后满血复活，进入第二阶段。" },
      { name: "暗焰", description: "造成 20 点伤害，给予 2 层灼伤。" },
      { name: "黑暗回响", description: "第二阶段使用，造成 30 点伤害，给予 3 层灼伤。" },
      { name: "能力反噬", description: "被动：你每打出一张能力牌，觉醒者获得 1 点力量。" },
    ],
    strategy: "第一阶段可以多用能力牌积累优势，因为重生后负面效果会清除。第二阶段全力输出。毒流和爆发流都很有效。注意它的灼伤会叠加。",
  },
  {
    id: "donu_deca",
    name: "唐努和德卡",
    act: 3,
    hp: "250 / 265 (各)",
    traits: ["两个Boss同时战斗", "一个给全体加力量，一个给全体加格挡"],
    abilities: [
      { name: "循环增益", description: "唐努：给予所有敌人 3 点力量。德卡：给予所有敌人 12 点格挡。" },
      { name: "光束", description: "造成 10x2 点伤害。" },
      { name: "强化的光束", description: "在力量/格挡增益后使用，造成 16x2 点伤害。" },
    ],
    strategy: "优先击杀一个，推荐先杀唐努（力量加成会让伤害快速膨胀）。AOE 伤害可以同时削弱两个。快速击杀一个后另一个会变弱。",
  },

  // Act 4 Boss
  {
    id: "corrupt_heart",
    name: "腐化之心",
    act: 4,
    hp: "750 / 800",
    traits: ["有三个阶段", "每回合会自动回复生命", "阶段转换时清除负面效果"],
    abilities: [
      { name: "心墙", description: "被动：每回合回复 10 点生命。" },
      { name: "重击", description: "造成 25 点伤害，给予 2 层易伤。" },
      { name: "心颤", description: "第二阶段新增，给予 1 层脆弱和 1 层虚弱。" },
      { name: "血之怒", description: "第三阶段新增，攻击力大幅提升，每回合额外攻击一次。" },
      { name: "阶段转换", description: "在 66% 和 33% 生命时转换阶段，清除所有负面效果。" },
    ],
    phases: "阶段一（100%-66%）：基础攻击模式。阶段二（66%-33%）：新增心颤，攻击附带 debuff。阶段三（33%-0%）：攻击力大幅提升，连续攻击。",
    strategy: "最强Boss，需要卡组足够成型。关键在于阶段转换时的爆发输出（因为负面效果会被清除）。准备大量防御应对第三阶段的高伤害。毒流在此非常有效因为可以叠加多层。",
  },
];

export function searchBosses(query: string): Boss[] {
  const q = query.toLowerCase();
  return bosses.filter(
    (b) =>
      b.name.toLowerCase().includes(q) ||
      b.abilities.some((a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)) ||
      b.strategy.toLowerCase().includes(q)
  );
}
