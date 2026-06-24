import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "药水数据库",
  description: "查看杀戮尖塔全部药水效果，支持搜索和筛选。",
};

export default function PotionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
