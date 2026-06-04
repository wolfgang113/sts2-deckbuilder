import type { Card, Character } from "@/data/cards";
import { cards } from "@/data/cards";

export interface SavedDeck {
  id: string;
  name: string;
  character: Character;
  cardIds: string[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "sts2-saved-decks";

export function loadSavedDecks(): SavedDeck[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedDeck[]) : [];
  } catch {
    return [];
  }
}

function saveAll(decks: SavedDeck[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}

export function saveDeck(deck: Omit<SavedDeck, "id" | "createdAt" | "updatedAt"> & { id?: string }): SavedDeck {
  const all = loadSavedDecks();
  const now = new Date().toISOString();

  if (deck.id) {
    // Update existing
    const index = all.findIndex((d) => d.id === deck.id);
    if (index >= 0) {
      all[index] = { ...all[index], ...deck, updatedAt: now };
      saveAll(all);
      return all[index];
    }
  }

  // Create new
  const newDeck: SavedDeck = {
    id: `deck-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: deck.name,
    character: deck.character,
    cardIds: deck.cardIds,
    createdAt: now,
    updatedAt: now,
  };
  all.push(newDeck);
  saveAll(all);
  return newDeck;
}

export function deleteDeck(id: string) {
  const all = loadSavedDecks().filter((d) => d.id !== id);
  saveAll(all);
}

export function getDeckCards(cardIds: string[]): Card[] {
  return cardIds.map((id) => cards.find((c) => c.id === id)!).filter(Boolean);
}

// URL encoding for deck sharing
export function encodeDeckToUrl(deck: { name: string; character: Character; cardIds: string[] }): string {
  const data = {
    n: deck.name,
    c: deck.character,
    cards: deck.cardIds,
  };
  const json = JSON.stringify(data);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return `?deck=${base64}`;
}

export function decodeDeckFromUrl(search: string): { name: string; character: Character; cardIds: string[] } | null {
  const params = new URLSearchParams(search);
  const deckParam = params.get("deck");
  if (!deckParam) return null;
  try {
    const json = decodeURIComponent(escape(atob(deckParam)));
    const data = JSON.parse(json);
    return {
      name: data.n || "",
      character: data.c,
      cardIds: data.cards || [],
    };
  } catch {
    return null;
  }
}
