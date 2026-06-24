import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boss 攻略",
  description: "查看杀戮尖塔 Boss 技能、阶段变化和应对策略。",
};

export default function BossesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
