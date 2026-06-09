import { supabase } from "./supabase";
import type { Character } from "@/data/cards";

export interface CloudDeck {
  id: string;
  user_id: string;
  name: string;
  character: Character;
  card_ids: string[];
  is_public: boolean;
  likes_count: number;
  created_at: string;
  updated_at: string;
  profiles?: { display_name: string };
}

export async function createDeck(deck: {
  name: string;
  character: Character;
  card_ids: string[];
  is_public: boolean;
}) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("未登录");

  const { data, error } = await supabase
    .from("decks")
    .insert({
      user_id: userData.user.id,
      name: deck.name,
      character: deck.character,
      card_ids: deck.card_ids,
      is_public: deck.is_public,
    })
    .select()
    .single();

  if (error) throw error;
  return data as CloudDeck;
}

export async function updateDeck(
  id: string,
  deck: Partial<{
    name: string;
    character: Character;
    card_ids: string[];
    is_public: boolean;
  }>
) {
  const { data, error } = await supabase
    .from("decks")
    .update(deck)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as CloudDeck;
}

export async function deleteCloudDeck(id: string) {
  const { error } = await supabase.from("decks").delete().eq("id", id);
  if (error) throw error;
}

export async function getMyDecks(): Promise<CloudDeck[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data, error } = await supabase
    .from("decks")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as CloudDeck[];
}

export async function getPublicDecks(character?: string): Promise<CloudDeck[]> {
  let query = supabase
    .from("decks")
    .select("*, profiles(display_name)")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (character && character !== "all") {
    query = query.eq("character", character);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as CloudDeck[];
}

export async function getDeckById(id: string): Promise<CloudDeck | null> {
  const { data, error } = await supabase
    .from("decks")
    .select("*, profiles(display_name)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as CloudDeck;
}

export async function toggleLike(deckId: string): Promise<boolean> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("未登录");

  const { data: existing } = await supabase
    .from("deck_likes")
    .select("*")
    .eq("deck_id", deckId)
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("deck_likes")
      .delete()
      .eq("deck_id", deckId)
      .eq("user_id", userData.user.id);

    await supabase
      .from("decks")
      .update({ likes_count: (await getDeckById(deckId))!.likes_count - 1 })
      .eq("id", deckId);
    return false;
  } else {
    await supabase.from("deck_likes").insert({
      deck_id: deckId,
      user_id: userData.user.id,
    });

    const deck = await getDeckById(deckId);
    await supabase
      .from("decks")
      .update({ likes_count: (deck?.likes_count ?? 0) + 1 })
      .eq("id", deckId);
    return true;
  }
}

export async function getLikedDeckIds(): Promise<string[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data, error } = await supabase
    .from("deck_likes")
    .select("deck_id")
    .eq("user_id", userData.user.id);

  if (error) throw error;
  return (data ?? []).map((d) => d.deck_id);
}
