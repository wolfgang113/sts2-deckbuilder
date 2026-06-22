"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, type AuthUser } from "@/lib/auth";
import { useTranslation } from "@/lib/i18n";
import { updateGuide, type Guide } from "@/lib/supabaseGuides";
import GuideForm from "@/components/GuideForm";

interface GuideEditProps {
  guide: Guide;
}

const adminUserId = process.env.NEXT_PUBLIC_ADMIN_USER_ID;

export default function GuideEdit({ guide }: GuideEditProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const handleSubmit = async (data: {
    title: string;
    character: string;
    tags: string[];
    content: string;
  }) => {
    setSubmitting(true);
    try {
      await updateGuide(guide.id, data);
      router.push(`/guides?id=${guide.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.guides_error;
      alert(msg);
      setSubmitting(false);
    }
  };

  const isAdmin = user ? (adminUserId ? user.id === adminUserId : false) : false;
  const isOwner = user?.id === guide.user_id;
  const canEdit = isOwner || isAdmin;

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="mb-4 text-slate-400">{t.guides_login_to_create}</p>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="mb-4 text-red-400">{t.guides_unauthorized}</p>
      </div>
    );
  }

  return (
    <GuideForm
      title={t.guides_edit}
      submitLabel={t.guides_update}
      initialData={{
        title: guide.title,
        character: guide.character ?? "General",
        tags: guide.tags,
        content: guide.content,
      }}
      onSubmit={handleSubmit}
      onCancelHref={`/guides?id=${guide.id}`}
      isSubmitting={submitting}
    />
  );
}
