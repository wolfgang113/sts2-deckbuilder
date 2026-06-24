import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "卡组广场",
  description: "浏览和探索社区玩家分享的杀戮尖塔卡组，发现新的构筑灵感。",
};

export default function DecksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
