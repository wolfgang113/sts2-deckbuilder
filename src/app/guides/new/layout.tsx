import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "发布攻略",
  description: "撰写并发布你的杀戮尖塔攻略和流派心得。",
};

export default function NewGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
