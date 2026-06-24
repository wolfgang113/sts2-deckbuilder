import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "在线组卡器",
  description: "在线构建杀戮尖塔卡组，实时查看费用曲线和核心数据，一键生成分享图。",
};

export default function DeckbuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
