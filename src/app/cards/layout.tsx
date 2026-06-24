import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "卡牌数据库",
  description: "查看杀戮尖塔全部角色卡牌，支持按角色、类型、稀有度筛选和搜索。",
};

export default function CardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
