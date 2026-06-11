"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cards, characters, type Card, type Character } from "@/data/cards";
import html2canvas from "html2canvas";
import {
  Download,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  Save,
  FolderOpen,
  Copy,
  Check,
  FileText,
  Share2,
  AlertTriangle,
  Keyboard,
} from "lucide-react";
import CardVisual from "@/components/CardVisual";
import CommentSection from "@/components/CommentSection";
import {
  saveDeck,
  loadSavedDecks,
  deleteDeck,
  getDeckCards,
  encodeDeckToUrl,
  decodeDeckFromUrl,
  type SavedDeck,
} from "@/lib/deckStorage";
import { getCurrentUser, type AuthUser } from "@/lib/auth";
import { createDeck, updateDeck, getDeckById, type CloudDeck } from "@/lib/supabaseDecks";
import { useTranslation } from "@/lib/i18n";

export default function DeckBuilderPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedCharacter, setSelectedCharacter] = useState<Character>("Ironclad");
  const [deck, setDeck] = useState<Card[]>([]);
  const [deckName, setDeckName] = useState("");
  const [generating, setGenerating] = useState(false);
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>(() => loadSavedDecks());
  const [showSaved, setShowSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [currentDeckId, setCurrentDeckId] = useState<string | undefined>();
  const [showSwitchWarning, setShowSwitchWarning] = useState<Character | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showCloudSave, setShowCloudSave] = useState(false);
  const [savePublic, setSavePublic] = useState(true);
  const [cloudDeckId, setCloudDeckId] = useState<string | undefined>();
  const [loadingCloud, setLoadingCloud] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const shareRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Load from URL or cloud on mount
  useEffect(() => {
    getCurrentUser().then(setUser);

    const params = new URLSearchParams(window.location.search);
    const cloudId = params.get("cloud");

    if (cloudId) {
      // Load from cloud
      setLoadingCloud(true);
      getDeckById(cloudId).then((cloudDeck) => {
        if (cloudDeck) {
          setSelectedCharacter(cloudDeck.character);
          setDeckName(cloudDeck.name);
          setDeck(getDeckCards(cloudDeck.card_ids));
          setCloudDeckId(cloudDeck.id);
        }
        setLoadingCloud(false);
      });
    } else {
      const urlDeck = decodeDeckFromUrl(window.location.search);
      if (urlDeck) {
        queueMicrotask(() => {
          setSelectedCharacter(urlDeck.character);
          setDeckName(urlDeck.name);
          setDeck(getDeckCards(urlDeck.cardIds));
        });
      }
    }
  }, []);

  const characterInfo = characters.find((c) => c.id === selectedCharacter);

  const availableCards = cards.filter(
    (c) => c.character === selectedCharacter && c.type !== "Curse"
  );

  const addCard = (card: Card) => setDeck((prev) => [...prev, card]);
  const removeCard = (index: number) => setDeck((prev) => prev.filter((_, i) => i !== index));
  const clearDeck = () => {
    setDeck([]);
    setCurrentDeckId(undefined);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 9) {
        const card = availableCards[num - 1];
        if (card) addCard(card);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [availableCards]);

  const handleCharacterSwitch = (char: Character) => {
    if (deck.length > 0) {
      setShowSwitchWarning(char);
    } else {
      setSelectedCharacter(char);
    }
  };

  const confirmSwitch = () => {
    if (showSwitchWarning) {
      setSelectedCharacter(showSwitchWarning);
      setDeck([]);
      setDeckName("");
      setCurrentDeckId(undefined);
      setShowSwitchWarning(null);
    }
  };

  const stats = {
    total: deck.length,
    attack: deck.filter((c) => c.type === "Attack").length,
    skill: deck.filter((c) => c.type === "Skill").length,
    power: deck.filter((c) => c.type === "Power").length,
    curse: deck.filter((c) => c.type === "Curse").length,
    avgCost:
      deck.length > 0
        ? (
            deck.reduce((sum, c) => sum + (typeof c.cost === "number" ? c.cost : 0), 0) /
            deck.length
          ).toFixed(1)
        : "0",
  };

  const costCurve = [0, 1, 2, 3].map((cost) => ({
    cost,
    count: deck.filter((c) => c.cost === cost).length,
  }));

  // Group deck cards by ID for display with counts
  const deckGrouped = useMemo(() => {
    const groups: { card: Card; count: number; lastIndex: number }[] = [];
    const map = new Map<string, number>();

    deck.forEach((card, index) => {
      if (map.has(card.id)) {
        const gi = map.get(card.id)!;
        groups[gi].count++;
        groups[gi].lastIndex = index;
      } else {
        map.set(card.id, groups.length);
        groups.push({ card, count: 1, lastIndex: index });
      }
    });
    return groups;
  }, [deck]);

  const handleSaveLocal = () => {
    if (deck.length === 0) return;
    const saved = saveDeck({
      id: currentDeckId,
      name: deckName || t.builder_unnamed,
      character: selectedCharacter,
      cardIds: deck.map((c) => c.id),
    });
    setCurrentDeckId(saved.id);
    setSavedDecks(loadSavedDecks());
    showToast(`${t.save_toast_local}：${saved.name}`, "success");
  };

  const handleSaveCloud = async () => {
    if (deck.length === 0 || !user) return;
    setLoadingCloud(true);
    try {
      if (cloudDeckId) {
        const updated = await updateDeck(cloudDeckId, {
          name: deckName || t.builder_unnamed,
          character: selectedCharacter,
          card_ids: deck.map((c) => c.id),
          is_public: savePublic,
        });
        setCloudDeckId(updated.id);
        showToast(`${t.save_toast_cloud_update}：${updated.name}`, "success");
      } else {
        const created = await createDeck({
          name: deckName || t.builder_unnamed,
          character: selectedCharacter,
          card_ids: deck.map((c) => c.id),
          is_public: savePublic,
        });
        setCloudDeckId(created.id);
        showToast(`${t.save_toast_cloud_new}：${created.name}`, "success");
      }
      setShowCloudSave(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.save_toast_error;
      showToast(msg, "error");
    } finally {
      setLoadingCloud(false);
    }
  };

  const handleLoad = (saved: SavedDeck) => {
    setSelectedCharacter(saved.character);
    setDeckName(saved.name);
    setDeck(getDeckCards(saved.cardIds));
    setCurrentDeckId(saved.id);
    setCloudDeckId(undefined);
    setShowSaved(false);
    const url = encodeDeckToUrl({
      name: saved.name,
      character: saved.character,
      cardIds: saved.cardIds,
    });
    router.replace(`/deckbuilder${url}`, { scroll: false });
  };

  const handleDeleteSaved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteDeck(id);
    setSavedDecks(loadSavedDecks());
    if (currentDeckId === id) setCurrentDeckId(undefined);
  };

  const handleCopyLink = () => {
    const url = encodeDeckToUrl({
      name: deckName,
      character: selectedCharacter,
      cardIds: deck.map((c) => c.id),
    });
    const fullUrl = `${window.location.origin}/deckbuilder${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const typeLabels: Record<string, string> = {
    Attack: t.type_attack,
    Skill: t.type_skill,
    Power: t.type_power,
    Curse: t.type_curse,
  };

  const exportText = () => {
    const lines: string[] = [];
    lines.push(t.export_header.replace("{name}", deckName || t.builder_unnamed));
    lines.push(`${t.export_character}：${characterInfo?.name}`);
    lines.push(`${t.export_card_count}：${deck.length}${t.unit_card}`);
    lines.push(`${t.type_attack} ${stats.attack} | ${t.type_skill} ${stats.skill} | ${t.type_power} ${stats.power} | ${t.builder_stat_avg_cost} ${stats.avgCost}`);
    lines.push("");
    const byType: Record<string, Card[]> = {};
    deck.forEach((c) => {
      if (!byType[c.type]) byType[c.type] = [];
      byType[c.type].push(c);
    });
    Object.entries(byType).forEach(([type, list]) => {
      lines.push(`--- ${typeLabels[type] || type} (${list.length}) ---`);
      const counts: Record<string, number> = {};
      list.forEach((c) => { counts[c.name] = (counts[c.name] || 0) + 1; });
      Object.entries(counts).forEach(([name, count]) => {
        lines.push(`${name}${count > 1 ? ` x${count}` : ""}`);
      });
      lines.push("");
    });
    return lines.join("\n");
  };

  const generateShareImage = useCallback(async () => {
    if (!shareRef.current || deck.length === 0) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: "#0f172a",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `sts2-deck-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  }, [deck.length]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">{t.builder_title}</h1>
        <button
          onClick={() => setShowShortcuts(!showShortcuts)}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-500 transition hover:text-slate-300"
          title={t.builder_shortcuts}
        >
          <Keyboard className="h-3.5 w-3.5" />
          {t.builder_shortcuts}
        </button>
      </div>

      {/* Shortcuts hint */}
      {showShortcuts && (
        <div className="mb-4 rounded-lg border border-slate-700 bg-slate-800 p-3 text-xs text-slate-400">
          <p className="mb-1">
            <span className="font-medium text-slate-300">1-9</span> — {t.builder_shortcuts_hint}
          </p>
          <p>
            <span className="font-medium text-slate-300">{t.builder_click_remove}</span>
          </p>
        </div>
      )}

      {/* Character Switch Warning Modal */}
      {showSwitchWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-2 text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-bold">{t.builder_switch_char}</h3>
            </div>
            <p className="mb-6 text-sm text-slate-300">
              {t.builder_switch_confirm}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSwitchWarning(null)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
              >
                {t.builder_cancel}
              </button>
              <button
                onClick={confirmSwitch}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
              >
                {t.builder_confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cloud Save Modal */}
      {showCloudSave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-slate-100">
              {cloudDeckId ? t.save_cloud_title_update : t.save_cloud_title_new}
            </h3>
            <div className="mb-4 rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-400">
              <p className="mb-1">
                <span className="text-slate-200">{deckName || t.builder_unnamed}</span>
              </p>
              <p>
                {deck.length}{t.unit_cards} · {characters.find((c) => c.id === selectedCharacter)?.name}
              </p>
            </div>
            <div className="mb-6 flex items-center gap-2">
              <input
                type="checkbox"
                id="public"
                checked={savePublic}
                onChange={(e) => setSavePublic(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-800 accent-amber-500"
              />
              <label htmlFor="public" className="text-sm text-slate-300">
                {t.save_public_label}
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCloudSave(false)}
                className="flex-1 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
              >
                {t.save_cancel}
              </button>
              <button
                onClick={handleSaveCloud}
                disabled={loadingCloud}
                className="flex-1 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
              >
                {loadingCloud ? t.builder_generating : cloudDeckId ? t.save_update_btn : t.save_cloud_btn}
              </button>
            </div>
            <div className="mt-3 text-center">
              <button
                onClick={() => {
                  handleSaveLocal();
                  setShowCloudSave(false);
                }}
                className="text-xs text-slate-500 hover:text-slate-300"
              >
                {t.save_local_only}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Character Select */}
      <div className="mb-6 flex flex-wrap gap-2">
        {characters
          .filter((c) => c.id !== "Colorless" && c.id !== "Curse")
          .map((c) => (
            <button
              key={c.id}
              onClick={() => handleCharacterSwitch(c.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                selectedCharacter === c.id
                  ? "text-slate-950"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              }`}
              style={selectedCharacter === c.id ? { backgroundColor: c.color } : {}}
            >
              {c.name}
            </button>
          ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Card Pool */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-slate-200">{characterInfo?.name} {t.builder_card_pool}</h2>
            <span className="text-xs text-slate-500">{t.builder_click_add}</span>
          </div>
          <div className="max-h-[600px] space-y-2 overflow-y-auto rounded-lg border border-slate-800 bg-slate-900/30 p-3">
            {availableCards.slice(0, 9).map((card, i) => (
              <div key={card.id} className="relative">
                <div onClick={() => addCard(card)}>
                  <CardVisual card={card} compact />
                </div>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-slate-950/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                  {i + 1}
                </span>
              </div>
            ))}
            {availableCards.slice(9).map((card) => (
              <div key={card.id} onClick={() => addCard(card)}>
                <CardVisual card={card} compact />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Deck */}
        <div>
          {/* Deck Name Input */}
          <div className="mb-3">
            <input
              type="text"
              placeholder={t.builder_deck_name_placeholder}
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-slate-200">{t.builder_current_deck}</h2>
            <div className="flex gap-1">
              <button
                onClick={() => setShowSaved(!showSaved)}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-sky-400 transition hover:bg-sky-500/10"
                title={t.builder_load}
              >
                <FolderOpen className="h-3 w-3" />
                {t.builder_load}
              </button>
              <button
                onClick={() => {
                  if (user) {
                    setShowCloudSave(true);
                  } else {
                    handleSaveLocal();
                  }
                }}
                disabled={deck.length === 0}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-emerald-400 transition hover:bg-emerald-500/10 disabled:opacity-50"
                title={t.builder_save}
              >
                <Save className="h-3 w-3" />
                {cloudDeckId ? t.builder_update : t.builder_save}
              </button>
              <button
                onClick={clearDeck}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-red-400 transition hover:bg-red-500/10"
                disabled={deck.length === 0}
              >
                <Trash2 className="h-3 w-3" />
                {t.builder_clear}
              </button>
            </div>
          </div>

          {/* Saved Decks Dropdown */}
          {showSaved && (
            <div className="mb-3 rounded-lg border border-slate-700 bg-slate-800 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{t.builder_saved_decks}</span>
                <Link
                  href="/decks"
                  className="text-xs text-amber-400 hover:text-amber-300"
                >
                  {t.builder_view_all}
                </Link>
              </div>
              {savedDecks.length === 0 ? (
                <div className="py-4 text-center">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/50">
                    <FolderOpen className="h-4 w-4 text-slate-600" />
                  </div>
                  <p className="text-xs text-slate-600">{t.builder_no_saved}</p>
                </div>
              ) : (
                <div className="space-y-1 max-h-[200px] overflow-y-auto">
                  {savedDecks.map((saved) => {
                    const charInfo = characters.find((c) => c.id === saved.character);
                    return (
                      <div
                        key={saved.id}
                        onClick={() => handleLoad(saved)}
                        className={`flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm transition hover:bg-slate-700 ${
                          currentDeckId === saved.id ? "bg-slate-700/60" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: charInfo?.color }}
                          />
                          <span className="truncate text-slate-200">{saved.name}</span>
                          <span className="shrink-0 text-xs text-slate-500">
                            {charInfo?.name} · {saved.cardIds.length}{t.unit_card}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleDeleteSaved(saved.id, e)}
                          className="shrink-0 rounded p-1 text-slate-600 transition hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="mb-4 grid grid-cols-5 gap-2 rounded-lg border border-slate-800 bg-slate-900/30 p-3 text-center">
            <StatBox label={t.builder_stat_total} value={stats.total} />
            <StatBox label={t.builder_stat_attack} value={stats.attack} color="text-rose-400" />
            <StatBox label={t.builder_stat_skill} value={stats.skill} color="text-sky-400" />
            <StatBox label={t.builder_stat_power} value={stats.power} color="text-emerald-400" />
            <StatBox label={t.builder_stat_avg_cost} value={stats.avgCost} />
          </div>

          {/* Cost Curve */}
          <div className="mb-4 flex items-end gap-1 rounded-lg border border-slate-800 bg-slate-900/30 p-3">
            {costCurve.map(({ cost, count }) => {
              const max = Math.max(...costCurve.map((c) => c.count), 1);
              const height = count > 0 ? Math.max((count / max) * 80, 8) : 4;
              return (
                <div key={cost} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs text-slate-400">{count}</span>
                  <div
                    className="w-full rounded-t bg-amber-500/60 transition-all"
                    style={{ height: `${height}px` }}
                  />
                  <span className="text-xs text-slate-500">{cost}</span>
                </div>
              );
            })}
          </div>

          {/* Deck List - grouped with counts */}
          <div className="mb-4 max-h-[400px] space-y-1 overflow-y-auto rounded-lg border border-slate-800 bg-slate-900/30 p-3">
            {deck.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-600">
                {t.builder_click_build}
              </div>
            ) : (
              deckGrouped.map(({ card, count, lastIndex }) => (
                <div key={card.id} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0" onClick={() => removeCard(lastIndex)}>
                    <CardVisual card={card} compact />
                  </div>
                  {count > 1 && (
                    <span className="shrink-0 rounded-md bg-slate-800 px-2 py-1 text-xs font-bold text-amber-400">
                      x{count}
                    </span>
                  )}
                  <div className="flex shrink-0 flex-col gap-0.5">
                    <button
                      onClick={() => addCard(card)}
                      className="rounded p-1 text-slate-600 transition hover:bg-emerald-500/10 hover:text-emerald-400"
                      title={t.builder_add}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => removeCard(lastIndex)}
                      className="rounded p-1 text-slate-600 transition hover:bg-red-500/10 hover:text-red-400"
                      title={t.builder_remove}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={generateShareImage}
              disabled={deck.length === 0 || generating}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-500 py-2.5 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  {t.builder_generating}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  {t.builder_generate_image}
                </>
              )}
            </button>
            <button
              onClick={handleCopyLink}
              disabled={deck.length === 0}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
              title={t.builder_copy_link}
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
              {copied ? t.builder_copied : t.builder_copy_link}
            </button>
            <button
              onClick={() => setShowExport(!showExport)}
              disabled={deck.length === 0}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
              title={t.builder_export_text}
            >
              <FileText className="h-4 w-4" />
              {t.builder_export_text}
            </button>
          </div>

          {/* Export Text */}
          {showExport && (
            <div className="mt-3 rounded-lg border border-slate-700 bg-slate-800 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{t.builder_export_title}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(exportText());
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex items-center gap-1 text-xs text-sky-400 transition hover:text-sky-300"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {t.builder_copy}
                </button>
              </div>
              <pre className="max-h-[200px] overflow-auto rounded bg-slate-900 p-3 text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">
                {exportText()}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Hidden share image template */}
      <div className="absolute -left-[9999px] top-0">
        <div
          ref={shareRef}
          className="w-[600px] rounded-xl border-2 border-amber-500/30 bg-slate-950 p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg" style={{ backgroundColor: characterInfo?.color }} />
            <div>
              <h2 className="text-xl font-bold text-slate-100">{deckName || t.builder_unnamed}</h2>
              <p className="text-sm text-slate-400">
                {characterInfo?.name} · {deck.length} {t.unit_cards}
              </p>
            </div>
          </div>

          <div className="mb-4 flex gap-4 text-sm">
            <span className="text-rose-400">{t.builder_stat_attack} {stats.attack}</span>
            <span className="text-sky-400">{t.builder_stat_skill} {stats.skill}</span>
            <span className="text-emerald-400">{t.builder_stat_power} {stats.power}</span>
            <span className="text-slate-400">{t.builder_stat_avg_cost} {stats.avgCost}</span>
          </div>

          <div className="space-y-2">
            {deckGrouped.map(({ card, count }) => (
              <div
                key={card.id}
                className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 p-3"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 text-sm font-bold text-slate-200">
                  {card.cost === -1 ? "∞" : card.cost}
                </div>
                <span className="text-slate-200">{card.name}</span>
                {count > 1 && (
                  <span className="ml-auto rounded bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400">
                    x{count}
                  </span>
                )}
                {count === 1 && (
                  <span className="ml-auto text-xs text-slate-500">
                    {typeLabels[card.type] || card.type}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 text-center text-xs text-slate-600">
            {t.builder_share_site}
          </div>
        </div>
      </div>

      {/* Comments */}
      {cloudDeckId ? (
        <div className="mt-12">
          <CommentSection deckId={cloudDeckId} />
        </div>
      ) : (
        <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center text-sm text-slate-500">
          {t.builder_comments_hint}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2">
          <div
            className={`rounded-lg px-6 py-3 text-sm font-medium shadow-xl transition-all ${
              toast.type === "success"
                ? "bg-emerald-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div>
      <div className={`text-lg font-bold ${color || "text-slate-100"}`}>{value}</div>
      <div className="text-[10px] text-slate-500">{label}</div>
    </div>
  );
}
