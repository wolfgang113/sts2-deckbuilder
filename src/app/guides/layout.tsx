import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "攻略站",
  description: "分享和查看杀戮尖塔攻略、流派讲解与进阶技巧。",
};

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
