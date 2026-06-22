"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { characters } from "@/data/cards";
import { useTranslation } from "@/lib/i18n";
import { ArrowLeft, Send, X, Plus } from "lucide-react";

const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 15;
const TITLE_MAX = 100;
const CONTENT_MIN = 50;

export interface GuideFormData {
  title: string;
  character: string;
  tags: string[];
  content: string;
}

interface GuideFormProps {
  initialData?: Partial<GuideFormData>;
  submitLabel: string;
  title: string;
  onSubmit: (data: GuideFormData) => Promise<void>;
  onCancelHref: string;
  isSubmitting?: boolean;
}

export default function GuideForm({
  initialData,
  submitLabel,
  title,
  onSubmit,
  onCancelHref,
  isSubmitting = false,
}: GuideFormProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState<GuideFormData>({
    title: initialData?.title ?? "",
    character: initialData?.character ?? "General",
    tags: initialData?.tags ?? [],
    content: initialData?.content ?? "",
  });
  const [tagInput, setTagInput] = useState("");

  const charOptions = useMemo(
    () => characters.filter((c) => c.id !== "Colorless" && c.id !== "Curse"),
    []
  );

  const handleTagInputChange = (value: string) => {
    const newTags = value
      .split(/[,，]/)
      .map((s) => s.trim().slice(0, MAX_TAG_LENGTH))
      .filter(Boolean)
      .slice(0, MAX_TAGS);
    setTagInput(value);
    setForm((prev) => ({ ...prev, tags: newTags }));
  };

  const handleRemoveTag = (index: number) => {
    const newTags = form.tags.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, tags: newTags }));
    setTagInput(newTags.join(", "));
  };

  const canSubmit =
    form.title.trim().length > 0 &&
    form.content.trim().length >= CONTENT_MIN &&
    !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    await onSubmit({
      title: form.title.trim(),
      character: form.character === "General" ? "" : form.character,
      tags: form.tags,
      content: form.content.trim(),
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href={onCancelHref}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-slate-200"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.guides_back}
      </Link>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="mb-6 flex items-center gap-3">
          <Plus className="h-5 w-5 text-amber-400" />
          <h1 className="text-xl font-bold text-slate-100">{title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-slate-500">
              {t.guides_title_label}
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  title: e.target.value.slice(0, TITLE_MAX),
                }))
              }
              placeholder={t.guides_title_placeholder}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase text-slate-500">
              {t.guides_character_label}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, character: "General" }))}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  form.character === "General"
                    ? "bg-slate-700 text-slate-100"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                }`}
              >
                {t.guides_general}
              </button>
              {charOptions.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, character: c.id }))}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    form.character === c.id
                      ? "text-slate-950"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                  }`}
                  style={
                    form.character === c.id ? { backgroundColor: c.color } : {}
                  }
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-slate-500">
              {t.guides_tags_label}
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => handleTagInputChange(e.target.value)}
              placeholder={t.guides_tags_placeholder}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-slate-600">
              {t.guides_tag_hint.replace("{count}", String(MAX_TAGS))}
            </p>
            {form.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {form.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(i)}
                      className="rounded p-0.5 text-slate-500 hover:text-slate-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase text-slate-500">
              {t.guides_content_label}
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
              placeholder={t.guides_content_placeholder}
              rows={14}
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-600">
              <span>
                {form.content.trim().length < CONTENT_MIN
                  ? t.guides_content_min.replace("{count}", String(CONTENT_MIN))
                  : t.guides_content_ok}
              </span>
              <span>{form.content.length} / 5000</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href={onCancelHref}
              className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
            >
              {t.builder_cancel}
            </Link>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? t.guides_submitting : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
