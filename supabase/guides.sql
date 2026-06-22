-- Run this SQL in Supabase SQL Editor to create the guides table

CREATE TABLE IF NOT EXISTS guides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  character TEXT,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;

-- Everyone can read guides
CREATE POLICY "Allow everyone to read guides" ON guides
  FOR SELECT TO anon, authenticated USING (true);

-- Authenticated users can create guides
CREATE POLICY "Allow authenticated users to create guides" ON guides
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can update/delete their own guides
CREATE POLICY "Allow users to update own guides" ON guides
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete own guides" ON guides
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Likes count (denormalized for fast sorting)
ALTER TABLE guides ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- Guide likes
CREATE TABLE IF NOT EXISTS guide_likes (
  guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (guide_id, user_id)
);

ALTER TABLE guide_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read guide likes" ON guide_likes
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow insert own guide like" ON guide_likes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow delete own guide like" ON guide_likes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_guides_created_at ON guides(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guides_updated_at ON guides(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_guides_character ON guides(character);
CREATE INDEX IF NOT EXISTS idx_guides_user_id ON guides(user_id);
CREATE INDEX IF NOT EXISTS idx_guides_likes_count ON guides(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_guide_likes_user_id ON guide_likes(user_id);

/*
-- ============================================================
-- 管理员删除权限（可选）
-- 先运行上面的 SQL 创建表，然后按以下步骤操作：
-- 1. 登录你的网站
-- 2. 去 Supabase → Authentication → Users 找到自己的用户 UUID
-- 3. 把下面的 'YOUR_ADMIN_USER_ID' 替换成真实 UUID
-- 4. 单独运行这段 SQL
-- 5. 同时在 Vercel 环境变量里设置 NEXT_PUBLIC_ADMIN_USER_ID
-- ============================================================

DROP POLICY IF EXISTS "Allow admin to delete any guide" ON guides;
CREATE POLICY "Allow admin to delete any guide" ON guides
  FOR DELETE TO authenticated USING (auth.uid() = 'YOUR_ADMIN_USER_ID');
*/
