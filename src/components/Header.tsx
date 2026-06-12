"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  ArrowLeft,
} from "lucide-react";
import { getCurrentUser, onAuthStateChange, type AuthUser } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";
import AuthModal from "./AuthModal";
import UserMenu from "./UserMenu";
import SponsorButton from "./SponsorButton";
import LanguageSwitch from "./LanguageSwitch";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0, didDrag: false });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!navRef.current) return;
    setIsDragging(true);
    dragState.current = {
      startX: e.pageX - navRef.current.offsetLeft,
      scrollLeft: navRef.current.scrollLeft,
      didDrag: false,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !navRef.current) return;
    e.preventDefault();
    const x = e.pageX - navRef.current.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.2;
    if (Math.abs(walk) > 3) dragState.current.didDrag = true;
    navRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const stopDragging = () => {
    setIsDragging(false);
    setTimeout(() => {
      dragState.current.didDrag = false;
    }, 50);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!navRef.current) return;
    const canScrollLeft = navRef.current.scrollLeft > 0;
    const canScrollRight =
      navRef.current.scrollLeft <
      navRef.current.scrollWidth - navRef.current.clientWidth;

    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      if ((e.deltaY < 0 && canScrollLeft) || (e.deltaY > 0 && canScrollRight)) {
        e.preventDefault();
        navRef.current.scrollLeft += e.deltaY;
      }
    } else {
      e.preventDefault();
      navRef.current.scrollLeft += e.deltaX;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (dragState.current.didDrag) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      setAuthReady(true);
    });
    const sub = onAuthStateChange((u) => setUser(u));
    return () => sub.unsubscribe();
  }, []);

  const navItems = [
    { href: "/", label: t.nav_home, icon: LayoutGrid },
    { href: "/cards", label: t.nav_cards, icon: Library },
    { href: "/deckbuilder", label: t.nav_deckbuilder, icon: Swords },
    { href: "/decks", label: t.nav_decks, icon: Layers },
    { href: "/relics", label: t.nav_relics, icon: Diamond },
    { href: "/potions", label: t.nav_potions, icon: FlaskConical },
    { href: "/bosses", label: t.nav_bosses, icon: Shield },
    { href: "/feedback", label: t.nav_feedback, icon: MessageSquarePlus },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-3 md:px-4">
          {pathname !== "/" && (
            <button
              onClick={() => router.back()}
              className="mr-2 flex shrink-0 items-center rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
              title="返回"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <Link
            href="/"
            className="mr-4 flex shrink-0 items-center gap-1.5 font-bold text-base text-amber-400 md:mr-8 md:text-lg md:gap-2"
          >
            <Swords className="h-5 w-5" />
            <span>STS2 Deck</span>
          </Link>
          <div className="relative flex flex-1 min-w-0 items-center">
            <nav
              ref={navRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={stopDragging}
              onMouseLeave={stopDragging}
              onWheel={handleWheel}
              onClick={handleClick}
              className={`flex flex-1 items-center gap-0.5 overflow-x-auto scroll-smooth whitespace-nowrap pb-1 pt-1 scrollbar-hide md:gap-1 ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{ WebkitOverflowScrolling: "touch" }}
            >
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
            <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-slate-950/80 to-transparent md:hidden" />
          </div>

          {/* Language + Sponsor + Auth */}
          {authReady && (
            <div className="ml-2 flex shrink-0 items-center gap-1 md:gap-2">
              <div className="hidden sm:block">
                <LanguageSwitch />
              </div>
              <div className="hidden md:block">
                <SponsorButton />
              </div>
              {user ? (
                <UserMenu
                  user={user}
                  onLogout={() => setUser(null)}
                />
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 md:px-3 md:text-sm"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.nav_login}</span>
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
