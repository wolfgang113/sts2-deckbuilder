"use client";

import Link from "next/link";
import { Library, Swords, Share2, Sparkles, BookOpen, Layers } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function Home() {
  const { t } = useTranslation();

  const features = [
    {
      href: "/cards",
      icon: <Library className="h-6 w-6 text-sky-400" />,
      title: t.home_feature_cards,
      desc: t.home_feature_cards_desc,
      cta: t.home_browse,
    },
    {
      href: "/deckbuilder",
      icon: <Swords className="h-6 w-6 text-rose-400" />,
      title: t.home_feature_builder,
      desc: t.home_feature_builder_desc,
      cta: t.home_start,
    },
    {
      href: "/guides",
      icon: <BookOpen className="h-6 w-6 text-emerald-400" />,
      title: t.nav_guides,
      desc: t.home_feature_guides_desc,
      cta: t.home_explore_guides,
    },
    {
      href: "/decks",
      icon: <Layers className="h-6 w-6 text-amber-400" />,
      title: t.nav_decks,
      desc: t.home_feature_decks_desc,
      cta: t.home_explore_decks,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Hero */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold text-slate-50 md:text-5xl">
          {t.home_title_prefix}{" "}
          <span className="text-amber-400">{t.home_title_suffix}</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-400">
          {t.home_subtitle}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/deckbuilder"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            <Swords className="h-5 w-5" />
            {t.home_start}
          </Link>
          <Link
            href="/cards"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-6 py-3 font-semibold text-slate-200 transition hover:bg-slate-700"
          >
            <Library className="h-5 w-5" />
            {t.home_browse}
          </Link>
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-6 py-3 font-semibold text-slate-200 transition hover:bg-slate-700"
          >
            <BookOpen className="h-5 w-5" />
            {t.home_explore_guides}
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <FeatureCard
            key={f.href}
            href={f.href}
            icon={f.icon}
            title={f.title}
            desc={f.desc}
            cta={f.cta}
          />
        ))}
      </div>

      {/* Quick share tip */}
      <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center">
        <div className="mx-auto flex max-w-2xl items-center justify-center gap-3 text-slate-400">
          <Share2 className="h-5 w-5 text-emerald-400" />
          <p className="text-sm">{t.home_share_tip}</p>
        </div>
      </div>

      {/* Coming soon */}
      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/50 p-8">
        <div className="mb-4 flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <h2 className="text-xl font-bold text-slate-100">{t.home_coming_soon}</h2>
        </div>
        <ul className="space-y-2 text-slate-400">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
            {t.home_coming_deck_plaza}
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
            {t.home_coming_seeds}
          </li>
        </ul>
      </div>
    </div>
  );
}

function FeatureCard({
  href,
  icon,
  title,
  desc,
  cta,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-amber-500/50 hover:bg-slate-800/50"
    >
      <div className="mb-3">{icon}</div>
      <h3 className="mb-2 font-bold text-slate-100 transition group-hover:text-amber-400">
        {title}
      </h3>
      <p className="mb-4 text-sm text-slate-400">{desc}</p>
      <span className="text-sm font-medium text-amber-400">
        {cta} →
      </span>
    </Link>
  );
}
