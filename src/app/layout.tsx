import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { I18nProvider } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "STS Deck - 杀戮尖塔卡组构建器 | Slay the Spire Deck Builder",
    template: "%s | STS Deck",
  },
  description: "杀戮尖塔在线卡组构建与分享工具。完整卡牌数据库、便捷的组卡器、一键生成分享图、攻略站。Build, share and explore Slay the Spire decks online.",
  keywords: ["杀戮尖塔", "Slay the Spire", "卡组构建器", "deck builder", "卡牌数据库", "攻略"],
  authors: [{ name: "STS Deck" }],
  metadataBase: new URL("https://stsdeck.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "STS Deck - 杀戮尖塔卡组构建器",
    description: "在线构建、分享和探索杀戮尖塔卡组。完整卡牌数据库，便捷组卡工具，一键生成分享图。",
    url: "https://stsdeck.com",
    siteName: "STS Deck",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "STS Deck - 杀戮尖塔卡组构建器",
    description: "在线构建、分享和探索杀戮尖塔卡组。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <I18nProvider>
          <Header />
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          <main className="flex-1">{children}</main>
        </I18nProvider>
        <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
          <p className="mb-2">STS Deck Builder · 杀戮尖塔 卡组构建器</p>
          <p className="mb-3">
            <a href="https://ifdian.net/a/wolfgang113" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
              在爱发电支持我们
            </a>
          </p>
          <p className="max-w-2xl mx-auto text-xs text-slate-600 leading-relaxed px-4">
            本网站为粉丝制作的非官方辅助工具，与 Mega Crit Games 及 Slay the Spire 官方无关。
            游戏数据版权归 Mega Crit Games 所有。本站内容仅供学习交流使用。
          </p>
        </footer>
      </body>
    </html>
  );
}
