import { supabase } from "./supabase";

export type FeedbackType = "bug" | "feature" | "other";

export interface FeedbackItem {
  id: string;
  type: FeedbackType;
  title: string;
  content: string;
  email: string | null;
  user_id: string | null;
  display_name: string | null;
  created_at: string;
}

export interface FeedbackReply {
  id: string;
  feedback_id: string;
  content: string;
  user_id: string | null;
  display_name: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface FeedbackWithReplies extends FeedbackItem {
  replies: FeedbackReply[];
}

export async function submitFeedback(data: {
  type: FeedbackType;
  title: string;
  content: string;
  email?: string;
}) {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single()
    : { data: null };

  const { data: inserted, error } = await supabase
    .from("feedback")
    .insert({
      type: data.type,
      title: data.title.trim(),
      content: data.content.trim(),
      email: data.email?.trim() || null,
      user_id: user?.id ?? null,
      display_name: profile?.display_name ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return inserted as FeedbackItem;
}

export async function submitReply(data: {
  feedbackId: string;
  content: string;
  isAdmin?: boolean;
}) {
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) throw new Error("请先登录");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const adminUserId = process.env.NEXT_PUBLIC_ADMIN_USER_ID;
  const isAdmin = data.isAdmin ?? (adminUserId ? user.id === adminUserId : false);

  const { data: inserted, error } = await supabase
    .from("feedback_replies")
    .insert({
      feedback_id: data.feedbackId,
      content: data.content.trim(),
      user_id: user.id,
      display_name: profile?.display_name ?? null,
      is_admin: isAdmin,
    })
    .select()
    .single();

  if (error) throw error;
  return inserted as FeedbackReply;
}

export async function getFeedbackWithReplies(): Promise<FeedbackWithReplies[]> {
  const { data: feedback, error: feedbackError } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false });

  if (feedbackError) throw feedbackError;
  if (!feedback || feedback.length === 0) return [];

  const { data: replies, error: repliesError } = await supabase
    .from("feedback_replies")
    .select("*")
    .in(
      "feedback_id",
      feedback.map((f) => f.id)
    )
    .order("created_at", { ascending: true });

  if (repliesError) throw repliesError;

  const repliesByFeedback = (replies ?? []).reduce((acc, reply) => {
    if (!acc[reply.feedback_id]) acc[reply.feedback_id] = [];
    acc[reply.feedback_id].push(reply);
    return acc;
  }, {} as Record<string, FeedbackReply[]>);

  return (feedback as FeedbackItem[]).map((f) => ({
    ...f,
    replies: repliesByFeedback[f.id] ?? [],
  }));
}

export async function deleteFeedback(id: string) {
  const { error } = await supabase.from("feedback").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteFeedbackReply(id: string) {
  const { error } = await supabase.from("feedback_replies").delete().eq("id", id);
  if (error) throw error;
}
