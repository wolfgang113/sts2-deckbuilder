import { supabase } from "./supabase";

export interface Guide {
  id: string;
  user_id: string;
  display_name: string | null;
  title: string;
  content: string;
  character: string | null;
  tags: string[];
  view_count: number;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateGuideInput {
  title: string;
  content: string;
  character?: string | null;
  tags?: string[];
}

export interface GuideFilters {
  character?: string;
  search?: string;
  sortBy?: "newest" | "likes" | "oldest";
}

export async function getGuides(filters: GuideFilters = {}): Promise<Guide[]> {
  let query = supabase.from("guides").select("*");

  if (filters.character && filters.character !== "all" && filters.character !== "General") {
    query = query.eq("character", filters.character);
  }

  if (filters.search?.trim()) {
    const q = `%${filters.search.trim()}%`;
    query = query.or(`title.ilike.${q},content.ilike.${q}`);
  }

  const sortBy = filters.sortBy ?? "newest";
  if (sortBy === "likes") {
    query = query.order("likes_count", { ascending: false });
  } else if (sortBy === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Guide[];
}

export async function getGuideById(id: string): Promise<Guide | null> {
  const { data, error } = await supabase
    .from("guides")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Guide;
}

export async function createGuide(input: CreateGuideInput): Promise<Guide> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("未登录");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userData.user.id)
    .single();

  const { data, error } = await supabase
    .from("guides")
    .insert({
      user_id: userData.user.id,
      display_name: profile?.display_name ?? null,
      title: input.title.trim(),
      content: input.content.trim(),
      character: input.character ?? null,
      tags: input.tags ?? [],
    })
    .select()
    .single();

  if (error) throw error;
  return data as Guide;
}

export async function updateGuide(
  id: string,
  input: Partial<CreateGuideInput>
): Promise<Guide> {
  const updateData: Record<string, unknown> = {};
  if (input.title !== undefined) updateData.title = input.title.trim();
  if (input.content !== undefined) updateData.content = input.content.trim();
  if (input.character !== undefined) updateData.character = input.character ?? null;
  if (input.tags !== undefined) updateData.tags = input.tags;

  const { data, error } = await supabase
    .from("guides")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Guide;
}

export async function deleteGuide(id: string): Promise<void> {
  const { error } = await supabase.from("guides").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleLike(guideId: string): Promise<boolean> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("未登录");

  const { data: existing } = await supabase
    .from("guide_likes")
    .select("*")
    .eq("guide_id", guideId)
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("guide_likes")
      .delete()
      .eq("guide_id", guideId)
      .eq("user_id", userData.user.id);

    const guide = await getGuideById(guideId);
    await supabase
      .from("guides")
      .update({ likes_count: Math.max(0, (guide?.likes_count ?? 1) - 1) })
      .eq("id", guideId);
    return false;
  } else {
    await supabase.from("guide_likes").insert({
      guide_id: guideId,
      user_id: userData.user.id,
    });

    const guide = await getGuideById(guideId);
    await supabase
      .from("guides")
      .update({ likes_count: (guide?.likes_count ?? 0) + 1 })
      .eq("id", guideId);
    return true;
  }
}

export async function getLikedGuideIds(): Promise<string[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data, error } = await supabase
    .from("guide_likes")
    .select("guide_id")
    .eq("user_id", userData.user.id);

  if (error) throw error;
  return (data ?? []).map((d) => d.guide_id);
}

export async function incrementViewCount(id: string): Promise<void> {
  const guide = await getGuideById(id);
  if (!guide) return;

  const { error } = await supabase
    .from("guides")
    .update({ view_count: guide.view_count + 1 })
    .eq("id", id);

  if (error) throw error;
}
