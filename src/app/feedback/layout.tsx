import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "反馈",
  description: "提交 bug、功能建议或对 STS Deck 的反馈。",
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
