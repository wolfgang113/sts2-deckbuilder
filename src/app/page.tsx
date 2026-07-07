"use client";

import Link from "next/link";
import {
  Library,
  Swords,
  Share2,
  Sparkles,
  BookOpen,
  Layers,
  ArrowRight,
  Zap,
  Compass,
  Trophy,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import SpotlightCard from "@/components/SpotlightCard";
import MouseGlow from "@/components/MouseGlow";
import FloatingElement from "@/components/FloatingElement";

export default function Home() {
  const { t } = useTranslation();

  const features = [
    {
      href: "/cards",
      icon: <Library className="h-7 w-7 text-sky-400" />,
      title: t.home_feature_cards,
      desc: t.home_feature_cards_desc,
      cta: t.home_browse,
      gradient: "from-sky-500/20 to-blue-600/20",
    },
    {
      href: "/deckbuilder",
      icon: <Swords className="h-7 w-7 text-rose-400" />,
      title: t.home_feature_builder,
      desc: t.home_feature_builder_desc,
      cta: t.home_start,
      gradient: "from-rose-500/20 to-orange-600/20",
    },
    {
      href: "/guides",
      icon: <BookOpen className="h-7 w-7 text-emerald-400" />,
      title: t.nav_guides,
      desc: t.home_feature_guides_desc,
      cta: t.home_explore_guides,
      gradient: "from-emerald-500/20 to-teal-600/20",
    },
    {
      href: "/decks",
      icon: <Layers className="h-7 w-7 text-amber-400" />,
      title: t.nav_decks,
      desc: t.home_feature_decks_desc,
      cta: t.home_explore_decks,
      gradient: "from-amber-500/20 to-yellow-600/20",
    },
  ];

  const showcaseItems = [
    {
      title: t.home_showcase_builder,
      desc: t.home_showcase_builder_desc,
      icon: <Zap className="h-8 w-8" />,
      href: "/deckbuilder",
      gradient: "from-violet-500/30 via-purple-500/20 to-transparent",
      span: "md:col-span-2 md:row-span-2",
    },
    {
      title: t.home_showcase_cards,
      desc: t.home_showcase_cards_desc,
      icon: <Compass className="h-6 w-6" />,
      href: "/cards",
      gradient: "from-sky-500/30 via-cyan-500/20 to-transparent",
      span: "",
    },
    {
      title: t.home_showcase_guides,
      desc: t.home_showcase_guides_desc,
      icon: <Trophy className="h-6 w-6" />,
      href: "/guides",
      gradient: "from-amber-500/30 via-orange-500/20 to-transparent",
      span: "",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <MouseGlow />

      {/* Decorative floating elements */}
      <FloatingElement
        className="pointer-events-none absolute top-24 left-[5%] z-0 opacity-20 blur-sm"
        distance={24}
        speed="slow"
      >
        <div className="h-32 w-32 rounded-full bg-amber-500/40" />
      </FloatingElement>
      <FloatingElement
        className="pointer-events-none absolute top-40 right-[8%] z-0 opacity-15 blur-sm"
        distance={18}
        speed="normal"
      >
        <div className="h-24 w-24 rotate-12 rounded-2xl bg-purple-500/40" />
      </FloatingElement>
      <FloatingElement
        className="pointer-events-none absolute bottom-[20%] left-[10%] z-0 opacity-15 blur-sm"
        distance={20}
        speed="fast"
      >
        <div className="h-16 w-16 rounded-full bg-emerald-500/40" />
      </FloatingElement>

      {/* Hero */}
      <section className="relative z-10 px-4 pt-28 pb-20">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-300">
            <Sparkles className="h-4 w-4" />
            <span>{t.home_hero_badge}</span>
          </div>

          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-slate-50 sm:text-6xl md:text-7xl lg:text-8xl">
            {t.home_title_prefix}
            <span className="block bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              {t.home_title_suffix}
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
            {t.home_subtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/deckbuilder"
              className="group inline-flex items-center gap-2 rounded-full bg-amber-500 px-8 py-4 font-semibold text-slate-950 transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/25"
            >
              <Swords className="h-5 w-5" />
              {t.home_start}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/cards"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-8 py-4 font-semibold text-slate-200 backdrop-blur-sm transition hover:border-amber-500/50 hover:bg-slate-800"
            >
              <Library className="h-5 w-5" />
              {t.home_browse}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <SpotlightCard
                key={f.href}
                href={f.href}
                className="group h-full p-6"
                glowColor="rgba(245, 158, 11, 0.12)"
              >
                <div
                  className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${f.gradient} p-3`}
                >
                  {f.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-100 transition group-hover:text-amber-400">
                  {f.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-400">
                  {f.desc}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-400">
                  {f.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Gallery */}
      <section className="relative z-10 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-slate-50 md:text-5xl">
              {t.home_showcase_title}
            </h2>
            <p className="mx-auto max-w-xl text-slate-400">
              {t.home_showcase_subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {showcaseItems.map((item) => (
              <SpotlightCard
                key={item.href}
                href={item.href}
                className={`group relative min-h-[220px] overflow-hidden p-8 ${item.span}`}
                glowColor="rgba(255, 255, 255, 0.08)"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-60 transition-opacity group-hover:opacity-80`}
                />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <div className="mb-4 inline-flex rounded-xl bg-white/10 p-3 text-slate-100 backdrop-blur-sm">
                      {item.icon}
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-slate-50 md:text-3xl">
                      {item.title}
                    </h3>
                    <p className="max-w-sm text-sm leading-relaxed text-slate-300">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 backdrop-blur-sm transition group-hover:bg-white/20">
                    {t.home_explore}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Share tip */}
      <section className="relative z-10 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <SpotlightCard className="p-8">
            <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
              <div className="flex items-center gap-4">
                <div className="inline-flex rounded-xl bg-emerald-500/15 p-3">
                  <Share2 className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{t.home_share_title}</h3>
                  <p className="text-sm text-slate-400">{t.home_share_tip}</p>
                </div>
              </div>
              <Link
                href="/deckbuilder"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                {t.home_start}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* Coming soon */}
      <section className="relative z-10 px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          <SpotlightCard className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-bold text-slate-100">{t.home_coming_soon}</h2>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              <li className="flex items-center gap-3 rounded-lg bg-slate-950/50 p-3">
                <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                <span className="text-slate-400">{t.home_coming_deck_plaza}</span>
              </li>
              <li className="flex items-center gap-3 rounded-lg bg-slate-950/50 p-3">
                <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                <span className="text-slate-400">{t.home_coming_seeds}</span>
              </li>
            </ul>
          </SpotlightCard>
        </div>
      </section>
    </div>
  );
}
