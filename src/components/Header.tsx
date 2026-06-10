"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Swords,
  Library,
  LayoutGrid,
  MessageSquarePlus,
  Layers,
  FlaskConical,
  Diamond,
  Shield,
  LogIn,
} from "lucide-react";
import { getCurrentUser, onAuthStateChange, type AuthUser } from "@/lib/auth";
import AuthModal from "./AuthModal";
import UserMenu from "./UserMenu";
import SponsorButton from "./SponsorButton";

const navItems = [
  { href: "/", label: "首页", icon: LayoutGrid },
  { href: "/cards", label: "卡牌库", icon: Library },
  { href: "/deckbuilder", label: "组卡器", icon: Swords },
  { href: "/decks", label: "卡组广场", icon: Layers },
  { href: "/relics", label: "遗物", icon: Diamond },
  { href: "/potions", label: "药水", icon: FlaskConical },
  { href: "/bosses", label: "Boss", icon: Shield },
  { href: "/feedback", label: "反馈", icon: MessageSquarePlus },
];

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      setAuthReady(true);
    });
    const sub = onAuthStateChange((u) => setUser(u));
    return () => sub.unsubscribe();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-3 md:px-4">
          <Link
            href="/"
            className="mr-4 flex shrink-0 items-center gap-1.5 font-bold text-base text-amber-400 md:mr-8 md:text-lg md:gap-2"
          >
            <Swords className="h-5 w-5" />
            <span>STS2 Deck</span>
          </Link>
          <nav className="flex flex-1 items-center gap-0.5 overflow-x-auto scrollbar-hide md:gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors md:px-3 md:text-sm ${
                    active
                      ? "bg-slate-800 text-amber-400"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sponsor + Auth */}
          {authReady && (
            <div className="ml-2 flex shrink-0 items-center gap-2">
              <SponsorButton />
              {user ? (
                <UserMenu
                  user={user}
                  onLogout={() => setUser(null)}
                />
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 md:text-sm"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">登录</span>
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          getCurrentUser().then(setUser);
        }}
      />
    </>
  );
}
