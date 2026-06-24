"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/lib/i18n";
import { User, Lock, Mail } from "lucide-react";

interface LoginFormProps {
  onSuccess: () => void;
}

async function waitForSession(timeoutMs = 3000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const { data } = await supabase.auth.getSession();
    if (data.session) return true;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return false;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        if (!displayName.trim()) {
          setError(t.auth_error_required);
          setLoading(false);
          return;
        }
        await signUp(email, password, displayName.trim());
      } else {
        await signIn(email, password);
      }
      // Wait for session to be persisted before redirecting
      await waitForSession();
      onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("already registered")) {
        setError(t.auth_error_registered);
      } else if (message.includes("Invalid login")) {
        setError(t.auth_error_invalid);
      } else if (message.includes("Password should be")) {
        setError(t.auth_error_password_length);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
      <h2 className="mb-6 text-xl font-bold text-slate-100">
        {mode === "login" ? t.auth_login : t.auth_register}
      </h2>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder={t.auth_nickname}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="email"
            placeholder={t.auth_email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="password"
            placeholder={t.auth_password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
        >
          {loading
            ? "..."
            : mode === "login"
              ? t.auth_submit_login
              : t.auth_submit_register}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        {mode === "login" ? t.auth_no_account : t.auth_has_account}
        <button
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
          className="ml-1 text-amber-400 hover:text-amber-300"
        >
          {mode === "login" ? t.auth_go_register : t.auth_go_login}
        </button>
      </p>
    </div>
  );
}
