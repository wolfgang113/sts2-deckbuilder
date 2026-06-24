import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "遗物数据库",
  description: "查看杀戮尖塔全部遗物效果，按角色和稀有度筛选。",
};

export default function RelicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
