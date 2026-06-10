"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut, type AuthUser } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";
import { User, LogOut, FolderHeart, ChevronDown } from "lucide-react";

interface UserMenuProps {
  user: AuthUser;
  onLogout: () => void;
}

export default function UserMenu({ user, onLogout }: UserMenuProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      onLogout();
    } catch {
      // ignore
    }
  };

  const display = user.displayName || user.email.split("@")[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-300 transition hover:bg-slate-800"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
          <User className="h-3.5 w-3.5" />
        </div>
        <span className="hidden sm:inline max-w-[80px] truncate">{display}</span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-slate-700 bg-slate-900 py-1 shadow-xl">
          <div className="border-b border-slate-800 px-3 py-2 text-xs text-slate-500 truncate">
            {user.email}
          </div>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
          >
            <FolderHeart className="h-4 w-4" />
            {t.nav_my_decks}
          </Link>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 transition hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            {t.nav_logout}
          </button>
        </div>
      )}
    </div>
  );
}
