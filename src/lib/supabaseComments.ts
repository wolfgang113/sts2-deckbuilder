import { supabase } from "./supabase";

export interface CloudComment {
  id: string;
  deck_id: string;
  user_id: string;
  content: string;
  display_name: string | null;
  created_at: string;
}

export async function getComments(deckId: string): Promise<CloudComment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("deck_id", deckId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as CloudComment[];
}

export async function addComment(deckId: string, content: string): Promise<CloudComment> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("未登录");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userData.user.id)
    .single();

  const { data, error } = await supabase
    .from("comments")
    .insert({
      deck_id: deckId,
      user_id: userData.user.id,
      content: content.trim(),
      display_name: profile?.display_name ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as CloudComment;
}

export async function deleteCloudComment(commentId: string) {
  const { error } = await supabase.from("comments").delete().eq("id", commentId);
  if (error) throw error;
}
