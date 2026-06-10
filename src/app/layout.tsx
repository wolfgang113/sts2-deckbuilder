import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "杀戮尖塔2 卡组构建器 | Slay the Spire 2 Deck Builder",
  description: "杀戮尖塔2 在线卡组构建与分享工具，卡牌数据库，卡组推荐",
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
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
          <p className="mb-2">STS2 Deck Builder · 杀戮尖塔2 卡组构建器</p>
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
