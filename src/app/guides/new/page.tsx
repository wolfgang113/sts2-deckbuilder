"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, type AuthUser } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";
import { createGuide } from "@/lib/supabaseGuides";
import GuideForm from "@/components/GuideForm";
import AuthModal from "@/components/AuthModal";

export default function NewGuidePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (!u) {
        setShowAuth(true);
      }
      setUser(u);
    });
  }, []);

  const handleSubmit = async (data: {
    title: string;
    character: string;
    tags: string[];
    content: string;
  }) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setSubmitting(true);
    try {
      const guide = await createGuide(data);
      router.push(`/guides?id=${guide.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.guides_error;
      alert(msg);
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="mb-4 text-slate-400">{t.guides_login_to_create}</p>
        <button
          onClick={() => setShowAuth(true)}
          className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
        >
          {t.auth_submit_login}
        </button>
        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          onSuccess={() => {
            getCurrentUser().then((u) => {
              setUser(u);
              if (u) router.push("/guides/new");
            });
          }}
        />
      </div>
    );
  }

  return (
    <>
      <GuideForm
        title={t.guides_new}
        submitLabel={t.guides_submit}
        onSubmit={handleSubmit}
        onCancelHref="/guides"
        isSubmitting={submitting}
      />
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => getCurrentUser().then(setUser)}
      />
    </>
  );
}
