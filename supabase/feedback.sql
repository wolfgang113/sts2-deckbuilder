-- Run this SQL in Supabase SQL Editor to create the feedback tables

-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Feedback items (public comments / suggestions)
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('bug', 'feature', 'other')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  email TEXT,
  user_id UUID REFERENCES auth.users(id),
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Replies to feedback (admin / user interactions)
CREATE TABLE IF NOT EXISTS feedback_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feedback_id UUID NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  display_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_replies ENABLE ROW LEVEL SECURITY;

-- Everyone can read feedback and replies
CREATE POLICY "Allow everyone to read feedback" ON feedback
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow everyone to read replies" ON feedback_replies
  FOR SELECT TO anon, authenticated USING (true);

-- Anonymous and authenticated users can submit feedback
CREATE POLICY "Allow anonymous feedback insert" ON feedback
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Authenticated users can reply
CREATE POLICY "Allow authenticated users to reply" ON feedback_replies
  FOR INSERT TO authenticated WITH CHECK (true);

-- Users can delete their own feedback/replies
CREATE POLICY "Allow users to delete own feedback" ON feedback
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete own replies" ON feedback_replies
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Admin can delete any feedback/reply
-- Replace 'YOUR_ADMIN_USER_ID' with your actual Supabase user UUID
CREATE POLICY "Allow admin to delete any feedback" ON feedback
  FOR DELETE TO authenticated USING (auth.uid() = 'YOUR_ADMIN_USER_ID');

CREATE POLICY "Allow admin to delete any reply" ON feedback_replies
  FOR DELETE TO authenticated USING (auth.uid() = 'YOUR_ADMIN_USER_ID');

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_replies_feedback_id ON feedback_replies(feedback_id);

-- To find your admin user ID:
-- 1. Log into your website
-- 2. Go to Supabase Dashboard → Authentication → Users
-- 3. Find your user and copy the UUID
-- 4. Replace 'YOUR_ADMIN_USER_ID' in the policies above and re-run
-- 5. Also set NEXT_PUBLIC_ADMIN_USER_ID in Vercel environment variables
