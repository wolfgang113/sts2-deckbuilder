-- Page views analytics table
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id);

-- Composite index to speed up path aggregation (count per path with index-only scans)
CREATE INDEX IF NOT EXISTS idx_page_views_path_created_at ON page_views(path, created_at);

-- Enable RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone visiting the site to record a page view
DROP POLICY IF EXISTS "Allow anonymous page view inserts" ON page_views;
CREATE POLICY "Allow anonymous page view inserts" ON page_views
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Only authenticated users can read stats (adjust as needed)
DROP POLICY IF EXISTS "Allow authenticated users to read stats" ON page_views;
CREATE POLICY "Allow authenticated users to read stats" ON page_views
  FOR SELECT TO authenticated USING (true);

-- Helper function to get top paths
CREATE OR REPLACE FUNCTION get_top_paths(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(path TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT pv.path, COUNT(*)::BIGINT as count
  FROM page_views pv
  GROUP BY pv.path
  ORDER BY count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Aggregated stats function: single round-trip, single table scan for counts
CREATE OR REPLACE FUNCTION get_page_view_stats()
RETURNS TABLE(
  total BIGINT,
  today BIGINT,
  yesterday BIGINT,
  this_week BIGINT,
  this_month BIGINT,
  top_paths JSONB
) AS $$
DECLARE
  today_start TIMESTAMPTZ := date_trunc('day', NOW());
  yesterday_start TIMESTAMPTZ := today_start - INTERVAL '1 day';
  week_start TIMESTAMPTZ := today_start - INTERVAL '6 days';
  month_start TIMESTAMPTZ := date_trunc('month', NOW());
BEGIN
  RETURN QUERY
  WITH counts AS (
    SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE created_at >= today_start) AS today,
      COUNT(*) FILTER (WHERE created_at >= yesterday_start AND created_at < today_start) AS yesterday,
      COUNT(*) FILTER (WHERE created_at >= week_start) AS this_week,
      COUNT(*) FILTER (WHERE created_at >= month_start) AS this_month
    FROM page_views
  ),
  top AS (
    SELECT jsonb_agg(jsonb_build_object('path', path, 'count', cnt) ORDER BY cnt DESC) AS paths
    FROM (
      SELECT pv.path, COUNT(*)::BIGINT AS cnt
      FROM page_views pv
      GROUP BY pv.path
      ORDER BY cnt DESC
      LIMIT 10
    ) t
  )
  SELECT
    c.total,
    c.today,
    c.yesterday,
    c.this_week,
    c.this_month,
    COALESCE(top.paths, '[]'::jsonb) AS top_paths
  FROM counts c
  CROSS JOIN top;
END;
$$ LANGUAGE plpgsql;

-- Add admin flag to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Allow users to read their own profile, including is_admin
DROP POLICY IF EXISTS "Allow users to read own profile" ON profiles;
CREATE POLICY "Allow users to read own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

-- Allow users to update their own display_name but not is_admin
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;
CREATE POLICY "Allow users to update own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
